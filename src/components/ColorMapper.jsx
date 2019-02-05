import React, { Component } from 'react';
import Papa from 'papaparse';

class ColorMapper extends Component {

    rgb_dmc = [];

    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('ColorMapperCanvas');
        var ctx = canvas.getContext('2d');

        img.onload = () => {
            canvas.width = this.props.initWidth;
            canvas.height = this.props.initHeight;

            toggleAliasing(ctx, false);
            ctx.drawImage(img, 0, 0);
            let imgdt = ctx.getImageData(0, 0, img.width, img.height)
            
            for (let i = 0; i < imgdt.data.length; i += 4) {
                let r = imgdt.data[i + 0];
                let g = imgdt.data[i + 1];
                let b = imgdt.data[i + 2];
                let dist = 1000;
                let idx = 0;
                for (let j = 0; j < this.rgb_dmc.length; j += 1) {
                    let rd = this.rgb_dmc[j][2];
                    let gd = this.rgb_dmc[j][3];
                    let bd = this.rgb_dmc[j][4];

                    let new_dist = Math.sqrt((r-rd)**2 +
                                            (g-gd)**2 +
                                            (b-bd)**2)
                    if (new_dist < dist) {
                        dist = new_dist
                        idx = j;
                    }
                }
                imgdt.data[i + 0] = this.rgb_dmc[idx][2];
                imgdt.data[i + 1] = this.rgb_dmc[idx][3];
                imgdt.data[i + 2] = this.rgb_dmc[idx][4];
            }
            console.log(imgdt)
            ctx.putImageData(imgdt, 0, 0)
            toggleAliasing(ctx, false);
            ctx.drawImage(canvas, 0, 0, img.width, img.height, 
                                0, 0, this.props.initWidth, this.props.initHeight);

        }
    }

    
    componentDidMount () {
        Papa.parse("/assets/rgb_to_dmc.csv", {
            download: true,

            complete: (results) => {
                this.rgb_dmc = results.data.slice(1);
            }
        });
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {
            this.onImgLoad();
        }
    }

    render() {
        return (
            <div>
                <canvas id="ColorMapperCanvas"></canvas>
                
            </div>
        );
    }
}

export default ColorMapper;


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