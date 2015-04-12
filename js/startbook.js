 function flipBook($) {
        var mouse = new Point(0,0);
        var startPosition =0;
        var menuFollow =0;
        var menuMouseX =0;
        var turningCount =0;
        var turningCountMenu =10; //Turning count menu
        var dirtyCountMenu = 40; // Dirty count menu
        var isSliding = false;
        var isMenuSliding = false;
        var currentPosition =0;
        var nextPosition =0;
        var prevPosition =0;
        var currentMenuPosition =0;
        var menuCorner = 0;
        var mouseOnMenu = false;
        var menuMoveLeft = false;
        var menuMoveRight = false;
        var menuCurrentPage =0;
        var page0RightNumber= 1;
        var page1RightNumber = 3;
        var page2RightNumber = 5;
        var page3RightNumber = 7;
        var page4RightNumber = 9;
        var page5RightNumber =11;
        var page6RightNumber =13;
        var page7RightNumber =15;
        var zoom = false;
        var clickedArea = "nn";
        var testMouse = new Point();
        var isMouseOver = false;
        var isMouseDown = false;
        var isDrag = false;
        var isTurning = false;
        var numberOfPages = 4;
        var currentPage;
        var leftCorner;
        //var isZoomDisbaled = true;
        var isZoomDisabled = true;
        var  pageWidth;
        var  pageHeight;
        var WIDTH;
        var HEIGHT;
        var pageLeft;
        var pageTop;
        var pageHalfHeight;
        var outerRadius;
        var spineTop;
        var spineCenter;
        var spineBottom;
        var rightEdgeBottom;
        var leftEdgeBottom;
        var rightCorner;
        var rightFollow;
        var leftFollow;
        var innerRadius;
        var oWidth;
        var oHeight;
        var canvasWidth;
        var canvasHeight;

        //Original container width and height
        var containerWidth;
        var containerHeight;
        //Xscale
        var xscale;
        var yscale;

        //Mouse x
        var mouseX =0;
        var mouseY =0;


        var xfollow =0;
        var yfollow =0;
        var xCoord;
        var yCoord;

        var distanceToCorner =0;

        var distanceFromTop,
            rightBisectorAngle,
            rightBisectorTangent,
            dx,
            dy,
            angle2follow,
            zoomFollow = new Point(0,0),
            zoomMouse = new Point(0,0),
            radius1 = new Point(0,0),
            radius2 = new Point(0,0),
            rightBisector = new Point(0,0),
            leftBisector = new Point(0,0),
            leftBisectorAngle = new Point(0,0),
            rightBisectorBottom = new Point(0,0),
            leftBisectorBottom = new Point(0,0),
            leftBisectorTangent = new Point(0,0),
            rightTangentBottom = new Point(0,0),
            leftTangentBottom = new Point(0,0),
            dirtyCount = 15,
            yCord,
            TIME_INTERVAL = 15,
            pageAngle,
            clipAngle,
            clipAngle2,
            rbDistance2,
            pageAngle2,
            rbDistance,
            pageNumber = 0,
            nextPage =2;
        var right;
        var leftWidth;
        var zoomValue = 0.5;
        var zoomedIn = false;




        function getMouseX(){
            return mouseX;
        }
        function getMouseY(){
            return mouseY;
        }

        function getOWidth(){
            return oWidth;
        }

        function getOHeight(){
            return oHeight;
        }


        function setXScale(_xscale){
            xscale = _xscale;

        }

        function setYScale(_yscale){
            yscale = _yscale;
        }

        function getContainerWidth(){
            return containerWidth;
        }
        //Hide lp
       

        function deg(rads){
            return rads/Math.PI*180;
        }

    

        function setWidthSize(_width,_height){
            var  pageWidth2 = _width;
            var  pageHeight2 = _height;

            //RIGHT SIDE
            $("#lp-right").width(pageWidth2).height(pageHeight2);
            $("#lp-left").width(pageWidth2).height(pageHeight2);
            $("#lp-inner-right").width(pageWidth2).height(pageHeight2);
            //The next page
            $("#lp-inner-2-left").css({"left": "-100%"});
            $("#lp-inner-2-right").css({"left": "100%"});
            $("#lp-clip").width(pageWidth2).height(pageHeight2);
            $("#lp-clip-shadow").width(pageWidth2).height(pageHeight2);
            $("#lp-clip2").width(pageWidth2).height(pageHeight2);
            $("#lp-left-page").width(pageWidth2).height(pageHeight2);
            $("#lp-right-page").width(pageWidth2).height(pageHeight2);
            $("#lp-inner-2-left").width(pageWidth2).height(pageHeight2*2);
            $("#lp-inner-left").width(pageWidth2).height(pageHeight2*2);
            $("#lp-clip-shadow").width(pageWidth2).height(pageHeight2);
            $("#lp-clip2").width(pageWidth2).height(pageHeight2);
            $("#lp-right-clip").width(pageWidth2).height(pageHeight2);
            $("#lp-right-inner-clip").width(pageWidth2).height(pageHeight2);
            $("#lp-inner-2-right").width(pageWidth2).height(pageHeight2);
            $("#lp-right-page").css({right: "50%"});
            $("#lp-inner-2-right").css({"left": "100%"});
            $('#lp-right-inner-clip').css({'transform-origin': '0% 0%'});
            $("#lp-inner-clip").width(pageWidth2).height(pageHeight2);
            $("#lp-right-clip2").width(pageWidth2).height(pageHeight2);
            $("#lp-inner-clip").css({transform: 'translate3d(100%,0%, 0) '});
            $("#lp-right-clip2").css({transform: ' translate3d(' + -pageWidth2+ 'px, ' + 0 + 'px, 0) '});

    
            pageHeight = _height;
            pageTop = 0;
            pageHalfHeight = pageHeight*0.5;
            innerRadius = pageWidth;
            outerRadius = Math.sqrt(pageWidth*pageWidth + pageHeight*pageHeight);

            spineTop = new Point(pageLeft + pageWidth, pageTop);
            spineCenter = new Point(pageLeft + pageWidth, pageTop + pageHalfHeight);
            spineBottom = new Point(pageLeft + pageWidth, pageTop + pageHeight);

            rightEdgeBottom =  new Point(pageLeft + pageWidth*2, pageTop + pageHeight);//
            leftEdgeBottom =  new Point(pageLeft, pageTop + pageHeight);//

            //CORNERS
            leftCorner = new Point(leftEdgeBottom.x-1 , leftEdgeBottom.y-1);
            rightCorner = new Point(rightEdgeBottom.x-1 , rightEdgeBottom.y-1); //

            //Right follow and Leftfollow
            rightFollow = new Point(rightEdgeBottom.x-1,rightEdgeBottom.y-1);//
            leftFollow =new Point(leftEdgeBottom.x-1,leftEdgeBottom.y-1);//
            
        }


        function main(_width, _height, totalPages){

            var height = _height;
            var width = _width;
            currentPage =0;
            var numberOfPages = totalPages;
            var pageNumber = $("#showPage");
            var pageNumberText = (currentPage) + "/" + numberOfPages;
            pageNumber.html(pageNumberText);
            var divTarget = document.getElementById("lp-book");
            TIME_INTERVAL =15;
            setSizes(width,height);
            drawFrameWork();
            LivelypaperEvent(divTarget, onMouseDown, onMouseMove, onMouseUp);
        

            setInterval(draw, TIME_INTERVAL);

            //Set the sizes of the rendering viewport
            function setSizes( _width, _height) {

                setWidthSize(_width,_height);


                WIDTH = $("#lp-book").width();
                HEIGHT = $("#lp-book").height();
                oWidth = $("#lp-book").width();
                oHeight = $("#lp-book").height();


                pageLeft = ((WIDTH/2) - _width) ;
                pageWidth = _width;



                pageHeight = _height;
                pageTop = 0;
                pageHalfHeight = pageHeight*0.5;
                innerRadius = pageWidth;
                outerRadius = Math.sqrt(pageWidth*pageWidth + pageHeight*pageHeight);

                spineTop = new Point(pageLeft + pageWidth, pageTop);
                spineCenter = new Point(pageLeft + pageWidth, pageTop + pageHalfHeight);
                spineBottom = new Point(pageLeft + pageWidth, pageTop + pageHeight);

                rightEdgeBottom =  new Point(pageLeft + pageWidth*2, pageTop + pageHeight);//
                leftEdgeBottom =  new Point(pageLeft, pageTop + pageHeight);//

                //CORNERS
                leftCorner = new Point(leftEdgeBottom.x-1 , leftEdgeBottom.y-1);
                rightCorner = new Point(rightEdgeBottom.x-1 , rightEdgeBottom.y-1); //

                radius1 = new Point(0,0); ///
                //Right mouse and follow
                mouse = new Point(leftEdgeBottom.x -1 ,leftEdgeBottom.y -1);
                mouse = new Point(rightEdgeBottom.x-1,rightEdgeBottom.y-1);


                //Right follow and Leftfollow
                rightFollow = new Point(rightEdgeBottom.x-1,rightEdgeBottom.y-1);//
                leftFollow =new Point(leftEdgeBottom.x-1,leftEdgeBottom.y-1);//

                //Left page and Right page width and height
                $("#lp-left-page").css({left: "50%"});
                $("#lp-right").css({'left': -width });
                right = document.getElementById("lp-right");

            }



            function draw(){
                if(zoom){
                    renderZoomMath();
                    drawZoomSheets();
                }
                if ( dirtyCount > 0 ) {
                    if(isTurning){
                        turnPage();
                    }
                    renderMath();
                    drawFlipSheets();
                    dirtyCount--;
                }
                if(dirtyCountMenu > 0){
                    //If menu is sliding draw the slide
                    if(isMenuSliding){
                        slideMenu();
                    }
                    renderMenuMath();
                    drawMenuSheets();
                    dirtyCountMenu--;
                }   
            }

            function drawFrameWork(){
                var current1 = "pageContainer"+ (currentPage);
                var current2 = "pageContainer" + (currentPage+1);
                var testDiv1 = document.getElementById(current1);
                var testDiv2 = document.getElementById(current2);
                var leftPage = document.getElementById("lp-left-page");
                var rightPage = document.getElementById("lp-right-page");

                if(currentPage<1){
                    while(rightPage.firstChild){
                        var child = rightPage.firstChild;
                        if(child.id === 'right-shadow'){
                            rightPage.removeChild(child);
                        }else{
                            $(child).appendTo("#lpcontainer");

                        }
                    }
                    rightPage.innerHTML = '<div id="instructions"><p> <i class="fa fa-search-plus fa-1x"></i>  click anywhere on the page to zoom in or out</p> <hr> <p> use arrows or drag page corners</p></div>';

                    $("#lp-right-page").css({background: "rgba(0,0,0,0)"});
                    $("#lp-left-page").css({background: "rgba(0,0,0,0)"});

                }else{
                    if(rightPage!==null){
                        var rightShadow = document.createElement('right-shadow');
                        rightShadow.id = 'right-shadow';

                        //Move the child back to

                        //Clear the div
                        while(rightPage.firstChild){
                            var child = rightPage.firstChild;
                            if(child.id === 'right-shadow'){
                                rightPage.removeChild(child);
                            }else{
                                $(child).appendTo("#lpcontainer");

                            }
                        }
                        if(testDiv1 !== null){
                            rightPage.appendChild(rightShadow);
                            rightPage.appendChild(testDiv1);
                            $("#lp-right-page").css({background: "white"});
                        }
                    }
                }

                if(currentPage >= totalPages){
                    $("#lp-left-page").css("background-color","rgba(0,0,0,0)");
                }else{
                    $("#lp-left-page").css("background-color","white");
                }

                if(leftPage!==null){
                    var leftShadow = document.createElement("div");
                    leftShadow.id = "left-shadow";
                    while(leftPage.firstChild){
                        var child = leftPage.firstChild;
                        if(child.id === 'right-shadow'){
                            leftPage.removeChild(child);
                        }else{
                            $(child).appendTo("#lpcontainer");

                        }
                    }
                    if(testDiv2 !== null){
                        leftPage.appendChild(leftShadow);
                        leftPage.appendChild(testDiv2);
                    }
                }
            }

            function slideMenu(){

                var page0LeftNumber;
                var page1LeftNumber;
                var page2LeftNumber;
                var page3LeftNumber;
                var page4LeftNumber;
                var page5LeftNumber;
                var page6LeftNumber;
                var page7LeftNumber;
                var prevLeftNumber;
                var prevRightNumber;
                var nextLeftNumber;
                var nextRightNumber;
                var page0Left = document.getElementById("page0-left");
                var page0Right = document.getElementById("page0-right");
                var page1Left = document.getElementById("page1-left");
                var page1Right = document.getElementById("page1-right");
                var page2Left = document.getElementById("page2-left");
                var page2Right = document.getElementById("page2-right");
                var page3Left = document.getElementById("page3-left");
                var page3Right = document.getElementById("page3-right");
                var page4Left = document.getElementById("page4-left");
                var page4Right = document.getElementById("page4-right");
                var page5Left = document.getElementById("page5-left");
                var page5Right = document.getElementById("page5-right");
                //Next page
                var page6Left = document.getElementById("page6-left");
                var page6Right = document.getElementById("page6-right");

                //previous page
                //Next page
                var page7Left = document.getElementById("page7-left");
                var page7Right = document.getElementById("page7-right");

                //Next thumbnail images
                var nextLeft = document.getElementById("next-left");
                var nextRight = document.getElementById("next-right");

                var prevLeft = document.getElementById("prev-left");
                var prevRight = document.getElementById("prev-right");


                if(turningCountMenu>0){
                    turningCountMenu--;
                    isMenuSliding = true;
                }else{
                    isMenuSliding = false;
                    //check whether the right part of the navigation menu was clicked or if it was the left part
                    if(menuMoveLeft){
                        menuCurrentPage -=2;
                    }else{
                        menuCurrentPage+=2;
                    }
                    //Page numbers variables
                    page0LeftNumber = menuCurrentPage-1;
                    page0RightNumber = menuCurrentPage;


                    page1LeftNumber = menuCurrentPage+1;
                    page1RightNumber = menuCurrentPage+2;

                    page2LeftNumber = menuCurrentPage+3;
                    page2RightNumber = menuCurrentPage+4;

                    page3LeftNumber = menuCurrentPage+5;
                    page3RightNumber = menuCurrentPage+6;

                    page4LeftNumber = menuCurrentPage+7;
                    page4RightNumber = menuCurrentPage+8;

                    page5LeftNumber = menuCurrentPage+9;
                    page5RightNumber = menuCurrentPage+10;

                    page6LeftNumber = menuCurrentPage+11;
                    page6RightNumber = menuCurrentPage+12;

                    page7LeftNumber = menuCurrentPage+13;
                    page7RightNumber = menuCurrentPage+14;


                    prevLeftNumber = menuCurrentPage-3;
                    prevRightNumber = menuCurrentPage-2;

                    nextLeftNumber = menuCurrentPage-3;
                    nextRightNumber = menuCurrentPage-2;


                    //Page 0
                    if(prevLeftNumber <0){
                        prevLeft.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        prevLeft.innerHTML = '<image src="thumbs/thumb-'+(prevLeftNumber+1)+'.png" width="100%" height="100%">';
                    }
                    if(page0LeftNumber<0){
                        page0Left.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        page0Left.innerHTML = '<image src="thumbs/thumb-'+(page0LeftNumber+1)+'.png" width="100%" height="100%">';
                    }

                    //Check whether the page numbers are greater than the Total number of pages
                    if(page7RightNumber>(numberOfPages)){
                        page7Right.innerHTML = '<image src="thumbs/thumb-'+(page7RightNumber+1)+'.png" width="100%" height="100%">';
                    }else{
                        page7Right.innerHTML = '<image src="thumbs/thumb-'+(page7RightNumber+1)+'.png" width="100%" height="100%">';
                    }

                    //Check whether the page numbers are greater than the Total number of pages
                    if(page6RightNumber>=(numberOfPages+1)){
                        page6Right.innerHTML = '<image src="thumbs/thumb-'+(page6RightNumber+1)+'.png" width="100%" height="100%">';
                    }else{
                        page6Right.innerHTML = '<image src="thumbs/thumb-'+(page6RightNumber+1)+'.png" width="100%" height="100%">';
                    }
                    if(page5RightNumber>(numberOfPages+1)){
                        page5Right.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        page5Right.innerHTML = '<image src="thumbs/thumb-'+(page5RightNumber+1)+'.png" width="100%" height="100%">';
                    }
                    if(page4RightNumber>(numberOfPages+1)){
                        page4Right.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        page4Right.innerHTML = '<image src="thumbs/thumb-'+(page4RightNumber+1)+'.png" width="100%" height="100%">';
                    }
                    if(page3RightNumber>(numberOfPages+1)){
                        page3Right.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        page3Right.innerHTML = '<image src="thumbs/thumb-'+(page3RightNumber+1)+'.png" width="100%" height="100%">';
                    }
                    if(page2RightNumber>(numberOfPages+1)){
                        page2Right.innerHTML = '<div class="nopicture"></div>';
                    }else{
                        page2Right.innerHTML = '<image src="thumbs/thumb-'+(page2RightNumber+1)+'.png" width="100%" height="100%">';
                    }

                    page0Right.innerHTML = '<image src="thumbs/thumb-'+(page0RightNumber+1)+'.png" width="100%" height="100%">';
                    //Page 1
                    page1Left.innerHTML = '<image src="thumbs/thumb-'+(page1LeftNumber+1)+'.png" width="100%" height="100%">';
                    page1Right.innerHTML = '<image src="thumbs/thumb-'+(page1RightNumber+1)+'.png" width="100%" height="100%">';

                    //Page 2
                    page2Left.innerHTML = '<image src="thumbs/thumb-'+(page2LeftNumber+1)+'.png" width="100%" height="100%">';

                    //Page 3
                    page3Left.innerHTML = '<image src="thumbs/thumb-'+(page3LeftNumber+1)+'.png" width="100%" height="100%">';

                    //Page 4
                    page4Left.innerHTML = '<image src="thumbs/thumb-'+(page4LeftNumber+1)+'.png" width="100%" height="100%">';
                    //Page 5
                    page5Left.innerHTML = '<image src="thumbs/thumb-'+(page5LeftNumber+1)+'.png" width="100%" height="100%">';

                    if((page6LeftNumber) >= numberOfPages){
                        page6Left.innerHTML = '<image src="thumbs/thumb-'+(page6LeftNumber+1)+'.png" width="100%" height="100%">';
                    }else{
                        page6Left.innerHTML = '<image src="thumbs/thumb-'+(page6LeftNumber+1)+'.png" width="100%" height="100%">';
                    }
                    // Page 7
                    if(page7LeftNumber > numberOfPages){
                        page7Left.innerHTML = '<div class="nopicture"></div>';

                    }else{
                        page7Left.innerHTML = '<image src="thumbs/thumb-'+(page7LeftNumber+1)+'.png" width="100%" height="100%">';
                    }
                    prevRight.innerHTML = '<image src="thumbs/thumb-'+(prevRightNumber+1)+'.png" width="100%" height="100%">';

                    $("#page-number-0").html((page0LeftNumber+1) +" - "+ (page0RightNumber+1));
                    $("#page-number-1").html((page1LeftNumber+1) +" - "+ (page1RightNumber+1));
                    $("#page-number-2").html((page2LeftNumber+1) +" - "+ (page2RightNumber+1));
                    $("#page-number-3").html((page3LeftNumber+1) +" - "+ (page3RightNumber+1));
                    $("#page-number-4").html((page4LeftNumber+1) +" - "+ (page4RightNumber+1));
                    $("#page-number-5").html((page5LeftNumber+1) +" - "+ (page5RightNumber+1));
                    $("#page-number-6").html((page6LeftNumber+1) +" - "+ (page6RightNumber+1));
                    $("#page-number-7").html((page7LeftNumber+1) +" - "+ (page7RightNumber+1));
                    $("#page-left-0").html((prevLeftNumber+1) +" - "+ (prevRightNumber+1));

                }
            }
            //Render menu math
            function renderMenuMath(){
                menuFollow += (menuMouseX - menuFollow)*0.13;
                menuCorner = menuFollow;
                if(isMenuSliding){
                    if(turningCountMenu<=0){
                        menuFollow =0;
                        menuMouseX =0;
                    }
                }
            }

            function renderZoomMath(){
                zoomFollow.x += (zoomMouse.x - zoomFollow.x);
                zoomFollow.y += (zoomMouse.y - zoomFollow.y);
            }

            function renderMath() {


                if(clickedArea==="rb"){
                    // STEP 1: CONSTRAINT THE CORNER TO THE INNER RADIUS (BOTTOM) OF THE BOOK SPINE
                    // EASE THE FOLLOW [F] TOWARD THE MOUSE [M]
                    rightFollow.x += (mouse.x - rightFollow.x)*0.5;
                    rightFollow.y += (mouse.y - rightFollow.y)*0.5;


                    // CHECK DISTANCE FROM SPINE BOTTOM [SB] TO FOLLOW [F]
                    dx = (spineBottom.x) - rightFollow.x;
                    dy = (spineBottom.y) - rightFollow.y;

                    // DETERMINE THE ANGLE FROM SPINE BOTTOM [SB] TO FOLLOW [F]
                    // AND PLOT THE INNER RADIUS CONSTRAINT [R1]
                    angle2follow = Math.atan2(dy, dx);
                    radius1.x = spineBottom.x - Math.cos(angle2follow) * innerRadius;
                    radius1.y = spineBottom.y - Math.sin(angle2follow)*innerRadius;

                    // IF THE FOLLOW [F] IS OUTSIDE THE INNER RADIUS CONSTRAINT [R1],
                    // CONSTRAIN THE PAGE CORNER [C] TO THE INNER RADIUS [R1],
                    // OTHERWISE, MATH THE CORNER [C] WITH OUR EASED MOUSE FOLLOW [F]
                    distanceFromTop = Math.sqrt( (dy*dy) + ( dx*dx));

                    if (distanceFromTop > innerRadius){
                        rightCorner.x = radius1.x;
                        rightCorner.y = radius1.y;
                    } else {
                        rightCorner.x = rightFollow.x;
                        rightCorner.y = rightFollow.y;
                    }

                    // STEP 2A: CONSTRAINT THE CORNER TO THE OUTER RADIUS (TOP) OF THE BOOK SPINE

                    // WHAT DIRECTION FROM THE SPINE TOP IS THE CORNER
                    dx = spineTop.x - rightCorner.x;
                    dy = spineTop.y - rightCorner.y;
                    angle2follow = Math.atan2(dy, dx);

                    // USING THE ABOVE, VISUALIZE THE OUTER RADIUS CONSTRAINT
                    radius2.x = spineTop.x - Math.cos(angle2follow)*outerRadius;
                    radius2.y = spineTop.y - Math.sin(angle2follow)*outerRadius;

                    // CONSTRAINT THE CORNER [C] TO THE OUTER RADIUS [R2] IF IT FALLS OUTSIDE IT
                    distanceToCorner = Math.sqrt(dx*dx + dy*dy);
                    if ( distanceToCorner > outerRadius ) {
                        rightCorner.x = radius2.x;
                        rightCorner.y = radius2.y;
                    }

                    // STEP 2B: CALCULATE THE CRITICAL TRIANGLE [T0, T1, T2] FORMED BY FLIPPING A PAGE BETWEEN THE
                    // CORNER OF THE PAGE AND THE PAGE BOTTOM TO DETERMINE ROTATION OF THE PAGE BEING FLIPPED

                    // [T0] IS THE BISECTOR BETWEEN THE CORNER [C] AND THE EDGE BOTTOM [EB]. THIS DETERMINES HOW MUCH
                    // OF THE "BACK" OF THE PAGE WILL BE SHOWN.
                    rightBisector.x = rightCorner.x + 0.5*(rightEdgeBottom.x - rightCorner.x);
                    rightBisector.y = rightCorner.y + 0.5*(rightEdgeBottom.y - rightCorner.y);


                    // [T1] IS THE TANGENT OF THE BISECTOR SHOOTING OFF AT 90 DEGREES TO THE BOTTOM OF THE PAGE
                    rightBisectorAngle = Math.atan2(rightEdgeBottom.y - rightBisector.y, rightEdgeBottom.x - rightBisector.x);
                    rightBisectorTangent = rightBisector.x - Math.tan(rightBisectorAngle) * (rightEdgeBottom.y - rightBisector.y);

                    // THIS CHECK WILL CONSTRAINT THE BISECTOR TANGENT [T1] TO THE SPINE BOTTOM [SB] ONCE RENDERED
                    if ( rightBisectorTangent < 0 ) {
                        rightBisectorTangent = 0;
                    }
                    rightTangentBottom.x = rightBisectorTangent;
                    rightTangentBottom.y = rightEdgeBottom.y;

                    // [T2] IS THE SIMPLE RIGHT CORNER OF THE TWO POINTS
                    rightBisectorBottom.x = rightBisector.x;
                    rightBisectorBottom.y = rightTangentBottom.y;

                }else if(clickedArea==="lb"){
                    // STEP 1: CONSTRAINT THE CORNER TO THE INNER RADIUS (BOTTOM) OF THE BOOK SPINE
                    // EASE THE FOLLOW [F] TOWARD THE MOUSE [M]
                    leftFollow.x += (mouse.x - leftFollow.x)*0.5;
                    leftFollow.y += (mouse.y - leftFollow.y)*0.5;


                    // CHECK DISTANCE FROM SPINE BOTTOM [SB] TO FOLLOW [F]
                    dx = spineBottom.x - leftFollow.x;
                    dy = spineBottom.y - leftFollow.y;


                    // DETERMINE THE ANGLE FROM SPINE BOTTOM [SB] TO FOLLOW [F]
                    // AND PLOT THE INNER RADIUS CONSTRAINT [R1]
                    angle2follow = Math.atan2(dy, dx);
                    radius1.x = spineBottom.x - Math.cos(angle2follow) * innerRadius;
                    radius1.y = spineBottom.y - Math.sin(angle2follow)*innerRadius;

                    // IF THE FOLLOW [F] IS OUTSIDE THE INNER RADIUS CONSTRAINT [R1],
                    // CONSTRAIN THE PAGE CORNER [C] TO THE INNER RADIUS [R1],
                    // OTHERWISE, MATH THE CORNER [C] WITH OUR EASED MOUSE FOLLOW [F]
                    distanceFromTop = Math.sqrt( (dy*dy) + ( dx*dx));
                    if (distanceFromTop > innerRadius){
                        leftCorner.x = radius1.x;
                        leftCorner.y = radius1.y;
                    } else {
                        leftCorner.x= leftFollow.x;
                        leftCorner.y = leftFollow.y;
                    }

                    // STEP 2A: CONSTRAINT THE CORNER TO THE OUTER RADIUS (TOP) OF THE BOOK SPINE

                    // WHAT DIRECTION FROM THE SPINE TOP IS THE CORNER
                    dx = spineTop.x - leftCorner.x;
                    dy = spineTop.y - leftCorner.y;
                    angle2follow = Math.atan2(dy, dx);

                    // USING THE ABOVE, VISUALIZE THE OUTER RADIUS CONSTRAINT
                    radius2.x = spineTop.x - Math.cos(angle2follow)*outerRadius;
                    radius2.y = spineTop.y - Math.sin(angle2follow)*outerRadius;

                    // CONSTRAINT THE CORNER [C] TO THE OUTER RADIUS [R2] IF IT FALLS OUTSIDE IT
                    distanceToCorner = Math.sqrt(dx*dx + dy*dy);
                    if ( distanceToCorner > outerRadius ){
                        leftCorner.x = radius2.x;
                        leftCorner.y = radius2.y;
                    }

                    // STEP 2B: CALCULATE THE CRITICAL TRIANGLE [T0, T1, T2] FORMED BY FLIPPING A PAGE BETWEEN THE
                    // CORNER OF THE PAGE AND THE PAGE BOTTOM TO DETERMINE ROTATION OF THE PAGE BEING FLIPPED

                    // [T0] IS THE BISECTOR BETWEEN THE CORNER [C] AND THE EDGE BOTTOM [EB]. THIS DETERMINES HOW MUCH
                    // OF THE "BACK" OF THE PAGE WILL BE SHOWN.

                    leftBisector.x = (leftEdgeBottom.x- leftCorner.x)*0.5 + leftCorner.x;
                    leftBisector.y = (leftEdgeBottom.y- leftCorner.y)*0.5 + leftCorner.y;

                    // [T1] IS THE TANGENT OF THE BISECTOR SHOOTING OFF AT 90 DEGREES TO THE BOTTOM OF THE PAGE
                    leftBisectorAngle = Math.atan2(leftEdgeBottom.y - leftBisector.y, leftEdgeBottom.x - leftBisector.x);
                    leftBisectorTangent = leftBisector.x - Math.tan(leftBisectorAngle) * (leftEdgeBottom.y - leftBisector.y);

                    // THIS CHECK WILL CONSTRAINT THE BISECTOR TANGENT [T1] TO THE SPINE BOTTOM [SB] ONCE RENDERED
                    if ( leftBisectorTangent < 0 ) { 
                        leftBisectorTangent = 0;
                    }

                    leftTangentBottom.x = leftBisectorTangent;
                    leftTangentBottom.y = leftEdgeBottom.y;

                    // [T2] IS THE SIMPLE RIGHT CORNER OF THE TWO POINTS
                    leftBisectorBottom.x = leftBisector.x;
                    leftBisectorBottom.y = leftTangentBottom.y;
                }
            }

            function drawMenuSheets(){
                var current = document.getElementById('current-nav');
                currentMenuPosition = menuCorner;
                $("#current-nav").css({transform: 'translate3d(' +  (currentMenuPosition+2) + '%, ' + 0 + 'px, 0)'});
            }


            function drawZoomSheets(){
                $("#lp-book").css({transform: 'translate3d(' + -(Math.floor(zoomFollow.x))+ 'px, ' + -(Math.floor(zoomFollow.y))+ 'px, 0)'});
            }

            function drawFlipSheets() {

                $("#lp-right").css({'transform-origin': '100% 100%'});
                $('#lp-right-inner-clip').css({'transform-origin': '0% 0%'});
                $("#lp-left").css({'transform-origin': '0% 100%'});
                $("#lp-clip").css({'transform-origin': '0% 100%'});
                $("#lp-clip2").css({'transform-origin': '0% 100%'});


                if(clickedArea === "rb"){

                    var leftWidth = $("#lp-left").width();
                    var stayground =  (rightTangentBottom.x - leftWidth);
                    var stayground2 = rightEdgeBottom.x-pageWidth*2;

                    pageAngle = Math.atan2(rightTangentBottom.y - rightCorner.y, rightTangentBottom.x - rightCorner.x);
                    clipAngle = Math.atan2(rightTangentBottom.y - rightBisector.y, rightTangentBottom.x - rightBisector.x);
                    if ( clipAngle < 0 ) {
                        clipAngle += Math.PI;
                    }
                    clipAngle -= Math.PI/2;
                    rbDistance =  (leftWidth -rightTangentBottom.x);

                    var iH = $("#lp-inner-2-right").height();
                    var p = 500/(100*iH);

                    $("#lp-inner-2-right").css({'padding-bottom' :'100%'});
                    $("#lp-inner-right").css({'padding-bottom' :'100%'});
                    $("#lp-right").css({'transform-origin': '100% 100%'});
                    $("#lp-right").css({transform: 'translate3d(' + (stayground+pageWidth)+ 'px, ' + 0 + 'px, 0) rotate('+deg(clipAngle)+'deg)'});
                    $("#lp-right-clip").css({'transform-origin': '100% 100%'});
                    $("#lp-right-clip").css({transform: 'rotate('+deg(-(clipAngle))+'deg) translate3d(' + rbDistance+ 'px, ' + 0 + 'px, 0)  translate3d(' + rightCorner.x + 'px, ' + rightCorner.y + 'px, 0)'});
                    $("#lp-right-clip2").css({'transform-origin': '100% 100%'});
                    $("#lp-right-clip2").css({transform: ' translate3d(' + (-pageWidth)+ 'px, ' + 0 + 'px, 0) rotate('+deg(-(clipAngle))+'deg) translate3d(' + (rbDistance+pageLeft+pageWidth)+ 'px, ' + 0 + 'px, 0) rotate(0.01deg)'});
                    $("#lp-right-inner-clip").css({transform: 'rotate('+deg(pageAngle)+'deg) translate3d(' +0+ 'px, ' + -pageHeight + 'px, 0) '});

                    if((currentPage) <= (numberOfPages-1)){

                        var current1 = "pageContainer"+(nextPage);
                        var current2 = "pageContainer"+(currentPage+3);


                        var testDiv1 = document.getElementById(current1);
                        var testDiv2 = document.getElementById(current2);


                        if(currentPage>= (numberOfPages-3)){

                            $("#lp-right-clip2").css({"background": "#404040"});

                        }else{
                            var lpRightClip2 = document.getElementById("lp-right-clip2");
                            while(lpRightClip2.firstChild){
                                var child = lpRightClip2.firstChild;
                                if(child.id === 'right-shadow'){
                                    lpRightClip2.removeChild(child);
                                }else{
                                    $(child).appendTo("#lpcontainer");

                                }
                            }
                            $("#lp-right-clip2").append(testDiv2);

                        }

                        //Clear

                        var lpRightInnerClip = document.getElementById("lp-right-inner-clip");

                        while(lpRightInnerClip.firstChild){
                            var child = lpRightInnerClip.firstChild;
                            if(child.id === 'right-shadow'){
                                lpRightInnerClip.removeChild(child);
                            }else{
                                $(child).appendTo("#lpcontainer");

                            }
                        }

                        $('#lp-right-inner-clip').append(testDiv1);
                    }
                }else if(clickedArea === "lb"){
                    var leftWidth = $("#lp-left").width();

                    pageAngle = Math.atan2(leftTangentBottom.y - leftCorner.y,  leftTangentBottom.x - leftCorner.x);
                    clipAngle = Math.atan2(leftTangentBottom.y - leftBisector.y, leftTangentBottom.x - leftBisector.x);
                    if ( clipAngle <= 0 ) {
                        clipAngle -= Math.PI;
                    }
                    clipAngle -= Math.PI/2;
                    rbDistance2 =  (leftTangentBottom.x - leftWidth) +pageWidth+pageLeft  ;
                    rbDistance =  (leftTangentBottom.x - leftWidth) + pageWidth;

                    $("#lp-left").css({transform: 'translate3d(' + rbDistance+ 'px, ' + 0 + 'px, 0) rotate('+deg(clipAngle)+'deg)'});

                    $("#lp-clip").css({'transform-origin': '0% 100%'});
                    $("#lp-clip").css({transform: 'rotate('+deg(-(clipAngle))+'deg) translate3d(' + -rbDistance+ 'px, ' + 0 + 'px, 0)  translate3d(' + leftCorner.x + 'px, ' + leftCorner.y+ 'px, 0) '});
                    $("#lp-clip-shadow").css({transform: 'translate3d(' + -leftCorner.x + 'px, ' + -leftCorner.y+ 'px, 0) '});
                    $("#lp-clip2").css({transform: 'translate3d(' + 100+ '%, ' + 0 + 'px, 0px) rotate('+deg(-(clipAngle))+'deg) translate3d(' + -(rbDistance-pageLeft)+ 'px,' + 0 + 'px, 0px) rotate(0.01deg)'});
                    $("#lp-inner-clip").css({transform: 'rotate('+deg(-Math.PI+pageAngle)+'deg) translate3d(' +-pageWidth+ 'px, ' + -pageHeight + 'px, 0) '});
                    $('#lp-inner-clip').css({'transform-origin': '0% 0%'});


                    //Print the right angle
                    pageAngle2 = Math.atan2(rightTangentBottom.y - rightCorner.y, rightTangentBottom.x - rightCorner.x);
                    clipAngle2 = Math.atan2(rightTangentBottom.y - rightBisector.y, rightTangentBottom.x - rightBisector.x);


                    if(currentPage>=0 && nextPage>=2){

                        var current1 = "pageContainer"+(nextPage-4);
                        var current2 = "pageContainer"+(currentPage-1);
                        var testDiv1 = document.getElementById(current1);
                        var testDiv2 = document.getElementById(current2);


                        //Draw the sheets
                        if(testDiv1!==null){
                            var innerClip = document.getElementById("lp-inner-clip");
                            var lpRightInnerClip = document.getElementById("lp-inner-clip");

                            while(lpRightInnerClip.firstChild){
                                var child = lpRightInnerClip.firstChild;
                                if(child.id === 'right-shadow'){
                                    lpRightInnerClip.removeChild(child);
                                }else{
                                    $(child).appendTo("#lpcontainer");

                                }
                            }
                            $('#lp-inner-clip').append(testDiv2);
                        }
                        if((currentPage-3)>=1){
                            var lpClip = document.getElementById("lp-clip2");
                            while(lpClip.firstChild){
                                var child = lpClip.firstChild;
                                if(child.id === 'right-shadow'){
                                }else{
                                    $(child).appendTo("#lpcontainer");
                                }
                            }
                            $("#lp-clip2").append(testDiv1);
                        }else{
                            var lpClip = document.getElementById("lp-clip2");
                            while(lpClip.firstChild){
                                var child = lpClip.firstChild;
                                if(child.id === 'right-shadow'){
                                    lpClip.removeChild(child);
                                }else{
                                    $(child).appendTo("#lpcontainer");

                                }
                            }
                            $("#lp-clip2").css({"background": "#404040"});
                            $("#lp-clip2").css({"background-image": "url(texture.png)"});
                            $("#lp-clip2").html('<div id="instructions"><p> <i class="fa fa-search-plus fa-1x"></i>  click anywhere on the page to zoom in or out</p> <hr> <p> use arrows or drag page corners</p></div>');
                            $('#lp-inner-clip').append(testDiv2);
                        }
                    }

                }else {
                    return;
                }
            }

            function onMouseDown(wrapper, id, x, y) {


                var mx = x;
                var my = y;

                mouse.x = mx;
                mouse.y = my;

                var halfPageHeight = pageHeight*0.8;

                if(mouseOnMenu) {
                    return;
                }

                dirtyCount = 15;
                testMouse.x = x;
                testMouse.y = y;
                isDrag = true;
                isMouseOver = true;

                if(mx>=pageWidth*1.8 && my>= halfPageHeight){
                    if(currentPage > (numberOfPages-1)){
                        clickedArea = "nn";
                    }else{
                        clickedArea = "rb";
                        return;
                    }
                }else if(mx <= pageWidth*0.5 && my >= halfPageHeight){
                    if(currentPage >= 1){
                        clickedArea = "lb";
                        return;
                    }else{
                        clickedArea = "nn";
                    }
                } else if(mx < pageWidth && my <= halfPageHeight){
                    clickedArea = "nn";
                }else if(mx <= canvasWidth*0.05 && my >= canvasHeight*0.5 && currentPage >= 0){
                    clickedArea = "lb";
                }else{
                    clickedArea = "nn";


                }
            }

            function onMouseMove(wrapper, id, x, y) {
                if(mouseOnMenu) {
                    return;
                }
                if(clickedArea==="nn" || mouseOnMenu) {
                    return;
                }
                dirtyCount = 15;
                testMouse.x = x;
                testMouse.y = y;
                yCord = y-pageHalfHeight;
                if ( isDrag ) {
                    mouse.x = testMouse.x;
                    mouse.y = testMouse.y;

                    if(clickedArea==="rb"){
                        if(mouse.x < (pageLeft + pageWidth*0.5)){
                            startTurn();
                        }else{
                            return;
                        }
                    }else if(clickedArea === "rt"){
                        if(mouse.x < (pageLeft + pageWidth*0.5)){
                            startTurn();
                        }
                    }
                    else if(clickedArea ==="lb"){
                        if(pageNumber <=0) {
                            return;
                        }else{
                            if(mouse.x > (pageLeft + pageWidth)){
                                startTurn();
                            }
                        }
                    }
                }else {
                    return;
                }
            }

            function onMouseUp(wrapper, id, x, y) {
                if(clickedArea==="rb"){
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }else if(clickedArea==="lb"){
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y-1;
                }else{
                    return;
                }
                dirtyCount=20;
                turningCount=5;
                isMouseOver = false;
                isMouseDown = false;
                isDrag = false;
            }
            //Start the turning effect
            function startTurn(){
                if(clickedArea==="rb"){
                    mouse.x = leftEdgeBottom.x;
                    mouse.y = leftEdgeBottom.y;
                    pageNumber++;
                }else if(clickedArea==="lb"){
                    pageNumber--;
                    mouse.x = rightEdgeBottom.x;
                    mouse.y = rightEdgeBottom.y;
                }
                isTurning = true;
                turningCount = 5;
                isMouseOver = false;
                isMouseDown = false;
                isDrag = false;
            }

            function turnPage(){
               
                if(turningCount>0){
                    dirtyCount = 15;
                    turningCount--;
                    if(clickedArea==="rb"){
                        mouse.x = leftEdgeBottom.x;
                        mouse.y = leftEdgeBottom.y;
                    }else if(clickedArea==="lb"){
                        mouse.x = rightEdgeBottom.x;
                        mouse.y = rightEdgeBottom.y;
                    }
                }else {
                    if(clickedArea === "rb"){

                        var pageNumber = $("#showPage");
                        var deferred = $.Deferred().resolve();
                        var btnPrev = $("#prevbtn");
                        var currentPageTest = (currentPage+1);
                        var pageNumberText;

                        currentPage = nextPage;
                        nextPage+=2;

                        mouse.x = rightEdgeBottom.x-1;
                        mouse.y = rightEdgeBottom.y-1;

                        rightFollow.x = rightEdgeBottom.x-1;
                        rightFollow.y = rightEdgeBottom.y-1;


                        //Trigger page turn event

                        $("#lp").trigger({
                            type: "pageTurnEvent",
                            currentPageNumber: currentPage,
                            clicked: 'lb'
                        });

                        drawFrameWork();

                        //After drawing hide the invisible elements

                        if(currentPageTest>0){
                            btnPrev.removeClass("fa-inverse");
                        }
                        pageNumberText = (currentPage) + " / " + numberOfPages;
                        pageNumber.html(pageNumberText);

                    }else if (clickedArea === "lb"){
                        if(currentPage!==0){

                            var btnPrev = $("#prevbtn");
                            var currentPageTest = (currentPage+1);
                            var deferred = $.Deferred().resolve();
                            var pageNumber = $("#showPage");
                            var pageNumberText;
                            nextPage = currentPage;
                            currentPage-=2;

                            if(currentPageTest<=0){
                                btnPrev.addClass("fa-inverse");
                            }


                            $("#lp").trigger({
                                type: "pageTurnEvent",
                                currentPageNumber: currentPage,
                                clicked: 'rb'
                            });



                            drawFrameWork();
                            pageNumberText = (currentPage) + "/" + numberOfPages;
                            pageNumber.html(pageNumberText);

                        }
                        mouse.x = leftEdgeBottom.x-1;
                        mouse.y = leftEdgeBottom.y-1;

                        leftFollow.x = leftEdgeBottom.x-1;
                        leftFollow.y = leftEdgeBottom.y-1;
                    }
                    isTurning = false;
                }
            }


            var element = document.getElementById('nextthumbnail'); //element that houses the current
            var menu = document.getElementById("menu");
            var btnPrev = document.getElementById('prevbtn');
       
            //Buttons on the thumbnail section
            var firstPage = document.getElementById('first-page');
            var lastPage = document.getElementById('last-page');
            var thumnails = document.getElementById("thumbnails");
            //pages
            var page0 = document.getElementById("page0");
            var page1 = document.getElementById("page1");
            var page2 = document.getElementById("page2");
            var page3 = document.getElementById("page3");
            var page4 = document.getElementById("page4");
            var page5 = document.getElementById("page5");
            var page6 = document.getElementById("page6");
          
            //Inner elements
         
            $("#page0Hover,#page1Hover,#page2Hover,#page3Hover,#page4Hover,#page5Hover,#page6_hover,#page7_hover").mouseleave(function(){
                $(this).removeClass("mouse_over_thumbnail");
                $(this).addClass("mouse_out_thumbnail");
            });

            $("#page0Hover,#page1Hover,#page2Hover,#page3Hover,#page4Hover,#page5Hover,#page6_hover,#page7_hover").mouseenter(function(){
                $(this).removeClass("mouse_out_thumbnail");
                $(this).addClass("mouse_over_thumbnail");
            });

            $("#page0-thumbnail").mouseleave(function(event){
                $(page0Thumbnail).animate({height: "90%",width: "90%",left: "10%",top: "7%"});

            });

            $("#page0-thumbnail").mouseenter(function(event){
                $("##page0-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});
                var helloworld = document.createElement("div");
            });

            $("#page1-thumbnail").mouseleave(function(event){
                $("##page1-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page1-thumbnail").mouseenter(function(event){
                $("##page1-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});

            });

            $("#page2-thumbnail").mouseleave(function(event){
                $("#page2-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page2-thumbnail").mouseenter(function(event){
                $("#page2-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});

            });

            $("#page3-thumbnail").mouseleave(function(event){
                $("#page3-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page3-thumbnail").mouseenter(function(event){
                $("#page3-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});

            });

            $("#page4-thumbnail").mouseleave(function(event){
                $("#page4-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page4-thumbnail").mouseenter(function(event){
                $("#page4-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});

            });

            $("#page5-thumbnail").mouseleave(function(event){
                $("#page5-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page5-thumbnail").mouseenter(function(event){
                $("#page5-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});
                $("#page5-thumbnail").append("<div> Hello world </div>");

            });

            $("#page6-thumbnail").mouseleave(function(event){
                $("#page6-thumbnail").animate({height: "90%",width: "90%",left: "10%",top: "7%"});
            });

            $("#page6-thumbnail").mouseenter(function(event){
                $("#page6-thumbnail").animate({height: "105%",width: "100%",left: "5%", top: "2%"});

            });

            $("#next_nav,#nextbtn").click(function(){
               moveNext(); 
            });

            $("#prevbtn,#prev_nav").click(function(){
               movePrevious();
            });

            function moveNext(){
                if(dirtyCount>0){
                    return;
                }
                if(currentPage >= (numberOfPages-1) || isTurning) {
                    return;
                }
                if(currentPage>= numberOfPages) {
                    return;
                }
                clickedArea = "rb";

                dirtyCount=5;
                turningCount =5;
                mouse.x = rightEdgeBottom.x;
                mouse.y = rightEdgeBottom.y;

                mouse.x = leftEdgeBottom.x-1;
                mouse.y = leftEdgeBottom.y -1;
                isTurning = true;
            }

            function movePrevious(){
                 if(dirtyCount>0){
                    return;
                }
                if(currentPage<=0) return;
                if(currentPage> numberOfPages || isTurning) {
                    return;
                }
                clickedArea = "lb";
                dirtyCount=5;
                turningCount =10;
                mouse.x = leftEdgeBottom.x;
                mouse.y = leftEdgeBottom.y;  
                mouse.x = rightEdgeBottom.x-1;
                mouse.y = rightEdgeBottom.y-1;
                isTurning = true;
            }


            $(window).keydown(function(event){
                if(event.which===37){
                    movePrevious();
                }else if(event.which === 39){
                    moveNext();
                }
                else{
                    //alert(event.which);
                }
            });

            var menuNext3 = document.getElementById("next-thumb-page");
            var menuPrev3 = document.getElementById("prev-thumb-page");
            var firstPageBtn = document.getElementById("first-page");
            var lastPageBtn = document.getElementById("last-page");
            var menuNextIcon = document.getElementById("next-thumb-page-icon");
            var lastPageIcon = document.getElementById("last-page-icon");


            $("#zoomRange").on("input change", function(){
                var rangeValue = jQuery(this).val();
                zoomPages(rangeValue);
            });
    
            Hammer(menuPrev3).on("tap", function(event){
                if(isMenuSliding) {
                    return;
                }
                if(menuCurrentPage<1) {
                    return;
                }
                if(menuCurrentPage<=2) {
                    $(menuPrev3).removeClass("fa-inverse");
                    $(firstPageBtn).removeClass("fa-inverse");
                }else{
                    $(menuPrev3).addClass("fa-inverse");
                    $(firstPageBtn).addClass("fa-inverse");
                }
                if((menuCurrentPage+11) <= numberOfPages) {
                    $(menuNextIcon).addClass("fa-inverse");
                    $(lastPageIcon).addClass("fa-inverse");
                }
                menuMoveRight = false;
                menuMoveLeft = true;
                dirtyCountMenu =50;
                turningCountMenu = 40;
                menuMouseX = 15;
                slideMenu();
            });

            Hammer(menuNext3).on("release", function(event){

                if(isMenuSliding) {
                    return;
                }
                if((menuCurrentPage+13) >= numberOfPages) {
                    $(menu).removeClass("fa-inverse");
                    $(lastPageBtn).removeClass("fa-inverse");
                    $(menuNextIcon).removeClass("fa-inverse");
                    $(lastPageIcon).removeClass("fa-inverse");
                }
                if((menuCurrentPage+13) > numberOfPages) {
                    return;

                }

                if(menuCurrentPage<0) {
                    $(menuPrev3).removeClass("fa-inverse");
                    $(firstPageBtn).removeClass("fa-inverse");
                }else{
                    $(menuPrev3).addClass("fa-inverse");
                    $(firstPageBtn).addClass("fa-inverse");
                }


                dirtyCountMenu =50;
                menuMoveRight = true;
                menuMoveLeft = false;
                turningCountMenu = 40;
                menuMouseX = -15;
                slideMenu();
            });

            Hammer(page0).on("tap", function(event){
                if(currentPage===(menuCurrentPage-1)) {
                    return;
                }
                var tempCurrent = currentPage;
                currentPage =0;
                nextPage =0;

                //If the current page is greater then the next pages
                if(tempCurrent <= (menuCurrentPage-3)){
                    currentPage = menuCurrentPage-3;
                    nextPage =  menuCurrentPage-1;

                    //If it is the same page return
                    event.preventDefault();
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;

                }else{
                    clickedArea = "lb";
                  

                    currentPage =0;
                    nextPage =0;

                    currentPage = menuCurrentPage+1;
                    nextPage =  menuCurrentPage+3;

                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page1).on("tap", function(event){
                if(currentPage===(menuCurrentPage+1)) {
                    event.stopPropagation();
                    event.exit();
                    return;
                }
                event.preventDefault();
                var newCurrentPage;
                var newNextPage;
                var tempCurrent = currentPage;

                if(tempCurrent <= (menuCurrentPage-1)){
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage-1;
                    nextPage =  menuCurrentPage+1;

                    clickedArea = "rb";
                    
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                }else{
                    clickedArea = "lb"; 
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                    

                    currentPage =0;
                    nextPage =0;

                    currentPage = menuCurrentPage+3;
                    nextPage =  menuCurrentPage+5;

                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page2).on("tap", function(event){
                var tempCurrent = currentPage;
                event.preventDefault();

                if(currentPage===(menuCurrentPage+3)) {
                    event.stopPropagation();
                    event.exit();
                    return;
                }

                if(tempCurrent <= (menuCurrentPage+1)){
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+1;
                    nextPage =  menuCurrentPage+3;
                    clickedArea = "rb";
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                }else {
                    clickedArea = "lb";
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+5;
                    nextPage =  menuCurrentPage+7;
                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page3).on("tap", function(event){
                event.preventDefault();
                event.stopPropagation();
                var tempCurrent = currentPage;

                if(currentPage===(menuCurrentPage+5)) {
                    return;
                }

                if(tempCurrent <= (menuCurrentPage+3)){
                    clickedArea = "rb";

                    currentPage =0;
                    nextPage =0;

                    currentPage = menuCurrentPage+3;
                    nextPage =  menuCurrentPage+5

                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                }else{
                    clickedArea = "lb";
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+7;
                    nextPage =  menuCurrentPage+9;
                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page4).on("tap", function(event){
                if(currentPage===(menuCurrentPage+7)) {
                    return;
                }
                var tempCurrent = currentPage;

                event.preventDefault();
                event.stopPropagation();
                if(tempCurrent <= (menuCurrentPage+5)){
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+5;
                    nextPage =  menuCurrentPage+7;
                    clickedArea = "rb";
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                }else{
                    clickedArea = "lb";
                    var counter = 0;
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+9;
                    nextPage =  menuCurrentPage+11;
                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page5).on("tap", function(event){
                if(currentPage===(menuCurrentPage+9)) {
                    return;
                }
                var tempCurrent = currentPage;
              
                event.preventDefault();
                event.stopPropagation();
                if(tempCurrent <= (menuCurrentPage+7)){
                    currentPage = menuCurrentPage+7;
                    nextPage =  menuCurrentPage+9;

                    clickedArea = "rb";

                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                } else {
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+11;
                    nextPage =  menuCurrentPage+13;
                    clickedArea = "lb";
                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            Hammer(page6).on("tap", function(event){
                if(currentPage===(menuCurrentPage+11)) {
                    return;
                }
                var tempCurrent = currentPage;
                event.preventDefault();
                event.stopPropagation();

                if(tempCurrent <= (menuCurrentPage+9)){
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+9;
                    nextPage =  menuCurrentPage+11;
                    clickedArea = "rb";
                    dirtyCount=10;
                    turningCount =10;
                    isTurning = true;
                    mouse.x = leftEdgeBottom.x-1;
                    mouse.y = leftEdgeBottom.y -1;
                } else {
                    currentPage =0;
                    nextPage =0;
                    currentPage = menuCurrentPage+13;
                    nextPage =  menuCurrentPage+15;
                    clickedArea = "lb";
                    dirtyCount=20;
                    turningCount =0;
                    isTurning = true;
                    mouse.x = rightEdgeBottom.x-1;
                    mouse.y = rightEdgeBottom.y-1;
                }
            });

            $(thumbnails).mouseenter(function(event){
                mouseOnMenu = true;
            });

            var drag = false;
            $("#lp").mousemove(function(event){
                drag = true;
                if(zoom && drag){
                zoomMouse.x = event.clientX*xscale;
                zoomMouse.y = event.clientY*yscale;
                } 
            });
           
           
            $(thumbnails).mouseleave(function(event){
                event.preventDefault();
                $("#thumbnails").animate({ top: "100%"},400);
                $(element).removeClass("isDown");
                $("#arrow").removeClass("fa fa-angle-down fa-2x fa-inverse");
                $("#arrow").addClass("fa fa-angle-up fa-2x fa-inverse");
                event.stopPropagation();
            });

            Hammer(element).on("touch", function(event) {
                event.preventDefault();
                if($(this).hasClass("isDown")){
                    $("#thumbnails").animate({ top: "100%"},400);
                    $(this).removeClass("isDown");
                    $("#arrow").removeClass("fa fa-angle-down fa-2x fa-inverse");
                    $("#arrow").addClass("fa fa-angle-up fa-2x fa-inverse");
                }else{
                    $("#thumbnails").animate({ top: "85%"},400);
                    $(this).addClass("isDown");
                    $("#arrow").removeClass("fa fa-angle-up fa-2x fa-inverse");
                    $("#arrow").addClass("fa fa-angle-down fa-2x fa-inverse");
                }
                event.stopPropagation();
            });

            $(element).mouseenter(function(event){
                event.preventDefault();
                $("#thumbnails").animate({ top: "85%"},400);
                $(this).addClass("isDown");
                $("#arrow").removeClass("fa fa-angle-up fa-2x fa-inverse");
                $("#arrow").addClass("fa fa-angle-down fa-2x fa-inverse");
                event.stopPropagation();
            });

            $(menu).mouseenter(function(){
                $("#menu-options").animate({ top: "0%"},400);
                $(this).addClass("moveDown");
                $("#arrow-menu").removeClass("fa fa-angle-down fa-1x fa-inverse");
                $("#arrow-menu").addClass("fa fa-angle-up fa-1x fa-inverse");
            });
            //When the mouse leaves the menu options hide it
            $("#menu-options").mouseleave(function(){
                $(menu).removeClass("moveDown");
                $("#arrow-menu").removeClass("fa fa-angle-up fa-1x fa-inverse");
                $("#arrow-menu").addClass("fa fa-angle-down fa-1x fa-inverse");
            });

        }

        function start(_width,_height, totalPages){
            $('html').css('overflow','hidden');
            isZoomDisabled = false;
            main(_width, _height, totalPages);
        }

        return {
            init: start,
            reSize: setWidthSize,
            width: getOWidth,
            height: getOHeight,
            xscale: setXScale,
            yscale: setYScale,
            mouseX: getMouseX,
            mouseY: getMouseY
        };
    };