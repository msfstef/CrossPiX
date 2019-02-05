import React, { Component } from 'react';
import Slider from './Slider';


class ImageContainer extends Component {
    state = {
        defaultScale: 5,
        scale: 5
    }

    handleSlider = () => {
        this.setState({ scale : document.getElementById("scaleSlider").value});
        this.onImgLoad();
    }

    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('PixelatorCanvas');
        img.onload = () => {
            pixelate(canvas, img, this.state.scale)
            this.props.outputHandler("pixelUrl", canvas.toDataURL());
        }        
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {
            document.getElementById("scaleSlider").value = this.state.defaultScale;
            this.onImgLoad();
        }
    }

    
    
    render() {
        return (
            <div>
                <canvas id="PixelatorCanvas"></canvas>
                <Slider name = "scaleSlider" 
                            handler = {this.handleSlider}
                            defaultScale = {this.state.defaultScale} />             
            </div>
        );
    }
}

export default ImageContainer


var pixelate = (canvas, img, scale) => {
    canvas.height = img.height / 2 ;
    canvas.width = img.width / 2;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var w = canvas.width / scale;
    var h = canvas.height / scale;
    toggleAliasing(ctx, false);
    ctx.drawImage(img, 0, 0, w, h);
    
    toggleAliasing(ctx, true);
    img.style.display = 'none';
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

var toggleAliasing = (ctx, toggle) => {
    if (toggle) {
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