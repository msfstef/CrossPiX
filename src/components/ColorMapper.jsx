import React, { Component } from 'react';
import {toggleAliasing} from './utilities';
import Papa from 'papaparse';
import RgbQuant from 'rgbquant';
import Slider from './Slider';
import Palette from './Palette';


class ColorMapper extends Component {
    state = {
        colors: 10,
        rgb_dmc: [],
        rgb_dmc_pure: [],
        defaultColors: 50,
        palette: {}
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

            let imgdt = new ImageData(img_red, img.width, img.height)

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
                        if (!(this.state.rgb_dmc[j][0] in palette)) {
                            palette[this.state.rgb_dmc[j][0]] = 
                                            [this.state.rgb_dmc[j][1],
                                            this.state.rgb_dmc[j][5],
                                            1];
                        } else {
                            palette[this.state.rgb_dmc[j][0]][2] ++;
                        }
                    } 
                }
            }
            this.setState({palette: palette});

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
                <div>
                    <canvas id="ColorMapperCanvas"></canvas>
                    <Palette palette={this.state.palette} />
                </div>
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
