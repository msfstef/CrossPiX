import React, { Component } from 'react';
import PreEditor from './PreEditor';
import Pixelator from './Pixelator';
import ColorMapper from './ColorMapper';


class AppContainer extends Component {

    state = {
        width: 0,
        height: 0,
        fileUrl : '',
        preEditUrl : '',
        pixelUrl : ''
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
            <div>
                <input type="file" id="img_upload" accept="image/*" 
                    onChange= {()=>{this.handleFile()}} />
                <PreEditor fileUrl = {this.state.fileUrl}
                            outputHandler = {this.outputHandler}  />
                <Pixelator fileUrl = {this.state.preEditUrl} 
                            outputHandler = {this.outputHandler} />
                <ColorMapper fileUrl = {this.state.pixelUrl}
                            outputHandler = {this.outputHandler}
                            initWidth = {this.state.width}
                            initHeight = {this.state.height}  />
                
            </div>
        );
    }
}

export default AppContainer;