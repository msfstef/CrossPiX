import React, { Component } from 'react';
import PreEditor from './PreEditor';
import Pixelator from './Pixelator';
import ColorMapper from './ColorMapper';
import PatternMaker from './PatternMaker';
import GenPdf from './GenPdf';
import './AppContainer.css';


class AppContainer extends Component {

    state = {
        width: 0,
        height: 0,
        palette: {},
        stitchSize: 1,
        fileUrl : '',
        preEditUrl : '',
        pixelUrl : '',
        colorUrl: '',
        patternUrl: ''
    }

    handleFile = (files) => {
        var file = document.getElementById('img_upload').files[0];
        if (file) {
            this.setState({ fileUrl : window.URL.createObjectURL(file) });
        }
    }

    outputHandler = (url_object) => {
        this.setState(url_object)
    }

    render() {
        return (
            <div id="AppContainer">
                <input type="file" id="img_upload" accept="image/*" 
                    onChange= {()=>{this.handleFile()}} />
                <PreEditor fileUrl = {this.state.fileUrl}
                            outputHandler = {this.outputHandler}  />
                <Pixelator fileUrl = {this.state.preEditUrl} 
                            outputHandler = {this.outputHandler}  />
                <ColorMapper fileUrl = {this.state.pixelUrl}
                            outputHandler = {this.outputHandler}
                            initWidth = {this.state.width}
                            initHeight = {this.state.height}
                            palette = {this.state.palette}  />
                <PatternMaker fileUrl = {this.state.colorUrl} 
                            palette = {this.state.palette}
                            outputHandler = {this.outputHandler} />
                <GenPdf fileUrl = {this.state.patternUrl}
                        stitchSize = {this.state.stitchSize} />
                
            </div>
        );
    }
}

export default AppContainer;