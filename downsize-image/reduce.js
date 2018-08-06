/* this code needs jquery for now */

function inputFile() {
    $('body')[0].style.background = "green";
    input = $('<input class="hidden" type="file"></input>');
    input.on('change', function(evt){
        window.timer = Date.now();
        displayFile(evt.target.files[0]);
        this.parentNode.removeChild(this);
        loadImage(evt.target.files[0]);
    });
    $('body').append(input);
    input.click();
}

function displayFile(file) {
    var img = new Image();
    img.onload = function() {
        $('body').append(this);
        var duration = Date.now() - window.timer;
        $('body').append('<span>'+duration+'</span><br>');
    };
    img.src = window.URL.createObjectURL(file);
}

function loadImage(file) {
    var img = new Image();
    img.onload = function() {
            var w = Math.min(this.naturalWidth, 1280);
            var h = Math.min(this.naturalHeight, 1280);
            var g = Math.min(w/this.naturalWidth, h/this.naturalHeight);
            var nw = Math.floor(this.naturalWidth*g);
            var nh = Math.floor(this.naturalHeight*g);
            
            var img3 = new Image();
            img3.onload = function() {
                $('body').append(this);
                var duration = Date.now() - window.timer;
                $('body').append('<span>'+duration+'</span><br>');
            };
            img3.src = downsizeImage(this, nw, nh);
            window.URL.revokeObjectURL(img.src);
    };
    img.src = window.URL.createObjectURL(file);
}
