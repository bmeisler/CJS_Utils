var circleModule = function() {
        console.log("creating new circleModule");
        
        var my = {};

        return {
            //should pass in two objects: firstLine and secondLine - each can contain its own radiusMultiple, thickness, color, start and end angle
            //can thus create concentric circles (bullseye, etc), or else circles with the same radius and multiple colors
            drawCircle: function(theGraph, _firstLineObj, _secondLineObj) {
                var thickness = _firstLineObj.thickness;
                var radiusMultiple = _firstLineObj.radiusMultiple;
                var color = _firstLineObj.color;
                var startAngle = _firstLineObj.startAngle;
                var endAngle = _firstLineObj.endAngle;
                my.g.clear();
//                var index = theGraph.mc.getChildIndex(theGraph.curvesContainer);
//                theGraph.mc.addChild(my.circle);
//                theGraph.mc.setChildIndex(my.circle, index);
                
                theGraph.curvesContainer.addChild(my.circle);
                
                if (thickness === null || thickness === undefined) {
                    thickness = 1;
                }
                if (color === null || color === undefined) {
                    color = 0x000000;
                }
                my.g.setStrokeStyle(thickness);
                my.g.beginStroke(createjs.Graphics.getRGB(color));

                if (startAngle === null || startAngle === undefined) {
                    startAngle = -Math.PI;
                }
                if (endAngle === null || endAngle === undefined) {
                    endAngle = Math.PI;
                }

                var radius = radiusMultiple * theGraph.xUnit;

                my.g.arc(0, 0, radius, endAngle, startAngle, false);
                my.g.endStroke();
                //Graphics.Arc ( x  y  radius  startAngle  endAngle  anticlockwise )
                if(_secondLineObj){
                    this.g.setStrokeStyle(_secondLineObj.thickness);
                    this.g.beginStroke(createjs.Graphics.getRGB(_secondLineObj.color));

                    if (_secondLineObj.startAngle === null || _secondLineObj.startAngle === undefined) {
                        startAngle = -Math.PI;
                    }
                    if (_secondLineObj.endAngle === null || _secondLineObj.endAngle === undefined) {
                        endAngle = Math.PI;
                    }
                    if (_secondLineObj.radiusMultiple !== null || _secondLineObj.radiusMultiple !== undefined) {
                        radius = _secondLineObj.radiusMultiple * theGraph.xUnit;
                    }

                    this.g.arc(0, 0, radius, endAngle, startAngle, false);
                    this.g.endStroke();
                    
                }
            },
            init: function(){
                console.log("init");
                my.g = new createjs.Graphics();
                my.circle = new createjs.Shape(my.g);
                return my;
            }
        };

    };



    function Circle() {
        this.g = new createjs.Graphics();
        this.circle = new createjs.Shape(this.g);
    }

    Circle.prototype.drawCircle = function(theGraph, radiusMultiple, thickness, color, startAngle, endAngle, secondLine) {
        this.g.clear();
        var index = theGraph.mc.getChildIndex(theGraph.curvesContainer);
        theGraph.mc.addChild(this.circle);
        theGraph.mc.setChildIndex(this.circle, index);
        if (thickness === null || thickness === undefined) {
            thickness = 1;
        }
        if (color === null || color === undefined) {
            color = 0x000000;
        }
        this.g.setStrokeStyle(thickness);
        this.g.beginStroke(createjs.Graphics.getRGB(color));

        if (startAngle === null || startAngle === undefined) {
            startAngle = -Math.PI;
        }
        if (endAngle === null || endAngle === undefined) {
            endAngle = Math.PI;
        }

        var radius = radiusMultiple * theGraph.xUnit;

        this.g.arc(0, 0, radius, endAngle, startAngle, false);
        this.g.endStroke();
        if(secondLine){
            this.g.setStrokeStyle(secondLine.thickness);
            this.g.beginStroke(createjs.Graphics.getRGB(secondLine.color));

            if (startAngle === null || startAngle === undefined) {
                startAngle = -Math.PI;
            }
            if (endAngle === null || endAngle === undefined) {
                endAngle = Math.PI;
            }

            //var radius = radiusMultiple * theGraph.xUnit;

            this.g.arc(0, 0, radius, endAngle, startAngle, false);
            this.g.endStroke();
            
        }
        
        
        
        //Graphics.Arc ( x  y  radius  startAngle  endAngle  anticlockwise )
    };