import React, { Component } from 'react';
import {toggleAliasing} from '../utilities/utilities';
import Papa from 'papaparse';
import {quantize_img} from '../utilities/kmeans.js';
import {rgb_dmc_data} from '../utilities/rgb_to_dmc.js';
import Slider from './Slider';
import Palette from './Palette';


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
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('ColorMapperCanvas');
        var buffer = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var ctxb = buffer.getContext('2d');
        
        img.onload = () => {
            let src_qt = quantize_img(img, this.state.colors)
            var img_qt = new Image();
            img_qt.src = src_qt;
        

        img_qt.onload = () => {
            canvas.width = this.props.initWidth;
            canvas.height = canvas.width*this.props.proportion;
            buffer.width = img_qt.width;
            buffer.height = img_qt.height

            ctxb.drawImage(img_qt, 0, 0);
               
            let imgdt = ctxb.getImageData(0, 0, img_qt.width, img_qt.height);
            let new_data = new Array(imgdt.data.length);


            var palette = {}
            for (let i = 0; i < imgdt.data.length; i += 4) {
                let r = imgdt.data[i + 0];
                let g = imgdt.data[i + 1];
                let b = imgdt.data[i + 2];
                
                let dist = 99999999;
                let idx = 0;
                for (let j = 0; j < this.state.rgb_dmc.length; j += 1) {
                    let rd = this.state.rgb_dmc[j][2];
                    let gd = this.state.rgb_dmc[j][3];
                    let bd = this.state.rgb_dmc[j][4];

                    let new_dist = (r-rd)*(r-rd) + (g-gd)*(g-gd) + (b-bd)*(b-bd);

                    if (new_dist < dist) {
                        dist = new_dist;
                        idx = j;
                        if (new_dist < 2) break;
                    }

                }

                new_data[i+0] = this.state.rgb_dmc[idx][2];
                new_data[i+1] = this.state.rgb_dmc[idx][3];
                new_data[i+2] = this.state.rgb_dmc[idx][4];
                new_data[i+3] = 255;
                
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

            imgdt.data.set(new_data);

            ctxb.putImageData(imgdt, 0, 0)
            this.props.outputHandler({"colorUrl" : buffer.toDataURL()});
            toggleAliasing(ctx, false);
            ctx.drawImage(buffer, 0, 0, img_qt.width, img_qt.height, 
                                0, 0, canvas.width, canvas.height);
        }
        }
    }

    
    componentDidMount () {
        Papa.parse(rgb_dmc_data, {
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
            <div className="picEditor">
                <canvas className="picCanvas" id="ColorMapperCanvas"></canvas>
                <Palette palette={this.state.palette} />
                <Slider name = "colorSlider" 
                            min = "2"
                            max = "50"
                            handler = {this.handleSlider}
                            defaultValue = {this.state.defaultColors} />
                
            </div>
        );
    }
}

export default ColorMapper;
