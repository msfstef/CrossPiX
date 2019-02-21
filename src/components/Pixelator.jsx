import React, { Component } from 'react';
import Slider from './Slider';
import {toggleAliasing, canvas_arrow} from '../utilities/utilities';


class ImageContainer extends Component {
    state = {
        updateTimer: '',
        timeout: 300,
        defaultHorStitches: 50,
        defaultVertStitches: 50,
        ratio: 1,
        horStitches: 50,
        vertStitches: 50,
        maxSlider: 150
    }

    handleSlider = () => {
        let hor = document.getElementById("horStitchesSlider").value
        let vert = document.getElementById("vertStitchesSlider").value
        let new_hor = 0;
        let new_vert = 0
        let ratio = this.state.defaultHorStitches/this.state.defaultVertStitches
        if (vert !== this.state.vertStitches) {
            new_vert = vert;
            new_hor = Math.ceil(new_vert*ratio);
            document.getElementById("horStitchesSlider").value = new_hor;
        } else if (hor !== this.state.horStitches) {
            new_hor = hor;
            new_vert = Math.ceil(new_hor/ratio);
            document.getElementById("vertStitchesSlider").value = new_vert;
        }
        this.setState({ 
            horStitches : new_hor,
            vertStitches : new_vert,
        });
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

            let ratio = img.height/img.width
            let default_h = Math.ceil(ratio*this.state.defaultHorStitches);
            if (default_h !== this.state.defaultVertStitches) {
                this.setState({
                    defaultVertStitches: default_h,
                    vertStitches: default_h,
                    ratio: ratio
                });
                document.getElementById("vertStitchesSlider").value = this.state.defaultVertStitches;   
            }

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            var ctxb2 = buffer2.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);
            ctxb2.fillRect(margin, 0,img.width, img.height);

            var w = this.state.horStitches;
            var h = this.state.vertStitches
            
            
            
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
            clearTimeout(this.state.updateTimer)
            this.setState({ updateTimer: setTimeout(() => {
                document.getElementById("horStitchesSlider").value = this.state.defaultHorStitches;
                document.getElementById("vertStitchesSlider").value = this.state.defaultVertStitches;
                this.setState({ 
                    horStitches: this.state.defaultHorStitches,
                    vertStitches: this.state.defaultVertStitches 
                });
                this.onImgLoad();
                }, this.state.timeout)})
        }
    }
    
    render() {
        return (
            <div className="picEditor">
                <div className="canvasContainer">
                    <canvas className="picCanvas" id="PixelatorCanvas"></canvas>
                </div>

                <div className="sliderContainer">
                    <p className="sliderBoxTitle">Options</p>
                    <input className="Pixelator button" type="submit"
                            value="More Stitches (warning: may crash)"
                            onClick={() => {
                                this.setState({
                                    maxSlider: this.state.maxSlider + 50
                                })
                                }} />
                    <Slider name = "vertStitchesSlider"
                            title = "# of Vert. Stitches"
                                min = "10"
                                max = {(this.state.ratio < 1
                                    ? Math.ceil(this.state.maxSlider*this.state.ratio)
                                    : this.state.maxSlider)}
                                handler = {this.handleSlider}
                                defaultValue = {this.state.defaultVertStitches} />
                    <Slider name = "horStitchesSlider"
                            title = "# of Hor. Stitches"
                                min = "10"
                                max = {(this.state.ratio < 1
                                    ? this.state.maxSlider
                                    : Math.ceil(this.state.maxSlider/this.state.ratio))}
                                handler = {this.handleSlider}
                                defaultValue = {this.state.defaultHorStitches} />
                </div>
            </div>
        );
    }
}

export default ImageContainer
