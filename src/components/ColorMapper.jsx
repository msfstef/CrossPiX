import React, { Component } from 'react';
import Papa from 'papaparse';
import RgbQuant from 'rgbquant';
import Slider from './Slider';

class ColorMapper extends Component {
    state = {
        colors: 10,
        rgb_dmc: [],
        rgb_dmc_pure: [],
        defaultColors: 40
    }

    onImgLoad () {
        var img = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('ColorMapperCanvas');
        var ctx = canvas.getContext('2d');

        img.onload = () => {
            canvas.width = this.props.initWidth;
            canvas.height = this.props.initHeight;

            let reducer = new RgbQuant({
                colors: this.state.colors,
                palette: this.state.rgb_dmc_pure,
                reIndex: false,
                method: 1
            });
            
            reducer.sample(img);
            let img_red = new Uint8ClampedArray(reducer.reduce(img))

            ctx.drawImage(img, 0, 0);

            let imgdt = new ImageData(new Uint8ClampedArray(img_red), img.height, img.width)

            /*
            for (let i = 0; i < imgdt.data.length; i += 4) {
                let r = imgdt.data[i + 0];
                let g = imgdt.data[i + 1];
                let b = imgdt.data[i + 2];
                let dist = 1000;
                let idx = 0;
                for (let j = 0; j < this.state.rgb_dmc.length; j += 1) {
                    let rd = this.state.rgb_dmc[j][2];
                    let gd = this.state.rgb_dmc[j][3];
                    let bd = this.state.rgb_dmc[j][4];

                    let new_dist = Math.sqrt((r-rd)**2 +
                                            (g-gd)**2 +
                                            (b-bd)**2)
                    if (new_dist < dist) {
                        dist = new_dist
                        idx = j;
                    }
                }
                imgdt.data[i + 0] = this.state.rgb_dmc[idx][2];
                imgdt.data[i + 1] = this.state.rgb_dmc[idx][3];
                imgdt.data[i + 2] = this.state.rgb_dmc[idx][4];
            }
            */



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
                this.setState({ rgb_dmc: results.data.slice(1) })
            }
        });

        let rgb_dmc_pure = this.state.rgb_dmc.map( (subarray) => {
                return subarray.slice(2,5);
        })
        this.setState({ rgb_dmc_pure: rgb_dmc_pure });
    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {   
            document.getElementById("colorSlider").value = this.state.defaultColors;
            this.setState({ colors: this.state.defaultColors});
            this.onImgLoad();
        }
    }

    handleSlider = () => {
        this.setState({ colors : document.getElementById("colorSlider").value});
        this.onImgLoad();
    }

    render() {
        return (
            <div>
                <canvas id="ColorMapperCanvas"></canvas>
                <Slider name = "colorSlider" 
                            min = "5"
                            max = "50"
                            handler = {this.handleSlider}
                            defaultValue = {this.state.defaultColors} />
                
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