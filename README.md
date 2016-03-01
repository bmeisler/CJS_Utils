# CJS_Utils
Lots of little pieces of code I use to work with CreateJS

<h3>DashedLineTo</h3>

little util for drawing dashed line of whatever length

Circle_prototypeANDModule.js

A class for drawing ellipses (default is circles) of any radius, color and stroke. Can draw circles within circles.
For testing purposes, I wrote this as both a closure and using prototype.

DNDItem_prototype_vs_modular.js

An all-purpose class for creating draggable objects. Options include:
- creating an array of draggable objects
- create an array of drop targets
- assign a specific drop target to a specific draggable item
- do we create a copy when we drag the item?
- a callback function when a successful drop is made (eg, draggable item dropped onto the respective drop target)

This class is very flexible and handles just about all situations we would encounter with AgileMind modules - card games, tile games, etc.

I originally wrote it using prototype, then re-wrote it using the module design pattern; both versions are included here.

hashmap.js

Before we had access to lodash, I wrote this helper class to make hashmaps.
