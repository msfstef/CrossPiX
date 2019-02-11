import React, { Component } from 'react';
import Slider from './Slider';
import {toggleAliasing, canvas_arrow} from '../utilities/utilities';


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
            let margin = 15;
            canvas.width = img.width + margin;
            canvas.height = img.height + margin;
            buffer.width = img.width;
            buffer.height = img.height;

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);

            var w = this.state.horStitches;
            var h = Math.ceil((img.height/img.width)*this.state.horStitches);
            
            buffer.width = w;
            buffer.height = h;
            toggleAliasing(ctxb, true);
            ctxb.drawImage(img, 0, 0, w, h);
            this.props.outputHandler({"pixelUrl" : buffer.toDataURL()});

            toggleAliasing(ctx, false);
            ctx.drawImage(buffer, 0, 0, w, h, 
                        margin, 0, img.width, img.height);

            ctx.textAlign="center"; 
            ctx.textBaseline = "bottom";
            ctx.font = "bold 10pt Courier";
            canvas_arrow(ctx, margin/3, 
                        margin/2, img.height + margin/2, 
                        margin/2, 0);
            let textSize = ctx.measureText(h).width;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0,
                        img.height/2-textSize/2,
                        margin,
                        textSize)
            ctx.fillStyle = '#000000';
            ctx.rotate(Math.PI/2);
            ctx.fillText(h, img.height/2, 0);
            ctx.rotate(-Math.PI/2);
            canvas_arrow(ctx, margin/3, 
                        margin/2, img.height + margin/2, 
                        img.width + margin, img.height + margin/2);
            
            textSize = ctx.measureText(w).width;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(margin+img.width/2-textSize/2,
                        img.height,
                        textSize,
                        margin)
            ctx.fillStyle = '#000000';
            ctx.fillText(w, margin + img.width/2, img.height + margin);
            ctx.fillRect(0, img.height, margin, margin);
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
