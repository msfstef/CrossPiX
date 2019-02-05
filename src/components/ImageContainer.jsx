import React, { Component } from 'react';



class ImageContainer extends Component {
    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;
        
        img.onload = () => {pixelate(img, this.props.scale)}

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');   
        var color = document.getElementById('color');
        function pick(event) {
            var x = event.layerX;
            var y = event.layerY;
            var pixel = ctx.getImageData(x, y, 1, 1);
            var data = pixel.data;
            var rgba = 'rgba(' + data[0] + ', ' + data[1] +
                        ', ' + data[2] + ', ' + (data[3] / 255) + ')';
            color.style.background =  rgba;
            color.textContent = rgba;
        }
        canvas.addEventListener('mousemove', pick);
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl ||
            this.props.scale !== prevProps.scale)
        {
            this.onImgLoad()
        }
    } 
    
    render() {
        return (
            <div>
                <canvas id="canvas" width="300" height="227"></canvas>
                <div id="color"></div>

                
            </div>
        );
    }
}

export default ImageContainer


var pixelate = (img, scale) => {
    var canvas = document.getElementById('canvas');
    canvas.height = img.height / 2 ;
    canvas.width = img.width / 2;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var w = canvas.width / scale;
    var h = canvas.height / scale;
    ctx.drawImage(img, 0, 0, w, h);
    
    toggleAliasing(ctx);
    img.style.display = 'none';
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

var toggleAliasing = (ctx) => {
    if (ctx.imageSmoothingEnabled ||
        ctx.mozImageSmoothingEnabled ||
        ctx.webkitImageSmoothingEnabled ||
        ctx.msImageSmoothingEnabled) {
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }
    else {
        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.msImageSmoothingEnabled = true;
    }
}