import React, { Component } from 'react';
import PreEditor from './PreEditor';
import Pixelator from './Pixelator';


class AppContainer extends Component {

    state = {
        file_url : '',
        pixel_url : ''
    }

    handleFile = (files) => {
        var file = document.getElementById('img_upload').files[0];
        if (file) {
            this.setState({ file_url : window.URL.createObjectURL(file) });
        }
    }

    outputHandler = (url_name, url) => {
        this.setState({ url_name : url })
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <input type="file" id="img_upload" accept="image/*" 
                    onChange= {()=>{this.handleFile()}} />
                <PreEditor fileUrl = {this.state.file_url} />
                <Pixelator fileUrl = {this.state.file_url} 
                        outputHandler = {this.outputHandler} />
                
            </div>
        );
    }
}

export default AppContainer;