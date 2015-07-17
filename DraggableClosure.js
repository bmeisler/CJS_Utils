/** a closure for turning movieclips into draggable objects, with many options
NOTE: there are no dependencies here - put those into the various callbacks 
Of course you can customize this class if that's convenient - but for the most part, you shouldn't have to.
*/
var draggableItem = function() {
        console.log("new instance of draggableItem");
        var my = {};

        /**
        adds various listeners, sets up cursor */
        function enable() {
            console.log("addListeners");
            my.mc.useHandCursor = true;
            my.mc.mouseEnabled = true;
            my.mc.mouseChildren = false;

            this.rolloverListener = my.mc.on("rollover", function(evt) {
                my.mc.cursor = 'pointer';
            });
            this.rolloutListener = my.mc.on("rollout", function(evt) {
                my.mc.cursor = 'default';
            });

            this.mousedownListener = my.mc.on("mousedown", function(evt) {
                this.offset = {
                    x: my.mc.x - evt.stageX,
                    y: my.mc.y - evt.stageY
                };
                if (my.mouseDownCallback !== null && my.mouseDownCallback !== undefined) {
                    my.mouseDownCallback(my, this);
                }
            });

            // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
            this.pressMoveListener = my.mc.on("pressmove", function(evt) {
                //commenting out next line constrains us to move in y directions only
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;
                if (my.pressMoveCallback !== null && my.pressMoveCallback !== undefined) {
                    my.pressMoveCallback(my, this);
                }
            });

            my.mc.onPress = function() {
                console.log("pressed draggable mc");
            };
            my.mc.onMouseUp = function() {
                console.log("draggable mc mouse up");
                if (my.mouseUpCallback !== null && my.mouseUpCallback !== undefined) {
                    my.mouseUpCallback(my, this);
                }
            };
        }
        /**
        return the dragged item to where it came from */
        function resetToStartPosition() {
            my.mc.x = my.originalX;
            my.mc.y = my.originalY;
        }
        /**
        stops draggability and all functionality - good for temporarily turning off dragging*/
        function disable() {
            my.mc.removeAllEventListeners();
        }
        /**
    @_main: the class or object that makes the call, in case we need to refer back to it; optional
    @_mc: the movieClip we are making draggable - REQUIRED
    @_mcSlave: an optional, secondary movie clip that we can make move, rotate, etc along with our main draggable mc; optional
    @_callback1: function called on initial click; optional
    @_callback2: function called while dragging; optional
    @_callback3: function called when stop dragging/release mouse; optional
    @_constraints: limit the dragging area; optional
    */
    function init(_main, _mc, _mcSlave, _callback1, _callback2, _callback3, _constraints){//constraints is an array of left, top, right, bottom
        console.log("draggableItem::init()");
        my.main = _main;
        this.mc = _mc;
        my.mc = _mc;
        my.mcSlave = _mcSlave;
        my.originalX = my.mc.x;
        my.originalY = my.mc.y;
        my.mouseDownCallback = _callback1;//what to do on initial click
        my.pressMoveCallback = _callback2;//what to do while we're dragging
        my.mouseUpCallback = _callback3;//what to do when we stop dragging
        if (_constraints !== null && _constraints !==undefined){//limit draggable area if you want
            my.left = _constraints[0];
            my.top = _constraints[1];
            my.right = _constraints[2];
            my.bottom = _constraints[3];
        }
       
        enable();//turns on various listeners, makes it draggable
        return my;//the key - holds all the data for outside use
    }
    var mc = null;
    return {
        init : init,
        resetToStartPosition: resetToStartPosition,
        enable: enable,
        disable: disable,
        mc : mc
    };
};


//how to initialize it:

this.thePoints = [movieClipA, movieClipB];
this.draggables = [];
var constraints;
var draggablePointA;
var draggablePointB;

draggablePointA = draggableItem();
constraints = [10, 10, 400, 400];//left, top, right, bottom
draggablePointA.init(this, this.thePoints[0], this.thePoints[1], onPointDown, onPointPress, onPointRelease, constraints);
        
draggablePointB = draggableItem();
constraints = [10, 10, 400, 400];//left, top, right, bottom
draggablePointB.init(this, this.thePoints[1], this.thePoints[0], onPointDown, onPointPress, onPointRelease, constraints);

this.draggables.push(draggablePointA);
this.draggables.push(draggablePointB);

//example functions
function onPointDown(my) {
    console.log("onPointDown");
    my.main.viz.getPlayer().stopWaiting("task0");//code specific to one particular project
}
/**
this function will make the slave move in tandem at a specificed distance*/
function onPointPress(my, obj) {
    console.log("callback1 - onPointPress");
    my.main.drawQuad(my.main.lineAttributes);
    if (my.mcSlave !== null && my.mcSlave !== undefined) {
        //do something with my.mcSlave
        if (my.mcSlave.x > obj.x) {
            my.mcSlave.x = obj.x + 200;
        } else {
            my.mcSlave.x = obj.x - 200;
        }
        my.mcSlave.y = obj.y;
    }
}

function onPointRelease(my) {
    console.log("callback2 - onPointRelease");
}
