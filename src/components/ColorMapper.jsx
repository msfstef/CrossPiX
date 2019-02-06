import React, { Component } from 'react';
import Papa from 'papaparse';
import RgbQuant from 'rgbquant'

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

            
            this.reducer.sample(img);
            let img_red = this.reducer.reduce(img)


            toggleAliasing(ctx, false);
            ctx.drawImage(img, 0, 0);
            let imgdt = ctx.getImageData(0, 0, img.width, img.height)

            for (let i = 0; i < imgdt.data.length; i += 1) {
                imgdt.data[i] = img_red[i];
            }
            
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



            ctx.putImageData(imgdt, 0, 0)
            toggleAliasing(ctx, false);
            ctx.drawImage(canvas, 0, 0, img.width, img.height, 
                                0, 0, this.props.initWidth, this.props.initHeight);

        }
    }

    
    componentDidMount () {
        this.reducer_opts = {
            colors: 10,             // desired palette size
            method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
            boxSize: [64,64],        // subregion dims (if method = 2)
            boxPxls: 2,              // min-population threshold (if method = 2)
            initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
            minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
            dithKern: null,          // dithering kernel name, see available kernels in docs below
            dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
            dithSerp: false,         // enable serpentine pattern dithering
            palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
            reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
            useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
            cacheFreq: 10,           // min color occurance count needed to qualify for caching
            colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
        };

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
            this.reducer = new RgbQuant(this.opts);
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