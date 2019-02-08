import React, { Component } from 'react';
import Slider from './Slider';
import {toggleAliasing} from '../utilities/utilities';


class ImageContainer extends Component {
    state = {
        defaultHorStitches: 50,
        horStitches: 50
    }

    handleSlider = () => {
        this.setState({ horStitches : document.getElementById("horStitchesSlider").value});
        this.onImgLoad();
    }

    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('PixelatorCanvas');
        var buffer = document.createElement('canvas');

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            buffer.width = img.width;
            buffer.height = img.height;

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);

            var w = this.state.horStitches;
            var h = (img.height/img.width)*this.state.horStitches;
            
            buffer.width = w;
            buffer.height = h;
            toggleAliasing(ctxb, true);
            ctxb.drawImage(img, 0, 0, w, h);
            this.props.outputHandler({"pixelUrl" : buffer.toDataURL()});

            toggleAliasing(ctx, false);
            ctx.drawImage(buffer, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
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
            <div className="picEditor">
                <canvas className="picCanvas" id="PixelatorCanvas"></canvas>
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
