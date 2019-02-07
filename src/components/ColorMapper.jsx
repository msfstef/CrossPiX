import React, { Component } from 'react';
import {toggleAliasing} from './utilities';
import Papa from 'papaparse';
import {quantize_img} from './kmeans.js'
import Slider from './Slider';
import Palette from './Palette';
import './ColorMapper.css';


class ColorMapper extends Component {
    state = {
        colors: 10,
        rgb_dmc: [],
        rgb_dmc_pure: [],
        defaultColors: 10,
        palette: {}
    }

    onImgLoad () {
        var img = new Image();
        var img_qt = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('ColorMapperCanvas');
        var ctx = canvas.getContext('2d');
        
        img.onload = () => {
            let src_qt = quantize_img(img, this.state.colors)
            img_qt.src = src_qt;
        }

        img_qt.onload = () => {
            canvas.width = this.props.initWidth;
            canvas.height = canvas.width*this.props.proportion;
            
            /*
            let reducer = new RgbQuant({
                colors: this.state.colors,
                palette: this.state.rgb_dmc_pure,
                method: 1
            });
            
            reducer.sample(img_qt);

            let img_red = new Uint8ClampedArray(reducer.reduce(img_qt))
            
            let imgdt = new ImageData(img_red, img.width, img.height)
            */



            ctx.drawImage(img_qt, 0, 0);
               
            let imgdt = ctx.getImageData(0, 0, img_qt.width, img_qt.height)
            let data = imgdt.data;

            var palette = {}
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i + 0];
                let g = data[i + 1];
                let b = data[i + 2];
                let dist = 1000;
                let idx = 0;
                for (let j = 0; j < this.state.rgb_dmc.length; j += 1) {
                    let rd = this.state.rgb_dmc[j][2];
                    let gd = this.state.rgb_dmc[j][3];
                    let bd = this.state.rgb_dmc[j][4];

                    let new_dist = (r-rd)*(r-rd) + (g-gd)*(g-gd) + (b-bd)*(b-bd);

                    if (new_dist < dist) {
                        dist = new_dist;
                        idx = j;
                    }
                    if (dist < 5) {
                        break;
                    }
                }

                r = this.state.rgb_dmc[idx][2];
                g = this.state.rgb_dmc[idx][3];
                b = this.state.rgb_dmc[idx][4];

                if (!(this.state.rgb_dmc[idx][0] in palette)) {
                    palette[this.state.rgb_dmc[idx][0]] = 
                                    [this.state.rgb_dmc[idx][1],
                                    this.state.rgb_dmc[idx][5],
                                    1];
                } else {
                    palette[this.state.rgb_dmc[idx][0]][2] ++;
                } 
            }
            this.setState({palette: palette});

            ctx.putImageData(imgdt, 0, 0)
            toggleAliasing(ctx, false);
            ctx.drawImage(canvas, 0, 0, img_qt.width, img_qt.height, 
                                0, 0, canvas.width, canvas.height);

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
                <div className="PicPalette">
                    <canvas id="ColorMapperCanvas"></canvas>
                    <Palette palette={this.state.palette} />
                </div>
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
