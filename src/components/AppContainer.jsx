import React, { Component } from 'react';
import ImageContainer from './ImageContainer';

class AppContainer extends Component {
    state = {
        file_url : ''
    }

    handleFile = (files) => {
        var file = document.getElementById('img_upload').files[0];
        this.setState({ file_url : window.URL.createObjectURL(file) });
    }

    render() {
        return (
            <div>
                <input type="file" id="img_upload" accept="image/*" 
                    onChange= {()=>{this.handleFile()}} />
                <ImageContainer fileUrl = {this.state.file_url} />
            </div>
        );
    }
}

export default AppContainer;