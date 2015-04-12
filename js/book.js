/*! 
 * 
 *
 * Copyright (c) 2014 Eric Kiilu 
*/

"use strict";
//Adding pdf intergration
var DEFAULT_CACHE_SIZE = 12;
var CLEANUP_TIMEOUT = 3000;
var cache =  new Cache(DEFAULT_CACHE_SIZE);
var startBook = new flipBook(jQuery);



var UNKNOWN_SCALE = 0;
var CSS_UNITS = 96.0 / 72.0;

var PDFView = {
    pages: [],
    thumbnails: [],
    pageRotation: 0,
    pdfDocument: null,
    currentPosition: null,
    currentScale: UNKNOWN_SCALE,
    previousPageNumber: 1,
    idleTimeout: null,
    currentPage: 0,
    o_height: 0,
    o_width: 0,
    oScale: 0,


    getPage: function pdfViewGetpage(n){
        return this.pdfDocument.getPage(n);
    },

    initialize: function pdfViewInitalize(){
    var self = this;
    //Main div tag used to listen for events
    PDFView.initialized = true;
    $("#lp").on("pageTurnEvent", function(event){
        setTimeout((function(){
            self.currentPage = event.currentPageNumber;
            updateViewArea();
        }),0);        
    });
   
    },

    setScale: function pdfSetScale(value){
        var scale = parseFloat(value);
        if(scale > 0){
            this.setScaleUpdatePages(scale);
        }else{
            var currentPage = this.pages[this.page -1];


            if(!currentPage){
                return;
            }

            var hpadding = SCROLLBAR_PADDING;
            var vpadding = VERTICAL_PADDING;

            var pageWidthScale = (this.container.clientWidth - hpadding) / (currentPage.width * currentPage.scale);
            var pageHeightScale = (this.container.clientHeight - vpadding) / (currentPage.height * currentPage.scale);



            switch(value){
                case 'page-actual':
                    scale =1;
                    break;
                case 'page-width':
                    scale = pageWidthScale;
                    break;
                case 'page-height':
                    scale = pageHeightScale;
                    break;
                case 'page-fit':
                    scale = Math.min(pageWidthScale, pageHeightScale);
                    break;
                default:
                    return;
            }
            this.setScaleUpdatePages(scale);
        }
    },

    setScaleUpdatePages: function updatePages(newScale){

        for ( var i = 0,ii = this.pages.length; i < ii; i++ ){
            this.pages[i].update(newScale);
        }

        this.currentScale = newScale;

        var event =  document.createEvent('UIEvents');
        event.initUIEvent("scalechange", false, false, window,0);
        event.scale = newScale;
        window.dispatchEvent(event);
    },

    open: function pdfViewOpen(url,scale){
      

        var self = this;
        self.loading = true;
        self.downloadComplete = false;

        var parameters = {
            url: null
        };

        var pdfDataRangeTransport;
        var passWordNeeded = false;
        parameters.url = url;

    
        PDFJS.getDocument(url).then(function getDocumentCallBack(pdfDocument) {
            self.load(pdfDocument, scale);
        });
    },
       getVisibleViews: function getVisiblePdfViews(){

        var visiblePages = [];
        var currentPage = PDFView.currentPage;
        var index = currentPage -1;
        var pagesCount = PDFView.pdfDocument.numPages;



        if( currentPage === 0 ){
            visiblePages = [];

            var rightPage = this.pages[index+1];
            var rightPageClip = this.pages[index+2];
            var rightPageClip2 = this.pages[index +3];

            //Insert the pages to be rendered in the array
            visiblePages[0] = rightPage;
            visiblePages[1] = rightPageClip;
            visiblePages[2] = rightPageClip2;

            return visiblePages;

        }else if(currentPage === 2){
            visiblePages = [];

            var leftPage = this.pages[index];
            var leftPageClip = this.pages[index-1];

            var rightPage = this.pages[index+1];
            var rightPageClip = this.pages[index+2];
            var rightPageClip2 = this.pages[index +3];

            visiblePages.push(leftPage);
            visiblePages.push(leftPageClip);
            visiblePages.push(rightPage);
            visiblePages.push(rightPageClip);
            visiblePages.push(rightPageClip2);

            return visiblePages;


        }else if(currentPage >= 4 && (currentPage+3) <= pagesCount) {

            visiblePages = [];

            var leftPage = this.pages[index];
            var leftPageClip = this.pages[index-1];
            var leftPageClip2 = this.pages[index-2];


            var rightPage = this.pages[index+1];
            var rightPageClip = this.pages[index+2];
            var rightPageClip2 = this.pages[index +3];

            visiblePages[0] = leftPage;
            visiblePages[1] = leftPageClip;
            visiblePages[2] = leftPageClip2;

            visiblePages[3] = rightPage;
            visiblePages[4] = rightPageClip;
            visiblePages[5] = rightPageClip2;

            return visiblePages;
        }else{
            visiblePages = [];
            var leftPage = this.pages[index];
            var leftPageClip = this.pages[index-1];
            var leftPageClip2 = this.pages[index-2];
            var rightPage = this.pages[index+1];
            var lastPage = this.pages[index+2];
            visiblePages[0] = leftPage;
            visiblePages[1] = leftPageClip;
            visiblePages[2] = leftPageClip2;
            visiblePages[3] = rightPage;
            visiblePages[4] = lastPage;
            return visiblePages;
        }
        //Return the array containing visible pages
        return visiblePages

    }
    ,
    load: function pdfViewLoad(pdfDocument,scale){
        var self = this;
        var isOnePageRenderedResolved = false;
        var resolveOnePageRendered = null;

        var onePageRendered = new Promise(function (resolve){
            resolveOnePageRendered = resolve;
        });

        //set up the pdf document
        this.pdfDocument = pdfDocument;

        //get the number of pages for the pdf
        var pagesCount = pdfDocument.numPages;

        //unique id of the pdf
        var id = pdfDocument.fingerprint;

        PDFView.documentFingerprint = id;
        var pages = [];
        this.pages = pages;
        var pagesRefMap =  {};
        this.pagesRefMap = {};
        var thumbnails  = [];
        this.thumbnails = [];

        //resolved pages promise
        var resolvePagesPromise;

        //pages promise
        var pagesPromise = new Promise(function (resolve){
            resolvePagesPromise = resolve;
        });

        this.pagesPromise = pagesPromise;
        //Start loading the first page
        var firstPagePromise = pdfDocument.getPage(1);

        //resolve the firstpage promise
        firstPagePromise.then(function(pdfPage){
            var hello = pdfPage.getViewport((scale || 1.0) * CSS_UNITS);
            var container = document.getElementById("lp");
            var viewPortWidth = hello.width;
            var viewPortHeight = hello.height;
            var viewPortScale = hello.scale;

            self.viewPortWidth = viewPortWidth;
            self.viewPortHeight = viewPortHeight;

            var pageWidthScale = ((container.clientWidth)  / viewPortWidth);
            var pageHeightScale = (container.clientHeight/ viewPortHeight);

            scale = Math.min(pageWidthScale,pageHeightScale);

            self.oScale = scale;

            for(var pageNum = 1; pageNum <= pagesCount; pageNum++){
                var viewportClone = hello.clone();
                try{
                    var pageView = new PageView(container, pageNum, scale, viewportClone);
                    //pageView.draw();
                    pages.push(pageView);
                }catch(exception){
                    console.log("Error : "+ exception);
                    
                }
            }

            var pageViewPort = pdfPage.getViewport((scale || 1.0) * CSS_UNITS);
            var height = pageViewPort.height;
            var width = pageViewPort.width;

            PDFView.o_height = height;
            PDFView.o_width = width;

            startBook.init(width,height, pagesCount);
            updateViewArea();

			
        });
    },

    getHighestPriority: function pdfGetHighestPriority(views){
        var viewsLength = views.length;

        for(var i=0; i< (viewsLength); i++){
            if (views[i] === undefined) {
                return false;
            }

            try{
                if(views[i].renderingState !== RenderingState.FINISHED ){
                    return views[i];
                }
            }catch(ex){
                console.log("Error:!!!!! "+ ex);
            }

        }
        //return undefined
        return false;
    },

    renderView: function pdfRenderView(view){

        try{
             var state = view.renderingState;
         }catch(ex){
            console.log(ex);
         }
       

        switch (state){
            case RenderingState.FINISHED:
                return false;
            case RenderingState.RUNNING:
                break;
            case RenderingState.INITIAL:
                view.draw(this.renderHighestPriority.bind(this));
        }
        return true;
    },

    //Render the views with the highest rendering priority

    renderHighestPriority : function pdfViewRenderHighestPriority(currentlyVisiblePages){

        if(PDFView.idleTimeout){
            clearTimeout(PDFView.idleTimeout);
            PDFView.idleTimeout = null;
        }

        var visiblePages = currentlyVisiblePages || this.getVisibleViews();

        var pageView = this.getHighestPriority(visiblePages);


        if(pageView){
            this.renderView(pageView);
            return;
        }

        PDFView.idleTimeout = setTimeout(function(){

        },CLEANUP_TIMEOUT);

    },
    //Clean up
    cleanup: function pdfViewCleanUp(){
        var numberOfpages = this.pages.length;
        for(var i=0; i<= numberOfpages; i++){
            //First check to see whether the page exists
            if(this.pages[i] && this.pages[i].renderingState !== RenderingState.FINISHED){
                this.pages[i].cleanup();
            }
        }
    }

}

var RenderingState = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINISHED: 3
};

function webViewerInitialized(pdf_file_path){
    window.scrollTo(0,0);
    PDFView.initialize();
    PDFView.open(pdf_file_path, 1.0);
}

//update ViewArea after turning the page 


function updateViewArea(){
    var visible = PDFView.getVisibleViews(PDFView.currentPage);
    //If the number of visible pages is zero return
    if(visible.length <=0){
        return;
    }
 
    var cacheSize = Math.max((visible.length)*2.5);
    cache.resize(cacheSize);
    PDFView.renderHighestPriority(visible);
    //Find the height and width
    var width = PDFView.pages[0].width;
    var height  = PDFView.pages[0].height;

    for(var i=0; i<= visible.length;i++){
        if(visible[i]===undefined) continue;
        if(visible[i].renderingState === RenderingState.FINISHED){
            var width = visible[i].width;
            var height = visible[i].height; 
            break;
        }
    }


    var one = ((width/PDFView.o_width)) ;
    var two = (height/PDFView.o_height);

    var o = startBook.width();
    var h = startBook.height();
    $("#lp-book").css({width: o*one ,height: h*two});
    startBook.xscale(one-1);
    startBook.yscale(two-1);

    startBook.reSize(width,height);
    var x_coord = startBook.mouseX();
    var y_coord = startBook.mouseY();
};
