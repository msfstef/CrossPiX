import React, { Component } from 'react';
import {toggleAliasing} from '../utilities/utilities';
import {stitch_symbols} from '../utilities/symbols.js';

class PatternMaker extends Component {
    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;

        
        img.onload = () => {
            let scale = 20

            var canvas = document.getElementById('PatternMakerCanvas');
            var buffer = document.createElement('canvas');
            

            
            buffer.width = img.width*scale;
            buffer.height = img.height*scale;
            if (buffer.width < this.props.initWidth) {
                canvas.width = this.props.initWidth;
                canvas.height = this.props.proportion*canvas.width;
            } else {
                canvas.width = buffer.width;
                canvas.height = buffer.height;
            }
            

            var ctx = canvas.getContext('2d');
            var ctxb = buffer.getContext('2d');
            ctxb.clearRect(0, 0, buffer.width, buffer.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            toggleAliasing(ctxb, false);
            ctxb.drawImage(img, 0, 0, img.width, img.height, 
                                0, 0, buffer.width, buffer.height);
            let imgdt = ctxb.getImageData(0, 0, buffer.width, buffer.height).data           

            let palette = [];
            for (let i = 0; i < buffer.width; i += scale) {
                for (let j = 0; j < buffer.height; j += scale) {
                    let r = imgdt[4*(i + buffer.width*j) + 0];
                    let g = imgdt[4*(i + buffer.width*j) + 1];
                    let b = imgdt[4*(i + buffer.width*j) + 2];
                    let color = "" + r + g + b;
                    let idx = palette.indexOf(color);
                    let char = "0";
                    if (idx > -1) {
                        char = stitch_symbols[idx];
                    } else {
                        palette.push(color)
                        char = stitch_symbols[palette.length-1]
                    }
                    
                    ctxb.fillStyle = "#000000"
                    ctxb.strokeRect(i,j, scale, scale)
                    ctxb.textAlign="center"; 
                    ctxb.textBaseline = "middle";
                    ctxb.font = "bold 10pt Courier";
                    if ((r+g+b)/3 < 100) {
                        ctxb.fillStyle = "#ffffff"
                    } else {
                        ctxb.fillStyle = "#000000"
                    }
                    
                    ctxb.fillText(char,
                                    i + scale/2,
                                    j + scale/2)
                }
            }

            toggleAliasing(ctx, false);
            ctx.drawImage(buffer, 0, 0, buffer.width, buffer.height,
                                    0, 0, canvas.width, canvas.height);
        }        
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {
            this.onImgLoad();
        }
    }
    
    render() {
        return (
            <div className="patternEditor">
                <canvas className="patternCanvas" id="PatternMakerCanvas"></canvas>
            </div>
        );
    }
}


export default PatternMaker;