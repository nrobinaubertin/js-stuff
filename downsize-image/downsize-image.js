function downsizeImage(src, NW, NH) {
    var cW, cH;
    var imgdata;

/*
why Math.floor ?
https://29a.ch/2009/5/13/canvas-tag-drawimage-performance<Paste>
- Avoiding resampling from browser during drawImage
*/
/* 
Why divide by 2 ?
http://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality#19144434
For performances reasons Browsers do a very simple downsampling : 
to build the smaller image, they will just pick ONE pixel in the source and use its value for the destination. 
which 'forgots' some details and adds noise.
Yet there's an exception to that : 
since the 2X image downsampling is very simple to compute 
(average 4 pixels to make one) and is used for retina/HiDPI pixels, this case is handled properly 
-the Browser does make use of 4 pixels to make one-.
*/
    cW = Math.floor(src.naturalWidth / 2);
    cH = Math.floor(src.naturalHeight / 2);
    if(cW < NW) {
        cW = NW;
        cH = NH; 
    }
    if(cH < NH) {
        cH = NH;
        cW = NW;
    }

    var c = [];
    c.push(document.createElement('canvas'));
    c[0].width = cW;
    c[0].height = cH;

    var ctx;
    ctx = c[0].getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, cW, cH);
    
    if(cW <= NW || cH <= NH) {
        return c[0].toDataURL('image/jpeg');
    }
    
    c.push(document.createElement('canvas'));
    var i = 0;
    while(i<10) { 
        i++;

        nW = Math.floor(cW / 2);
        nH = Math.floor(cH / 2);

        if(nW < NW) {
            nW = NW;
            nH = NH; 
        }
        if(nH < NH) {
            nH = NH;
            nW = NW;
        }

        c[i%2].width = nW;
        c[i%2].height = nH;
        ctx = c[i%2].getContext('2d');

        ctx.drawImage(c[(i-1)%2], 0, 0, cW, cH, 0, 0, nW, nH);
        if(nW <= NW || nH <= NH) {
            /* Why output to DataURL and not imagedata ?
             * ImageData is an order of magnitude bigger than dataURL and not really faster.
             */
            return c[i%2].toDataURL('image/jpeg');
        }
        cW = nW;
        cH = nH;
    }
}
