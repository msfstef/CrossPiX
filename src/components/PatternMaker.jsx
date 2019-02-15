import React, { Component } from 'react';
import {toggleAliasing} from '../utilities/utilities';
import GenPdf from './GenPdf';

class PatternMaker extends Component {
    state = {
        updateTimer: '',
        timeout: 300,
        scale : 40
    }
    
    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;
        let scale = this.state.scale;

        img.onload = () => {
            var canvas = document.getElementById('PatternMakerCanvas');
            var buffer = document.createElement('canvas');
            var canvasContainer = document.getElementsByClassName("canvasContainer Pattern")[0];
            
            buffer.width = img.width*scale;
            buffer.height = img.height*scale;
            let ratio = img.width/img.height;
            
            if (ratio>1) {
                canvas.width = canvasContainer.offsetWidth;
                canvas.height = canvas.width/ratio;
            } else {
                canvas.height = canvasContainer.offsetHeight;
                canvas.width = canvas.height*ratio;
            }
            

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            toggleAliasing(ctxb, false);
            ctxb.drawImage(img, 0, 0, img.width, img.height, 
                                0, 0, buffer.width, buffer.height);
            let imgdt = ctxb.getImageData(0, 0, buffer.width, buffer.height).data           

            let palette = this.props.palette;           

            for (let i = 0; i < buffer.width; i += scale) {
                for (let j = 0; j < buffer.height; j += scale) {
                    let r = imgdt[4*(i + buffer.width*j) + 0];
                    let g = imgdt[4*(i + buffer.width*j) + 1];
                    let b = imgdt[4*(i + buffer.width*j) + 2];
                    let color = "" + r + g + b;
                    let char = ""

                    if (color in palette) {
                        char = palette[color]["symb"];
                    }

                    if (this.props.nocolor) {
                        ctxb.fillStyle = "#ffffff"
                        ctxb.fillRect(i, j, scale, scale)
                    }

                    ctxb.fillStyle = "#000000"
                    ctxb.strokeStyle = "#000000"
                    if (((r+g+b)/3 < 10) && !this.props.nocolor) {
                        ctxb.strokeStyle = "#202020"
                    }
                    ctxb.strokeRect(i,j, scale, scale)

                    if ((i/scale)%10 === 0 &&
                        (j/scale)%10 === 0) {
                            ctxb.lineWidth = 8
                            ctxb.strokeRect(i,j,10*scale,10*scale)
                        }
                    ctxb.lineWidth = 1

                    ctxb.textAlign="center"; 
                    ctxb.textBaseline = "middle";
                    ctxb.font = "bold 25pt Courier";
                    if (((r+g+b)/3 < 120) && !this.props.nocolor) {
                        ctxb.fillStyle = "#ffffff"
                    } else {
                        ctxb.fillStyle = "#000000"
                    }
                    
                    ctxb.fillText(char,
                                    i + scale/2,
                                    j + scale/2)
                }
            }
            
            this.setState({
                "patternUrl": buffer.toDataURL(),
                "stitchSize": scale
            })

            this.props.outputHandler({
                "patternUrl": this.state.patternUrl,
                "stitchSize": scale
            })

            toggleAliasing(ctx, false);
            ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height,
                                    0, 0, canvas.width, canvas.height);
        }        
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl ||
            this.props.palette !== prevProps.palette ||
            this.props.nocolor !== prevProps.nocolor)
        {
            clearTimeout(this.state.updateTimer)
            this.setState({ updateTimer: setTimeout(() => {
                this.onImgLoad();
                }, this.state.timeout)})
        }
    }
    
    render() {
        return (
            <div className="picEditor Pattern">
                <div className ="canvasContainer Pattern">
                    <canvas className="picCanvas Pattern" id="PatternMakerCanvas"></canvas>
                </div>
                <GenPdf fileUrl = {this.state.patternUrl}
                        stitchSize = {this.state.scale} />
            </div>
        );
    }
}


export default PatternMaker;