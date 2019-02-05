import React, { Component } from 'react';



class ImageContainer extends Component {
    componentDidMount () {
        var img = new Image();
        img.src = '/assets/hippo.png';
        

        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        
        img.onload = function() {
            var w = canvas.width / 5;
            var h = canvas.height / 5;
            ctx.drawImage(img, 0, 0, w, h);
            toggleAliasing(ctx);
            img.style.display = 'none';
            ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        };
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