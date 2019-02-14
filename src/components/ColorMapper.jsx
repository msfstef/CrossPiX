import React, { Component } from 'react';
import {toggleAliasing, shuffle} from '../utilities/utilities';
import Papa from 'papaparse';
import {quantize_img} from '../utilities/kmeans.js';
import {rgb_dmc_data} from '../utilities/rgb_to_dmc.js';
import {stitch_symbols} from '../utilities/symbols.js';
import Slider from './Slider';
import Palette from './Palette';


class ColorMapper extends Component {
    state = {
        colors: 10,
        rgb_dmc: [],
        rgb_dmc_pure: [],
        defaultColors: 10,
        palette: {},
        symbols: []
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
            canvas.height = this.props.initHeight;
            buffer.width = img_qt.width;
            buffer.height = img_qt.height

            ctxb.drawImage(img_qt, 0, 0);
               
            let imgdt = ctxb.getImageData(0, 0, img_qt.width, img_qt.height);
            let new_data = new Array(imgdt.data.length);

            var palette = {};
            let ctr = 0;
            for (let i = 0; i < imgdt.data.length; i += 4) {
                let r = imgdt.data[i + 0];
                let g = imgdt.data[i + 1];
                let b = imgdt.data[i + 2];

                
                let dist = 99999999;
                let new_dist = dist;
                let idx = 0;
                for (let j = 0; j < this.state.rgb_dmc.length; j += 1) {
                    let rd = this.state.rgb_dmc[j][2];
                    let gd = this.state.rgb_dmc[j][3];
                    let bd = this.state.rgb_dmc[j][4];

                    new_dist = (r-rd)*(r-rd) + (g-gd)*(g-gd) + (b-bd)*(b-bd);

                    if (new_dist < dist) {
                        dist = new_dist;
                        idx = j
                        if (new_dist < 2) break;
                    }

                }

                let rnew = this.state.rgb_dmc[idx][2];
                let gnew = this.state.rgb_dmc[idx][3];
                let bnew = this.state.rgb_dmc[idx][4];

                new_data[i+0] = rnew;
                new_data[i+1] = gnew;
                new_data[i+2] = bnew;
                new_data[i+3] = 255;

                let color = "" + rnew + gnew + bnew;
                
                if (!(color in palette)) {
                    palette[color] = {
                                    code: this.state.rgb_dmc[idx][0],
                                    name: this.state.rgb_dmc[idx][1],
                                    hex: this.state.rgb_dmc[idx][5],
                                    symb: this.state.symbols[ctr],
                                    count: 1};
                    ctr++;
                } else {
                    palette[color]["count"] ++;
                } 
            }

            this.setState({palette: palette});
            imgdt.data.set(new_data);

            ctxb.putImageData(imgdt, 0, 0)
            this.props.outputHandler({
                "colorUrl" : buffer.toDataURL(),
                "palette" : palette});
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

        this.setState({symbols: stitch_symbols});

        
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
            <div className="picEditor ColorMapper">
                <div className="colorMapperEditor">
                    <div className="canvasContainer">
                        <canvas className="picCanvas" id="ColorMapperCanvas"></canvas>
                    </div>
                    <div className="sliderContainer">
                        <p className="sliderBoxTitle">Options</p>
                        <Slider name = "colorSlider" 
                                title = "# of Colors"
                                    min = "2"
                                    max = "50"
                                    handler = {this.handleSlider}
                                    defaultValue = {this.state.defaultColors} />
                    </div>
                </div>

                <div className="colorMapperPalette">
                    <p className="paletteBoxTitle">Palette</p>
                    <input className="button" type="submit"
                            value="Change Symbols ↻"
                            onClick={() => {
                                shuffle(this.state.symbols);
                                this.onImgLoad();
                                }} />
                    <Palette palette={this.state.palette} />
                </div>
                
                
                
            </div>
        );
    }
}

export default ColorMapper;
