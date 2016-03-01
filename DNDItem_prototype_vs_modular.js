/*global Main, DNDItem, DND */


var viz;
var stage;
/** I use the Main class to not only control the various instances of the DNDItems, but also to hold
the "magic number" info, etc, that would keep DNDItem from being modular/reusable. DNDItem should have NO knowledge of
what the drops do, how they effect other mcs, etc.
@_toBeDragged: an array of items we will make draggable
@_dropTargets: potential landing spots for the draggable items. Pass in NULL to just create draggable items
@_correctTargets: should be optional - a list of draggable items to line up with the drop/landing spots
*/

function Main(_root, _viz, _toBeDragged, _dropTargets,  _correctTargets, _draggableClones, _callBack){
    console.log("main");
this.root= _root;
this.viz = _viz;
this.toBeDragged = _toBeDragged;
this.dropTargets = _dropTargets;
this.draggableClones = _draggableClones;
this.correctTargets = _correctTargets;
this.draggables = [];
this.correctItems = 0;
this.callBack = _callBack;
//stage = this.viz.cjsStage;


var i, draggable;
for (i=0; i < this.toBeDragged.length; i++){
    //draggable = new DNDItem(this, this.toBeDragged[i], this.dropTargets, i);
    draggable =  DND();
    draggable.create(this, this.toBeDragged[i], this.dropTargets, i, this.draggableClones[i]);
    draggable.popIntoPlace(true);//does the item snap into place in the center, or stay wherever it's dropped?
    draggable.singleOccupancy(false);//restricts one dragged item to one dropspot; once occupied, can't drop onto the dropspot
    draggable.putOnTop(true);//moves to highest depth when pressed
    draggable.dragCopy(true);//duplicate the original and move it, leave the original in place
    draggable.isReplaceable(true);//can replace one dropped item with another
    draggable.checkMark(this.toBeDragged[i].check_mc);
    draggable.errorMark(this.toBeDragged[i].error_mc);
    this.draggables.push(draggable);
}
if(this.dropTargets !==null){
    for (i=0; i < this.dropTargets.length; i++){
        this.dropTargets[i].occupied = false;
        this.dropTargets[i].droppedItem = null;
        //this.dropTargets[i].correctItemMc = this.correctTargets[i];
    }
}

this.numDroppedItems = 0;
this.singleOccupancy = false;
this.correctId = 0;

}
Main.prototype.reset = function(_whichBag){
console.log("main.reset");
var i;
this.correctItems = 0;
this.numDroppedItems = 0;
if(this.dropTargets !==null){
    for (i=0; i < this.dropTargets.length; i++){
        this.dropTargets[i].occupied = false;
        this.dropTargets[i].droppedItem = null;
    }
}

this.currentDropSpot = null;
this.currentDNDItem = null;
for (i=0; i < this.draggables.length; i++){
    //this.draggables[i].resetStartPosition();
    this.draggables[i].reset();
}


};
/* call this when we want to see if everything has been dropped correctly */
Main.prototype.check = function(){
   var i;
   var numCorrectDrops=0;
   for (i=0; i<this.dropTargets.length; i++){
   if (this.dropTargets[i].droppedItem.DND_mc === this.dropTargets[i].correctItemMc){
   numCorrectDrops++;
   }
   }
   if (numCorrectDrops===this.dropTargets.length){
   this.root.showCap("capcorrect");
   }else{
   this.root.showCap("capincorrect");
   }
};
Main.prototype.goodDrop = function(_dropSpotNum, _DNDItem){
    console.log("do stuff on a good drop");
    console.log("this.currentDNDItem idNum " + this.currentDNDItem.idNum);
    console.log("_DNDItem idNum " + _DNDItem.idNum);
    this.numDroppedItems++;
    console.log("numDroppedItems: " + this.numDroppedItems);
    if (this.numDroppedItems >= 3){//you get three chances
        //put correct tile in place
        var i;
        for (i=0; i<this.draggables.length; i++){
            this.draggables[i].reset();
        }
        var correctItem = this.draggables[this.correctId];//put the correct item in place on the dropspot
        correctItem.mc.x = this.dropTargets[_dropSpotNum].x;
        correctItem.mc.y = this.dropTargets[_dropSpotNum].y;
        this.callBack("over");//"p3_cap2"
        
      //var wrongDraggables = this.draggables.splice(this.correctId, 1);
      
    }else{
        if (_DNDItem.idNum === this.correctId){//if it's the correct tile
            _DNDItem.check_mc.visible = true;
            _DNDItem.error_mc.visible = false;
            this.callBack("correct");//"p3_cap1"
        }else{
            _DNDItem.check_mc.visible = false;
            _DNDItem.error_mc.visible = true;
            this.callBack("incorrect");//"p3_cap3"
        }
    }
};

///////////////////////////////////////////////////////////////////////////////////////
//// CONSTRUCTOR
/* main - the parent class where we do stuff particular to this dnd item, eg custom stuff
 _mc - the movie clip we're dropping
 _dropTargets - an array of potential landing areas */
function DNDItem(_main, _mc, _dropTargets, _id) {
    console.log("created a new DNDItem with mc: " + _mc);
this.main = _main;
this.DND_mc = _mc;
this.dropTargets = _dropTargets;
this.START_X = _mc.x;
this.START_Y = _mc.y;
this.idNum = _id;
this.init();
}
DNDItem.prototype.setStartPosition = function(px, py){
this.START_X = px;
this.START_Y = py;

};
DNDItem.prototype.resetStartPosition = function(){
this.DND_mc.x = this.START_X;
this.DND_mc.y = this.START_Y;
};
//// METHODS
// public
 DNDItem.prototype.enable=function(b) {
this.DND_mc.enabled = b;
};


DNDItem.prototype.reset = function() {
this.resetStartPosition();
this.DND_mc.gotoAndStop('start');
this.DND_mc.removeAllEventListeners("tick");
if(this.check_mc!==null){
    this.check_mc.visible = false;
}
if(this.error_mc!==null){
    this.error_mc.visible = false;
}
if(this.dragCopy){
    this.copy.x = this.START_X;
    this.copy.y = this.START_Y;
    this.copy.check_mc.visible = false;
    this.copy.error_mc.visible = false;
    this.copy.gotoAndStop('start');
    this.copy.removeAllEventListeners("tick");
}
};

/* can the item land whereever on the landing spot, or does it snap to the center?
 NOTE: both drop item and landing spot must be center registered for this to work*/
DNDItem.prototype.popIntoPlace = function(_b){
this.popIntoPlace = _b;
};
/* can more than one item land in a dropSpot/landing space?*/
DNDItem.prototype.singleOccupancy = function(_b){
this.singleOccupancy = _b;
};
/* can more than one item land in a dropSpot/landing space?*/
DNDItem.prototype.isReplaceable = function(_b){
    this.isReplaceable = _b;
};
/* can more than one item land in a dropSpot/landing space?*/
DNDItem.prototype.putOnTop = function(_b){
this.putOnTop = _b;
};
/* leave the original item in place and create and drag a copy*/
DNDItem.prototype.dragCopy = function(_b){
    this.dragCopy = _b;
};
/* if there's a check mark, turn it off*/
DNDItem.prototype.checkMark = function(check_mc){
    this.check_mc = check_mc;
    this.check_mc.visible = false;
};
/* if there's an error mark, turn it off*/
DNDItem.prototype.errorMark = function(error_mc){
    this.error_mc = error_mc;
    this.error_mc.visible = false;
};


// makes the items draggable
DNDItem.prototype.init=function() {
console.log("DNDItem.init");
if (this.dragCopy){
    var LibRef = this.main.draggableClones[this.idNum];//useing a classRef here to make copies, instead of passing in mcs - more flexible, I think
    this.copy = new LibRef();
    //this.copy = this.main.draggableClones[this.idNum];
    this.DND_mc.parent.addChild(this.copy);
    this.copy.x = this.START_X;
    this.copy.y = this.START_Y;
    this.copy.check_mc.visible = false;
    this.copy.error_mc.visible = false;
    this.copy.parent.setChildIndex(this.DND_mc, this.copy.parent.getNumChildren()-1);
}
var t = this;
this.DND_mc.useHandCursor=true;
this.DND_mc.mouseEnabled=true;
this.DND_mc.mouseChildren=false;

this.rolloverListener = this.DND_mc.on("rollover", function(evt){
this.cursor = 'pointer';
});
this.rolloutListener = this.DND_mc.on("rollout", function(evt){
this.cursor = 'default';
});

this.mousedownListener = this.DND_mc.on("mousedown", function(evt) {
this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
t.main.viz.getPlayer().stopWaiting("task0");
if(t.putOnTop){
t.DND_mc.parent.setChildIndex(t.DND_mc, t.DND_mc.parent.getNumChildren()-1);
//stage.update();
}
});

// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
this.pressMoveListener = this.DND_mc.on("pressmove", function(evt) {
this.x = evt.stageX+ this.offset.x;
this.y = evt.stageY+ this.offset.y;
});

this.DND_mc.onPress = function() {
console.log("pressed DNDItem");
t.startDrag();
};



this.DND_mc.onMouseUp = function() {
console.log("DNDItem mouse up");
t.stopDrag();

if (t.dropTargets !== null){
  var targetHit = t.check();
  //check if this item was previously dropped somewhere else. If so, "clear" that landing spot
  //so it can be used again
  if(t.main.singleOccupancy){
      t.removeFromSlots();
  }

  if (targetHit !==null){
  t.onGoodDrop(targetHit);//do something, with knowledge of the landing spot
      }else{
  t.resetStartPosition();
  }
}

};

};
DNDItem.prototype.onGoodDrop = function(_targetNumHit){
console.log("this must be the place!");

    this.main.goodDrop(_targetNumHit, this);//go back in Main, so we can customize it
};
DNDItem.prototype.startDrag = function(e){
console.log("startDrag");
};
DNDItem.prototype.disable = function(){
console.log("disable DNDItem");
if (this.DND_mc){
    this.DND_mc.removeAllEventListeners();
}

};
/* call this on both successful drops and misses, if set for single occupancy,
If an item was previously on another slot, remove it's reference from that slot */
DNDItem.prototype.removeFromSlots = function(){
var i;
for (i=0; i<this.dropTargets.length; i++){
//look for a match, but make sure it's not the current drop spot, because we don't want to clear that one!
if(this.dropTargets[i].droppedItem ===this.main.currentDNDItem && this.dropTargets[i] !== this.main.currentDropSpot){
this.dropTargets[i].droppedItem = null;
this.dropTargets[i].occupied = false;
this.main.numDroppedItems--;
}
}
};
DNDItem.prototype.stopDrag = function(e){
console.log("stopDrag");
};
DNDItem.prototype.check=function() {
var i, theDropSpotNum, p0;

for (i = 0; i < this.dropTargets.length; i++){
p0 = this.DND_mc.localToLocal(0,0, this.dropTargets[i]);//did the target land on a drop spot?
console.log(p0.x, p0.y);

if ( this.dropTargets[i].hitTest( p0.x, p0.y) ){//dropped item landed on a drop target
if(this.singleOccupancy){
    if (this.dropTargets[i].occupied ===false){//drop target is vacant, go ahead
        console.log("hit dropspot number " + i);
        theDropSpotNum = i;
        this.main.currentDropSpot = this.dropTargets[i];
        this.main.currentDNDItem = this;
        if (this.popIntoPlace===true){
            this.DND_mc.x = this.dropTargets[i].x;
            this.DND_mc.y = this.dropTargets[i].y;
        }
        this.dropTargets[i].occupied = true;
        this.dropTargets[i].droppedItem=this;
        break;
    }else{
        console.log("sorry, this drop spot is occupied");
        theDropSpotNum =null;
        this.main.currentDropSpot = this.dropTargets[i];
        this.main.currentDNDItem = this;
    }
}else{//can have more than one dragged item in an dropspot/landing spot
    console.log("hit dropspot number " + i);
    if(this.isReplaceable){
        if(this.main.currentDNDItem!==null && this.main.currentDNDItem!==undefined){
            this.main.currentDNDItem.reset();//send the current dnditem back to its original position, and unoccupy the dropspot
        }
    }
    theDropSpotNum = i;
    this.main.currentDropSpot = this.dropTargets[i];
    this.main.currentDNDItem = this;
    if (this.popIntoPlace===true){
        this.DND_mc.x = this.dropTargets[i].x;
        this.DND_mc.y = this.dropTargets[i].y;
    }
    this.dropTargets[i].occupied = true;
    this.dropTargets[i].droppedItem=this;
    break;
}


}else{//missed the drop spot
    console.log("missed the drop spot");
    theDropSpotNum =null;
    this.main.currentDropSpot = null;
    this.main.currentDNDItem = this;
    }
}
return theDropSpotNum;
};
//////////////////////MODULE VERSION
var DND = function(){
    var DNDItem = {};

    /**
    convert a plain old movie clip into a draggable clip, with various features
    @param: _main - the object that created this
    @param: _mc - the clip we're making draggable
    @param: _dropTargets - an array of clips we can drpo this clip on
    @param: _id - an idNum, unique to each draggable clip
    @param _clone - the Flash Lib reference, so we can copy the mc, if we need to

    */
    DNDItem.create = function (_main, _mc, _dropTargets, _id, _clone) {
        console.log("created a new DNDItem with mc: " + _mc);
        this.main = _main;
        this.mc = _mc;
        this.dropTargets = _dropTargets;
        this.idNum = _id;
        this.clone = _clone;
        this.init();
    };

    DNDItem.setStartPosition = function(_mc){
        this.START_X = _mc.x;
        this.START_Y = _mc.y;
    };
    DNDItem.resetStartPosition = function(){
        this.mc.x = this.START_X;
        this.mc.y = this.START_Y;
    };
    DNDItem.makeCopy = function(){
        var LibRef = this.clone;//useing a classRef here to make copies, instead of passing in mcs - more flexible, I think
        this.copy = new LibRef();
        //this.copy = this.main.draggableClones[this.idNum];
        this.mc.parent.addChild(this.copy);
        this.copy.x = this.START_X;
        this.copy.y = this.START_Y;
        this.copy.check_mc.visible = false;
        this.copy.error_mc.visible = false;
        this.copy.parent.setChildIndex(this.mc, this.copy.parent.getNumChildren()-1);
    };
    // make it draggable, etc.
    DNDItem.init = function() {
        console.log("DNDItem.init");
        DNDItem.setStartPosition(this.mc);
        if (this.dragCopy){
            this.makeCopy();
        }
        this.addListeners();

    };

    DNDItem.addListeners = function(){
        //var that = this;
        this.mc.useHandCursor=true;
        this.mc.mouseEnabled=true;
        this.mc.mouseChildren=false;

        this.rolloverListener = this.mc.on("rollover", function(evt){
            this.cursor = 'pointer';
        });
        this.rolloutListener = this.mc.on("rollout", function(evt){
            this.cursor = 'default';
        });

        this.mousedownListener = this.mc.on("mousedown", function(evt) {
            this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
            //that.main.viz.getPlayer().stopWaiting("task0");
            if(DNDItem.putOnTop){
                DNDItem.mc.parent.setChildIndex(DNDItem.mc, DNDItem.mc.parent.getNumChildren()-1);
            }
        });

        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
        this.pressMoveListener = this.mc.on("pressmove", function(evt) {
            this.x = evt.stageX+ this.offset.x;
            this.y = evt.stageY+ this.offset.y;
        });

        this.mc.onPress = function() {
            console.log("pressed DNDItem");
            DNDItem.startDrag();
        };



        this.mc.onMouseUp = function() {
        console.log("DNDItem mouse up");
        DNDItem.stopDrag();

        if (DNDItem.dropTargets !== null){
          var targetHit = DNDItem.check();
          //check if this item was previously dropped somewhere else. If so, "clear" that landing spot
          //so it can be used again
          if(DNDItem.main.singleOccupancy){
              DNDItem.removeFromSlots();
          }

          if (targetHit !==null){
              DNDItem.onGoodDrop(targetHit);//do something, with knowledge of the landing spot
            }else{
                DNDItem.resetStartPosition();
          }
        }

        };
    };

    /**
    setters for various functionality we can add, or not 
    @param - _b - true or false

     can the item land whereever on the landing spot, or does it snap to the center?
     NOTE: both drop item and landing spot must be center registered for this to work*/
    DNDItem.popIntoPlace = function(_b){
    this.popIntoPlace = _b;
    };
    /* can more than one item land in a dropSpot/landing space?*/
    DNDItem.singleOccupancy = function(_b){
    this.singleOccupancy = _b;
    };
    /* can more than one item land in a dropSpot/landing space?*/
    DNDItem.isReplaceable = function(_b){
        this.isReplaceable = _b;
    };
    /* bring the mc to the highest level so it always appears on top when we click it*/
    DNDItem.putOnTop = function(_b){
    this.putOnTop = _b;
    };
    /* leave the original item in place and create and drag a copy when we click on it*/
    DNDItem.dragCopy = function(_b){
        this.dragCopy = _b;
    };


 DNDItem.enable=function(b) {
this.mc.enabled = b;
};


DNDItem.reset = function() {
this.resetStartPosition();
this.mc.gotoAndStop('start');
this.mc.removeAllEventListeners("tick");
if(this.check_mc!==null){
    this.check_mc.visible = false;
}
if(this.error_mc!==null){
    this.error_mc.visible = false;
}
if(this.dragCopy){
    this.copy.x = this.START_X;
    this.copy.y = this.START_Y;
    this.copy.check_mc.visible = false;
    this.copy.error_mc.visible = false;
    this.copy.gotoAndStop('start');
    this.copy.removeAllEventListeners("tick");
}
};


/* if there's a check mark, turn it off*/
DNDItem.checkMark = function(check_mc){
    this.check_mc = check_mc;
    this.check_mc.visible = false;
};
/* if there's an error mark, turn it off*/
DNDItem.errorMark = function(error_mc){
    this.error_mc = error_mc;
    this.error_mc.visible = false;
};






DNDItem.onGoodDrop = function(_targetNumHit){
console.log("this must be the place!");

    this.main.goodDrop(_targetNumHit, this);//go back in Main, so we can customize it
};
DNDItem.startDrag = function(e){
console.log("startDrag");
};
DNDItem.disable = function(){
console.log("disable DNDItem");
if (this.mc){
    this.mc.removeAllEventListeners();
}

};
/* call this on both successful drops and misses, if set for single occupancy,
If an item was previously on another slot, remove it's reference from that slot */
DNDItem.removeFromSlots = function(){
var i;
for (i=0; i<this.dropTargets.length; i++){
//look for a match, but make sure it's not the current drop spot, because we don't want to clear that one!
if(this.dropTargets[i].droppedItem ===this.main.currentDNDItem && this.dropTargets[i] !== this.main.currentDropSpot){
this.dropTargets[i].droppedItem = null;
this.dropTargets[i].occupied = false;
this.main.numDroppedItems--;
}
}
};
DNDItem.stopDrag = function(e){
console.log("stopDrag");
};
DNDItem.check=function() {
var i, theDropSpotNum, p0;

for (i = 0; i < this.dropTargets.length; i++){
p0 = this.mc.localToLocal(0,0, this.dropTargets[i]);//did the target land on a drop spot?
console.log(p0.x, p0.y);

if ( this.dropTargets[i].hitTest( p0.x, p0.y) ){//dropped item landed on a drop target
if(this.singleOccupancy){
    if (this.dropTargets[i].occupied ===false){//drop target is vacant, go ahead
        console.log("hit dropspot number " + i);
        theDropSpotNum = i;
        this.main.currentDropSpot = this.dropTargets[i];
        this.main.currentDNDItem = this;
        if (this.popIntoPlace===true){
            this.mc.x = this.dropTargets[i].x;
            this.mc.y = this.dropTargets[i].y;
        }
        this.dropTargets[i].occupied = true;
        this.dropTargets[i].droppedItem=this;
        break;
    }else{
        console.log("sorry, this drop spot is occupied");
        theDropSpotNum =null;
        this.main.currentDropSpot = this.dropTargets[i];
        this.main.currentDNDItem = this;
    }
}else{//can have more than one dragged item in an dropspot/landing spot
    console.log("hit dropspot number " + i);
    if(this.isReplaceable){
        if(this.main.currentDNDItem!==null && this.main.currentDNDItem!==undefined){
            this.main.currentDNDItem.reset();//send the current dnditem back to its original position, and unoccupy the dropspot
        }
    }
    theDropSpotNum = i;
    this.main.currentDropSpot = this.dropTargets[i];
    this.main.currentDNDItem = this;
    if (this.popIntoPlace===true){
        this.mc.x = this.dropTargets[i].x;
        this.mc.y = this.dropTargets[i].y;
    }
    this.dropTargets[i].occupied = true;
    this.dropTargets[i].droppedItem=this;
    break;
}


}else{//missed the drop spot
    console.log("missed the drop spot");
    theDropSpotNum =null;
    this.main.currentDropSpot = null;
    this.main.currentDNDItem = this;
    }
}
return theDropSpotNum;
};

return DNDItem;
    };





