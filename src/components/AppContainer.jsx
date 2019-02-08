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
        proportion: 0,
        palette: {},
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
                            proportion = {this.state.proportion}
                            palette = {this.state.palette}  />
                <PatternMaker fileUrl = {this.state.colorUrl} 
                            palette = {this.state.palette}
                            outputHandler = {this.outputHandler} />
                <GenPdf fileUrl = {this.state.patternUrl}
                        palette = {this.state.palette} />
                
            </div>
        );
    }
}

export default AppContainer;