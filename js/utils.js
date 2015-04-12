/**
 * Created by eric on 8/1/14.
 */

function getOutputScale(ctx){
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

    var pixelRatio = (devicePixelRatio/ backingStoreRatio);

    return {
        sy: pixelRatio,
        sx: pixelRatio,
        scaled: pixelRatio != 1
    }
}

var Cache = function cacheCache(size){
    var data = [];
    this.push = function cachePush(view){
        var i = data.indexOf(view);
        if ( i>=0){
            data.splice(i, 1);
        }
        data.push(view);
        if(data.length >= size){
            data.shift().destroy();
        }
    };

    this.resize = function(newSize){
        size = newSize;
        while(data.length >= size){
            data.shift().destroy();
        }
    };

}

