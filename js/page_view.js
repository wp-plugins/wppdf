/**
 * Created by eric on 8/8/14.
 */

'use strict';

var PageView =  function pageView(mycontainer, id, scale, defaultViewPort){
    var container = document.getElementById("lpcontainer");
    this.id = id;
    this.scale = scale || 1.0;
    var viewport = defaultViewPort;
    this.renderingState = RenderingState.INITIAL;
    var div = document.createElement("div");

    div.id = 'pageContainer'+ id;

    div.style.width = Math.floor(viewport.width) + "px";
    div.style.height = Math.floor(viewport.height) + "px";

    container.appendChild(div);



    this.setPdfPage = function pageViewSetPdf(pdfPage){
        try{
            this.pdfPage = pdfPage;
            this.pdfPageRotate = pdfPage.rotate;
            var totalRotation = (this.rotation + this.pdfPageRotate) % 360;
            this.viewport = pdfPage.getViewport(this.scale * CSS_UNITS, totalRotation);
            this.stats = pdfPage.stats;
            this.reset();

        }catch(exception){
            alert("Error.." + exception);
        }
    };

    this.destroy = function pageViewDestroy(){
        this.zoomLayer = null;
        this.reset();
        if(this.pdfPage){
            this.pdfPage.destroy();
        }
    };

    this.reset = function pageViewReset(){

        try{
            if(this.renderTask){
                this.renderTask.cancel();
            }

            this.resume = null;
            this.renderingState = RenderingState.INITIAL;


            //reset the div size i.e height and width
            div.style.width = Math.floor(this.viewport.width) + 'px';
            div.style.height= Math.floor(this.viewport.height) + 'px';


            var childNodes = div.childNodes;

            for(var i =0; i< div.childNodes.length; i++){
                var node = childNodes[i];
                div.removeChild(node);
            }


            div.removeAttribute("data-loaded");

            this.annotationLayer = null;
            //release canvas resources immediately
            if(this.canvas){
                this.canvas.width = 0;
                this.canvas.height = 0;
                delete  this.canvas;

            }


        }catch(exception){
            alert("This is exception "+ exception);
        }


    };


    this.update = function pageViewUpdate(scale, rotation){
        this.scale = scale || this.scale;
        this.rotation = rotation || this.rotation;

        //Total ration of the page
        var totalRotation = (this.rotation + this.pdfPageRotate) % 360;

        this.viewport = viewport.clone({
            scale: this.scale * CSS_UNITS,
            rotation: totalRotation
        });

        this.reset();
    };

    Object.defineProperty(this, 'height', {
        get: function pageViewHeight(){
            return this.viewport.height;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'width', {
        get: function pageViewWidth(){
            return this.viewport.width;
        },
        enumerable: true
    });


    this.getTextContent = function pageViewTextContent(){
        return PDFView.getPage(this.id).then(function(pdfPage){
            return pdfpage.getTextContent();
        });
    };

    //Draw the pdf
    this.draw = function pageViewDraw(callback){
        var pdfPage = this.pdfPage;
        //If the page has already been requested return
        if(this.pagePdfPromise){
            return;
        }


        if(!pdfPage){
            var promise = PDFView.getPage(this.id);
            promise.then(function(pdfPage){
                delete this.pdfPagePromise;
                this.setPdfPage(pdfPage);
                this.draw(callback);
            }.bind(this));
            this.pdfPagePromise = promise;
            return;
        }


        //The pdfviewer must be fresh before rendering
        if(this.renderingState !== RenderingState.INITIAL ){
            console.log("Warning: Not initial state")
        }
        //Rendering state must be in running mode
        this.renderingState = RenderingState.RUNNING;
        var viewport = this.viewport;

        var canvasWrapper = document.createElement("div");
        canvasWrapper.style.width = div.style.width;
        canvasWrapper.style.height = div.style.height;

        //canvasWrapper.innerHTML("This is one of the greatest things in the world ");

        canvasWrapper.classList.add("canvasWrapper");


        var canvas = document.createElement("canvas");
        canvas.id = "page"+ this.id;
        canvasWrapper.appendChild(canvas);
        div.appendChild(canvasWrapper);

        //Set the canvas for the current object i.e pageView Object
        this.canvas = canvas;

        var ctx = canvas.getContext("2d");

        var outputscale = getOutputScale(ctx);


        if(PDFJS.maxCanvasPixels > 0){

        }

        canvas.width = (Math.floor(viewport.width) * outputscale.sx) | 0;
        canvas.height=  (Math.floor(viewport.height)* outputscale.sy) | 0;

        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        canvas._viewport = viewport;

        var textLayerDiv = null;

        textLayerDiv = document.createElement("div");
        textLayerDiv.className  = "textLayer";
        textLayerDiv.style.width = canvas.style.width;
        textLayerDiv.style.height = canvas.style.height;

        //div.appendChild(textLayerDiv);


        ctx._scaleX = outputscale.sx;
        ctx._scaleY = outputscale.sy;

        //If it is scaled
        if(outputscale.scaled){
            ctx.scale(outputscale.sx, outputscale.sy);
        }

        var renderContext = {
            canvasContext: ctx,
            viewport: this.viewport
        }

        var renderTask = this.renderTask;

        try{
            this.renderTask = this.pdfPage.render(renderContext);
            this.renderTask.promise.then(function noError(){
                pageViewDrawCallback(null);
            }, function pdferror(error){
                pageViewDrawCallback(error);
            })

        }catch (exception){
            console.log("Warning1"+ exception);
        }
        var self = this;

        function pageViewDrawCallback(error){


            if(renderTask === self.renderTask){
                self.renderTask = null;
            }
            if(error === "cancelled"){
                return;
            }

            if(self.onAfterDraw){
                self.onAfterDraw();
            }
            self.renderingState = RenderingState.FINISHED;
            //execute the call back
            if(callback){
                callback();
            }
            
        }
        cache.push(this);
    };
}