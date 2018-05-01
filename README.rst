============================
Visual Bubbles
============================

Are you looking for a quick and easy way to visualize your data? Visual Bubbles is a right tool for the job. It provides quite a straightforward way of dealing with moderate complexity data. Long story short, it allows to filter, group, color, size and render your data in a highly visual manner.

-----------
Quick demo
-----------
Let's quickly check Tesla results for previous couple of years:

.. image:: doc/images/teslaStat.gif?raw=true
   :align: center

So, it does look like Tesla did a good job increasing overall sales. Anyway, this is just a basic demo of the tool.

-----------
Motivation
-----------
We used to think visually, so it is better to visualise data in order to make analysis natural and easy to track and understand. Quite often, there is a task to do quick investigation of the small or medium data-sets. It definitely can be done with Excel, but sometimes a bit more visual approach might helpful.

The tool is designed to simplify visualization as much as possible. Basically, it only requires input data to be properly tagged. Other features are:

- Simple data preparation
- Rich visual comparison
- Presentation ready graphics
- Animated transitions
- `d3.js`_ based visualization

.. _d3.js: https://d3js.org

--------
Example
--------
Let's use `Autonomous Vehicle Survey of Bicyclists and Pedestrians in Pittsburgh, 2017`_ dataset for a quick test. The dataset itself contains pretty interesting information:

   In Pittsburgh, Autonomous Vehicle (AV) companies have been testing autonomous vehicles since September 2016. In early 2017, we set out to design a survey to see both how Pittsburgh residents feel about about sharing the road with AVs as a bicyclist and/or as a pedestrian.

Let's do a quick sanity check for the results. Here are fields we will use:

1. **AVSafetyPotential:** Do you think that AVs have the potential to reduce injuries and fatalities? *Yes; Maybe; No; Not Sure*
2. **RegulationSchoolZone:** On public streets, do you think that a regulatory authority should... Prevent AVs from operating in an active school zone? *Yes; Not Sure; No*
3. **InteractPedestrian:** Have you interacted with an AV while riding your bicycle on the streets of Pittsburgh? *No; Not Sure; Yes*

It might be natural to expect anybody saying AVs have the potential to reduce injuries also to say AVs should not be prevented from operating in an active school zone (the topic is pretty sensitive, so this is just an assumption).

Step 1: Group by AVSafetyPotential
----------------------------------
.. image:: doc/images/av01.png?raw=true
   :align: center

So, we can see there is somewhat like a split opinion. Let's add to the picture school zones answers.

Step 2: Color by RegulationSchoolZone
-------------------------------------
.. image:: doc/images/av02.png?raw=true
   :align: center

As expected, a majority of respondents saying AVs have no potential also wants regulatory authority to prevent prevent AVs from operating in an active school zone. Let's check if the majority had any experience interacting with AVs.

Step 3: Size by InteractPedestrian
-----------------------------------
.. image:: doc/images/av03.png?raw=true
   :align: center

.. _Autonomous Vehicle Survey of Bicyclists and Pedestrians in Pittsburgh, 2017: https://catalog.data.gov/dataset/autonomous-vehicle-survey-of-bicyclists-and-pedestrians-in-pittsburgh-2017

--------------
A tiny manual
--------------
Properly annotated CSV file is required in order to make visualisation possible. Generally speaking, input CSV file should start with a row, containing column titles. If column values are supposed to be visualised column title should contain ``Lookup:`` prefix

::

   Response ID,Start Date,End Date,Lookup:Status,Lookup:Source Type
   260279884,02/22/2017 10:38:27 AM PST,02/22/2017 10:46:22 AM PST,COMPLETE,Survey Link
   260293425,02/22/2017 5:59:59 PM PST,02/22/2017 6:04:04 PM PST,COMPLETE,Survey Link

Please notice, ``Status`` and  ``Source Type`` contain ``Lookup::`` prefix, so the tool understands what data should be rendered. Basically, this is the only manual required, just use ``Lookup:`` prefix and give the tool a try.

-------
Changes
-------
Initially this tool was developed by an *unknown* author. The functionality looked quite promising, so additional changes were made:

- added **Size by** option
- fully reworked color palette
- cleaned the code
- switched to a dark theme
- removed Coffee script in favour of a plain JavaScript
- fixed multiple usability issues with font sizes, etc

-------
License
-------
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License a

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
