// *****************************************************************************************************************
// *
// THESE FUNCTIONS ARE PULLED FROM A GREAT SET OF ARTICLES ON HANDLING TOUCH IN IE AND IPAD BY TED JOHNSON AT IEBLOGS.
// ORIGINAL ARTICLE AND EXPLANATION CAN BE FOUND HERE: 
// http://blogs.msdn.com/b/ie/archive/2011/10/19/handling-multi-touch-and-mouse-input-in-all-browsers.aspx
// *
// *****************************************************************************************************************


function LivelypaperEvent(target, pointerStart, pointerMove, pointerEnd) 
{

    var lastXYById = {};

    //  Opera doesnt have Object.keys so we use this wrapper
    function NumberOfKeys(theObject) {
        if (Object.keys) 
          return Object.keys(theObject).length;
        var n = 0;
        for (var key in theObject) 
          ++n;
        return n;
    }

    //  IE10s implementation in the Windows Developer Preview requires doing all of this
    //  Not all of these methods remain in the Windows Consumer Preview, hence the tests for method existence.
    function PreventDefaultManipulationAndMouseEvent(evtObj) 
    {
      if (evtObj.preventDefault)
          evtObj.preventDefault();

      if (evtObj.preventManipulation)
          evtObj.preventManipulation();

      if (evtObj.preventMouseEvent)
          evtObj.preventMouseEvent();
    }

    //  we send target-relative coordinates to the draw functions
    //  this calculates the delta needed to convert pageX/Y to offsetX/Y because offsetX/Y dont exist in the TouchEvent object or in Firefoxs MouseEvent object
    function ComputeDocumentToElementDelta(theElement) 
    {
      var elementLeft = 0;
      var elementTop = 0;

      for (var offsetElement = theElement; offsetElement != null; offsetElement = offsetElement.offsetParent) 
      {
          //  the following is a major hack for versions of IE less than 8 to avoid an apparent problem on the IEBlog with double-counting the offsets           
          //  this may not be a general solution to IE7s problem with offsetLeft/offsetParent
          if (navigator.userAgent.match(/\bMSIE\b/) && (!document.documentMode || document.documentMode < 8) && offsetElement.currentStyle.position == "relative" && offsetElement.offsetParent 
          && offsetElement.offsetParent.currentStyle.position == "relative" && offsetElement.offsetLeft == offsetElement.offsetParent.offsetLeft) 
          {
              // add only the top
              elementTop += offsetElement.offsetTop;
          }
          else 
          {
              elementLeft += offsetElement.offsetLeft;
              elementTop += offsetElement.offsetTop;
          }
      }
      return { x: elementLeft, y: elementTop };
    }

    //  function needed because IE versions before 9 did not define pageX/Y in the MouseEvent object
    function EnsurePageXY(eventObj) 
    {
        if (typeof eventObj.pageX == 'undefined') {
            //  initialize assuming our source element is our target
            eventObj.pageX = eventObj.offsetX + documentToTargetDelta.x;
            eventObj.pageY = eventObj.offsetY + documentToTargetDelta.y;

            if (eventObj.srcElement.offsetParent == target && document.documentMode && document.documentMode == 8 && eventObj.type == "mousedown") {
                //  source element is a child piece of VML, were in IE8, and weve not called setCapture yet - add the origin of the source element
                eventObj.pageX += eventObj.srcElement.offsetLeft;
                eventObj.pageY += eventObj.srcElement.offsetTop;
            }
            else if (eventObj.srcElement != target && !document.documentMode || document.documentMode < 8) {
                //  source element isnt the target (most likely its a child piece of VML) and were in a version of IE before IE8 -
                //  the offsetX/Y values are unpredictable so use the clientX/Y values and adjust by the scroll offsets of its parents
                //  to get the document-relative coordinates (the same as pageX/Y)
                var sx = -2, sy = -2;   // adjust for old IEs 2-pixel border
                for (var scrollElement = eventObj.srcElement; scrollElement != null; scrollElement = scrollElement.parentNode) {
                    sx += scrollElement.scrollLeft ? scrollElement.scrollLeft : 0;
                    sy += scrollElement.scrollTop ? scrollElement.scrollTop : 0;
                }

                eventObj.pageX = eventObj.clientX + sx;
                eventObj.pageY = eventObj.clientY + sy;
            }
        }
    }

    //  cache the delta from the document to our event target (reinitialized each mousedown/MSPointerDown/touchstart)
    var documentToTargetDelta = ComputeDocumentToElementDelta(target);

    //  functions to convert document-relative coordinates to target-relative and constrain them to be within the target
    function targetRelativeX(px) { return Math.max(0, Math.min(px - documentToTargetDelta.x, target.offsetWidth)); };
    function targetRelativeY(py) { return Math.max(0, Math.min(py - documentToTargetDelta.y, target.offsetHeight)); };

    //  common event handler for the mouse/pointer/touch models and their down/start, move, up/end, and cancel events
    function DoEvent(theEvtObj) {

        //  optimize rejecting mouse moves when mouse is up
        if (theEvtObj.type == "mousemove" && NumberOfKeys(lastXYById) == 0)
            return;

        PreventDefaultManipulationAndMouseEvent(theEvtObj);

        var pointerList = theEvtObj.changedTouches ? theEvtObj.changedTouches : [theEvtObj];
        for (var i = 0; i < pointerList.length; ++i) {
            var pointerObj = pointerList[i];
            var pointerId = (typeof pointerObj.identifier != 'undefined') ? pointerObj.identifier : (typeof pointerObj.pointerId != 'undefined') ? pointerObj.pointerId : 1;

            //  use the pageX/Y coordinates to compute target-relative coordinates when we have them (in ie < 9, we need to do a little work to put them there)
            EnsurePageXY(pointerObj);
            var pageX = pointerObj.pageX;
            var pageY = pointerObj.pageY;

            if (theEvtObj.type.match(/(start|down)$/i)) {
                //  clause for processing MSPointerDown, touchstart, and mousedown

                //  refresh the document-to-target delta on start in case the target has moved relative to document
                documentToTargetDelta = ComputeDocumentToElementDelta(target);

                //  protect against failing to get an up or end on this pointerId
                if (lastXYById[pointerId]) {
                    if (pointerEnd)
                        pointerEnd(target, pointerId);
                    delete lastXYById[pointerId];
                }

                if (pointerStart)
                    pointerStart(target, pointerId, targetRelativeX(pageX), targetRelativeY(pageY));

                //  init last page positions for this pointer
                lastXYById[pointerId] = { x: pageX, y: pageY };

                //  in the Microsoft pointer model, set the capture for this pointer
                //  in the mouse model, set the capture or add a document-level event handlers if this is our first down point
                //  nothing is required for the iOS touch model because capture is implied on touchstart
                if (target.msSetPointerCapture)
                    target.msSetPointerCapture(pointerId);
                else if (theEvtObj.type == "mousedown" && NumberOfKeys(lastXYById) == 1) {
                    if (useSetReleaseCapture)
                        target.setCapture(true);
                    else {
                        document.addEventListener("mousemove", DoEvent, false);
                        document.addEventListener("mouseup", DoEvent, false);
                    }
                }
            }
            else if (theEvtObj.type.match(/move$/i)) {
                //  clause handles mousemove, MSPointerMove, and touchmove

                if (lastXYById[pointerId] && !(lastXYById[pointerId].x == pageX && lastXYById[pointerId].y == pageY)) {
                    //  only extend if the pointer is down and its not the same as the last point

                    if (pointerMove)
                        pointerMove(target, pointerId, targetRelativeX(pageX), targetRelativeY(pageY));

                    //  update last page positions for this pointer
                    lastXYById[pointerId].x = pageX;
                    lastXYById[pointerId].y = pageY;
                }
            }
            else if (lastXYById[pointerId] && theEvtObj.type.match(/(up|end|cancel)$/i)) {
                //  clause handles up/end/cancel

                if (pointerEnd)
                    pointerEnd(target, pointerId);

                //  delete last page positions for this pointer
                delete lastXYById[pointerId];

                //  in the Microsoft pointer model, release the capture for this pointer
                //  in the mouse model, release the capture or remove document-level event handlers if there are no down points
                //  nothing is required for the iOS touch model because capture is implied on touchstart
                if (target.msReleasePointerCapture)
                    target.msReleasePointerCapture(pointerId);
                else if (theEvtObj.type == "mouseup" && NumberOfKeys(lastXYById) == 0) {
                    if (useSetReleaseCapture)
                        target.releaseCapture();
                    else {
                        document.removeEventListener("mousemove", DoEvent, false);
                        document.removeEventListener("mouseup", DoEvent, false);
                    }
                }
            }
        }
    }

    var useSetReleaseCapture = false;

    if (window.navigator.msPointerEnabled) {
        //  Microsoft pointer model
        target.addEventListener("MSPointerDown", DoEvent, false);
        target.addEventListener("MSPointerMove", DoEvent, false);
        target.addEventListener("MSPointerUp", DoEvent, false);
        target.addEventListener("MSPointerCancel", DoEvent, false);

        //  css way to prevent panning in our target area
        if (typeof target.style.msContentZooming != 'undefined')
            target.style.msContentZooming = "none";

        //  new in Windows Consumer Preview: css way to prevent all built-in touch actions on our target
        //  without this, you cannot touch draw on the element because IE will intercept the touch events
        if (typeof target.style.msTouchAction != 'undefined')
            target.style.msTouchAction = "none";

    }
    else if (target.addEventListener) {
        //  iOS touch model
        target.addEventListener("touchstart", DoEvent, false);
        target.addEventListener("touchmove", DoEvent, false);
        target.addEventListener("touchend", DoEvent, false);
        target.addEventListener("touchcancel", DoEvent, false);

        //  mouse model
        target.addEventListener("mousedown", DoEvent, false);

        //  mouse model with capture
        //  rejecting gecko because, unlike ie, firefox does not send events to target when the mouse is outside target
        if (target.setCapture && !window.navigator.userAgent.match(/\bGecko\b/)) {
            useSetReleaseCapture = true;

            target.addEventListener("mousemove", DoEvent, false);
            target.addEventListener("mouseup", DoEvent, false);

        }
    }
    else if (target.attachEvent && target.setCapture) {
        //  legacy IE mode - mouse with capture
        useSetReleaseCapture = true;
        target.attachEvent("onmousedown", function () { DoEvent(window.event); window.event.returnValue = false; return false; });
        target.attachEvent("onmousemove", function () { DoEvent(window.event); window.event.returnValue = false; return false; });
        target.attachEvent("onmouseup", function () { DoEvent(window.event); window.event.returnValue = false; return false; });

    }

}