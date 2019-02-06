import React, { Component } from 'react';
import Papa from 'papaparse';
import RgbQuant from 'rgbquant';
import Slider from './Slider';
import {toggleAliasing} from './utilities';

class ColorMapper extends Component {
    state = {
        colors: 10,
        rgb_dmc: [],
        rgb_dmc_pure: [],

        defaultColors: 50
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

            let imgdt = new ImageData(img_red, img.height, img.width)

            var palette = {}
            for (let i = 0; i < img_red.length; i += 4) {
                let r = img_red[i + 0];
                let g = img_red[i + 1];
                let b = img_red[i + 2];
                for (let j = 0; j < this.state.rgb_dmc.length; j += 1) {
                    let rd = this.state.rgb_dmc[j][2];
                    let gd = this.state.rgb_dmc[j][3];
                    let bd = this.state.rgb_dmc[j][4];

                    if (r-rd === 0 && 
                        g-gd === 0 &&
                        b-bd === 0) {                        
                        if ( !( i/4 in palette) ) {
                            palette[i/4] = [this.state.rgb_dmc[j][0],
                                            this.state.rgb_dmc[j][1],
                                            this.state.rgb_dmc[j][5],
                                            1];
                        } else {
                            palette[i/4][3] ++;
                        }
                    } 
                }
            }

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
                let rgb_dmc_pure = this.state.rgb_dmc.map( (subarray) => {
                    return subarray.slice(2,5);
                })
                this.setState({ rgb_dmc_pure: rgb_dmc_pure });
            }
        });

        
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
                            max = "100"
                            handler = {this.handleSlider}
                            defaultValue = {this.state.defaultColors} />
                
            </div>
        );
    }
}

export default ColorMapper;
