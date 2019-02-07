import React, { Component } from 'react';
import Slider from './Slider';
import {toggleAliasing} from './utilities';


class ImageContainer extends Component {
    state = {
        defaultHorStitches: 75,
        horStitches: 75
    }

    handleSlider = () => {
        this.setState({ horStitches : document.getElementById("horStitchesSlider").value});
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

            var w = this.state.horStitches;
            var h = (img.height/img.width)*this.state.horStitches;
            
            canvas.width = w;
            canvas.height = h;
            toggleAliasing(ctx, true);
            ctx.drawImage(img, 0, 0, w, h);
            this.props.outputHandler({"pixelUrl" : canvas.toDataURL()});
            
            canvas.width = temp_w;
            canvas.height = temp_h;
            toggleAliasing(ctx, true);
            ctx.drawImage(img, 0, 0, w, h);

            toggleAliasing(ctx, false);
            ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        }        
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {
            document.getElementById("horStitchesSlider").value = this.state.defaultHorStitches;
            this.setState({ horStitches: this.state.defaultHorStitches});
            this.onImgLoad();
        }
    }
    
    render() {
        return (
            <div>
                <canvas id="PixelatorCanvas"></canvas>
                <Slider name = "horStitchesSlider"
                            min = "10"
                            max = "150"
                            handler = {this.handleSlider}
                            defaultValue = {this.state.defaultHorStitches} />
            </div>
        );
    }
}

export default ImageContainer
