/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class BubbleChart {
  constructor(data) {
    this.data = data;
//    this.width = 1400;
//    this.height = 1000;
    this.width = 800;
    this.height = 600;    
    this.heightShift = 100;
    this.default_radius = 7;

    this.tooltip = CustomTooltip("my_tooltip", 240);

    // locations the nodes will move towards depending on which view is currently being used
    this.center = {x: this.width / 2, y: this.height / 2 - this.heightShift};

    // used when setting up force and moving around nodes
    this.layout_gravity = -0.01;
    this.damper = 0.5;

    // these will be set in create_nodes and create_vis
    this.vis = null;
    this.force = null;
    this.circles = null;
    this.nodes = [];

    this.create_nodes();
    this.create_vis();
  }

  // create node objects from original data, that will serve as the data behind each
  // bubble in the vis, then add each node to @nodes to be used later
  create_nodes() {
    return this.data.forEach((d, i) => {
      const node = {
        id: i,
        original: d,
        radius: this.default_radius,
        value: 99,
        x: Math.random() * this.width,
        y: Math.random() * this.height
      };
      return this.nodes.push(node);
    });
  }

  // create svg at #vis and then
  // create circle representation for each node
  create_vis() {
    this.vis = d3.select("#playground").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("id", "svg_vis");

    this.circles = this.vis.selectAll("circle")
      .data(this.nodes, d => d.id);

    // used because we need 'this' in the
    // mouse callbacks
    const that = this;

    this.circles.enter().append("circle")
      .attr("r", 5)
      .style("fill", d => '#afafaf')
      .attr("stroke-width", 2)
      .attr("stroke", d => '#efefef')
      .attr("id", d => `bubble_${d.id}`)
      .attr("opacity", 0)
      .on("mouseover", function(d,i) { return that.show_details(d,i,this); })
      .on("mouseout", function(d,i) { return that.hide_details(d,i,this); });

    // Fancy transition to make bubbles appear, ending with the correct radius
    return this.circles.transition().duration(2000).attr("opacity",1).attr("r", d => d.radius);
  }


  // Charge function that is called for each node.
  // Charge is proportional to the diameter of the circle (which is stored in the radius attribute
  // of the circle's associated data. This is done to allow for accurate collision
  // detection with nodes of different sizes. Charge is negative because we want nodes to repel.
  charge(d) {
    if (d.radius === 0) {
      return 0;
    }
    return -Math.pow(d.radius, 2);
  }

  // Starts up the force layout with the default values
  start() {
    this.force = d3.layout.force()
      .nodes(this.nodes)
      .size([this.width, this.height]);

    return this.circles.call(this.force.drag);
  }

  // Sets up force layout to display all nodes in one circle.
  display_group_all() {
    this.hide_labels();
    this.force.gravity(this.layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on("tick", e => {
        return this.circles.each(this.move_towards_center(e.alpha))
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
    return this.force.start();
  }

  // Moves all circles towards the @center of the visualization
  move_towards_center(alpha) {
    return d => {
      d.x = d.x + ((this.center.x - d.x) * (this.damper + 0.02) * alpha);
      return d.y = d.y + ((this.center.y - d.y) * (this.damper + 0.02) * alpha);
    };
  }

  get_color_map_lookup_set(allValuesArray) {
    const colors = ["#ff0589", "#065dff","#00d7f7","#00c826","#ffbc49","#f20000",
                     "#742cff", "#0575ff", "#8aff05", "#ec9300",
                     "#728cff","#7deeff","#00f72f","#ffd106","#e60000",
                     "#a97dff","#7db7ff","#c2ff7d","#ffce7d","#ff7da7"];

    let index = 0;
    const color_map = {};
    for (let value of Array.from(allValuesArray)) {
       color_map[value] = colors[index];
       index = index + 1;
       if (index >= colors.length) { index = 0; }
    }
    return color_map;
  }

  get_size_map_lookup_set(allValuesArray) {
    const max = 22;
    const initial = 4;
    const step = 2;
    let index = initial;
    const size_map = {};
    for (let value of Array.from(allValuesArray)) {
       size_map[value] = index;
       index = index + step;
       if (index >= max) { index = initial; }
    }
    return size_map;
  }

  get_type_from_key_name(keyName) {
    // if (/^Achievement/.test(keyName)) {
    //   return "Achievement";
    // }
    // if (/^Grade/.test(keyName)) {
    //   return "Grade";
    // }
    return "Other";
  }

  get_color_map(keyName, allValuesArray) {
    const key_type = this.get_type_from_key_name(keyName);
    switch (key_type) {
        //case "Achievement": return this.get_color_map_achievement(allValuesArray);
        //case "Grade": return this.get_color_map_grade(allValuesArray);
        default: return this.get_color_map_lookup_set(allValuesArray);
    }
  }

  get_size_map(keyName, allValuesArray) {
    const key_type = this.get_type_from_key_name(keyName);
    switch (key_type) {
//        case "Achievement": return this.get_color_map_achievement(allValuesArray);
//        case "Grade": return this.get_color_map_grade(allValuesArray);
        default: return this.get_size_map_lookup_set(allValuesArray);
    }
  }

  sort(keyName, allValuesArray) {
    const key_type = this.get_type_from_key_name(keyName);
    switch (key_type) {
        //case "Achievement": return allValuesArray.sort((a,b) => { return Number(a) - Number(b); });
        default: return allValuesArray.sort();
    }
  }

  remove_sizes() {
    this.circles.transition().duration(2000).attr("r",this.default_radius);
    return hide_size_chart();
  }

  remove_colors() {
    this.circles.transition().duration(2000).style("fill","#cfcfcf");
    return hide_color_chart();
  }

  color_by(what_to_color_by) {
    this.what_to_color_by = what_to_color_by;
    const allValuesArray = this.get_distinct_values(what_to_color_by);
    const color_mapper = this.get_color_map(what_to_color_by, allValuesArray);
    show_color_chart(what_to_color_by, color_mapper);
    return this.circles.transition().duration(1000).style("fill",d => color_mapper[d.original[what_to_color_by]]);
  }

  size_by(what_to_size_by) {
    this.what_to_size_by = what_to_size_by;
    const allValuesArray = this.get_distinct_values(what_to_size_by);
    const size_mapper = this.get_size_map(what_to_size_by, allValuesArray);
    show_size_chart(what_to_size_by, size_mapper);
    return this.circles.transition().duration(1000).attr("r", d => size_mapper[d.original[what_to_size_by]]);
  }

  get_distinct_values(what) {
    const allValues = {};
    this.nodes.forEach(d => {
      const value = d.original[what];
      return allValues[value] = true;
    });
    const allValuesArray = [];
    for (let key in allValues) {
      const value = allValues[key];
      allValuesArray.push(key);
    }
    this.sort(what, allValuesArray);
    return allValuesArray;
  }

  group_by(what_to_group_by) {
    this.what_to_group_by = what_to_group_by;
    let position = 2;
    const allValuesArray = this.get_distinct_values(what_to_group_by);
    const numCenters = allValuesArray.length;
    const total_slots = allValuesArray.length + 4;

    this.group_centers = {};
    this.group_labels = {};

    allValuesArray.forEach(i => {
      const x_position = (this.width * position) / total_slots;
      this.group_centers[i] = { x: x_position, y : this.height /2 - this.heightShift};
      this.group_labels[i] = x_position;
      return position = position + 1;
    });

    this.hide_labels();
    this.force.gravity(this.layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on("tick", e => {
        return this.circles.each(this.move_towards_group_center(e.alpha))
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
    this.force.start();
    return this.display_labels();
  }

  // move all circles to their associated @group_centers
  move_towards_group_center(alpha) {
    return d => {
      const value = d.original[this.what_to_group_by];
      const target = this.group_centers[value];
      d.x = d.x + ((target.x - d.x) * (this.damper + 0.02) * alpha * 1.1);
      return d.y = d.y + ((target.y - d.y) * (this.damper + 0.02) * alpha * 1.1);
    };
  }


  // sets the display of bubbles to be separated into each group.
  display_by_group() {
    this.force.gravity(this.layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on("tick", e => {
        return this.circles.each(this.move_towards_group(e.alpha))
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
    this.force.start();

    return this.display_years();
  }

  // move all circles to their associated @year_centers
  move_towards_group(alpha) {
    return d => {
      const target = this.group_centers[d.group];
      d.x = d.x + ((target.x - d.x) * (this.damper + 0.02) * alpha * 1.1);
      return d.y = d.y + ((target.y - d.y) * (this.damper + 0.02) * alpha * 1.1);
    };
  }

  display_labels() {
    const label_data = d3.keys(this.group_labels);
    const labels = this.vis.selectAll(".top_labels")
      .data(label_data);

    return labels.enter().append("text")
      .attr("class", "top_labels")
      .attr("x", d => this.group_labels[d] )
      .attr("y", 40)
      .attr("text-anchor", "start")
      .text(d => d);
  }

  // Method to hide group titles
  hide_labels() {
    let labels;
    return labels = this.vis.selectAll(".top_labels").remove();
  }

  show_details(data, i, element) {
    d3.select(element).attr("stroke", "#efefef");
    let content = "";
    for (let key in data.original) {
      const value = data.original[key];
      const title = key.substring(key.indexOf(":")+1);
      content += `<span class=\"name\">${title}:</span><span class=\"value\"> ${value}</span><br/>`;
    }

    return this.tooltip.showTooltip(content,d3.event);
  }

  hide_details(data, i, element) {
    d3.select(element).attr("stroke", "#efefef");
    return this.tooltip.hideTooltip();
  }

  use_filters(filters) {
    return this.nodes.forEach(d => {
       d.radius = this.default_radius;
       filters.discrete.forEach(filter => {
         const value = d.original[filter.target];
         if (filter.removeValues[value] != null) { return d.radius = 0; }
       });
       return this.do_filter();
    });
  }

  do_filter() {
    this.force.start();
    return this.circles.transition().duration(2000).attr("r", d => d.radius);
  }
}

const root = typeof exports !== 'undefined' && exports !== null ? exports : this;

$(function() {
  let chart = null;

  const render_playground = function(csv) {
    render_filters_colors_and_groups(csv);
    return render_chart(csv);
  };
  var render_chart = function(csv) {
    chart = new BubbleChart(csv);
    chart.start();
    return root.display_all();
  };
  root.display_all = () => {
    return chart.display_group_all();
  };
  root.group_by = groupBy => {
    if (groupBy === '') {
        return chart.display_group_all();
    } else {
        return chart.group_by(groupBy);
      }
  };
  root.color_by = colorBy => {
    if (colorBy === '') {
        return chart.remove_colors();
    } else {
        return chart.color_by(colorBy);
      }
  };
  root.size_by = sizeBy => {
    if (sizeBy === '') {
        return chart.remove_sizes();
    } else {
        return chart.size_by(sizeBy);
      }
  };
  root.use_filters = filters => {
    return chart.use_filters(filters);
  };

  return d3.csv("data/input.csv", render_playground);
});
