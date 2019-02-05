import React, { Component } from 'react';
import ImageContainer from './ImageContainer';
import ScaleSlider from './ScaleSlider';

class AppContainer extends Component {
    defaultScale = 5;

    state = {
        file_url : '',
        scale: 5
    }

    handleFile = (files) => {
        var file = document.getElementById('img_upload').files[0];
        this.setState({ file_url : window.URL.createObjectURL(file) });
        this.setState({ scale : this.defaultScale });
    }

    handleSlider = () => {
        this.setState({ scale : document.getElementById("scaleSlider").value})
    }

    render() {
        return (
            <div>
                <input type="file" id="img_upload" accept="image/*" 
                    onChange= {()=>{this.handleFile()}} />
                <ImageContainer fileUrl = {this.state.file_url} 
                                scale = {this.state.scale}/>
                <ScaleSlider handler = {this.handleSlider}
                            defaultScale = {this.defaultScale} />
            </div>
        );
    }
}

export default AppContainer;