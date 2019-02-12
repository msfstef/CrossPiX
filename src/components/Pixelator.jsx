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
        var buffer2 = document.createElement('canvas');

        img.onload = () => {
            let margin = 15;
            canvas.width = img.width;
            canvas.height = img.height;
            buffer2.width = img.width + margin;
            buffer2.height = img.height + margin;
            buffer.width = img.width;
            buffer.height = img.height;

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            var ctxb2 = buffer2.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);

            var w = this.state.horStitches;
            var h = Math.ceil((img.height/img.width)*this.state.horStitches);
            
            buffer.width = w;
            buffer.height = h;
            toggleAliasing(ctxb, true);
            ctxb.drawImage(img, 0, 0, w, h);
            this.props.outputHandler({"pixelUrl" : buffer.toDataURL()});

            toggleAliasing(ctxb2, false);
            ctxb2.drawImage(buffer, 0, 0, w, h, 
                        margin, 0, img.width, img.height);
            
            ctxb2.lineWidth = 1.5;

            ctxb2.textAlign="center"; 
            ctxb2.textBaseline = "bottom";
            ctxb2.font = "bold 10pt Arial";
            canvas_arrow(ctxb2, margin/3, 
                        margin/2, img.height + margin/2, 
                        margin/2, 0);
            let textSize = ctxb2.measureText(h).width + 10;
            ctxb2.fillStyle = '#ffffff';
            ctxb2.fillRect(0,
                        img.height/2-textSize/2,
                        margin,
                        textSize)
            ctxb2.fillStyle = '#000000';
            ctxb2.rotate(Math.PI/2);
            ctxb2.fillText(h, img.height/2, 0);
            ctxb2.rotate(-Math.PI/2);
            canvas_arrow(ctxb2, margin/3, 
                        margin/2, img.height + margin/2, 
                        img.width + margin, img.height + margin/2);
            
            textSize = ctxb2.measureText(w).width + 10;
            ctxb2.fillStyle = '#ffffff';
            ctxb2.fillRect(margin+img.width/2-textSize/2,
                        img.height,
                        textSize,
                        margin)
            ctxb2.fillStyle = '#000000';
            ctxb2.fillText(w, margin + img.width/2, img.height + margin);
            ctxb2.fillRect(0, img.height, margin, margin);
            toggleAliasing(ctx, false);
            ctx.drawImage(buffer2, 0, 0, img.width, img.height);
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
                <div className="canvasContainer">
                    <canvas className="picCanvas" id="PixelatorCanvas"></canvas>
                </div>

                <div className="sliderContainer">
                    <Slider name = "horStitchesSlider"
                                min = "10"
                                max = "150"
                                handler = {this.handleSlider}
                                defaultValue = {this.state.defaultHorStitches} />
                </div>
            </div>
        );
    }
}

export default ImageContainer
