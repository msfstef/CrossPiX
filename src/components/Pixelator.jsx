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
            let temp_w = img.width;
            let temp_h = img.height;
            canvas.width = img.width;
            canvas.height = img.height;
            
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var w = canvas.width / this.state.scale;
            var h = canvas.height / this.state.scale;
            
            canvas.width = w;
            canvas.height = h;
            toggleAliasing(ctx, true);
            ctx.drawImage(img, 0, 0, w, h);
            this.props.outputHandler({"pixelUrl" : canvas.toDataURL()});
            
            canvas.width = temp_w;
            canvas.height = temp_h;
            toggleAliasing(ctx, true);
            ctx.drawImage(img, 0, 0, w, h);

            
            img.style.display = 'none';
            toggleAliasing(ctx, false);
            ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        }        
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {
            document.getElementById("scaleSlider").value = this.state.defaultScale;
            this.setState({ scale: this.state.defaultScale});
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

var toggleAliasing = (ctx, toggle) => {
    if (!toggle) {
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