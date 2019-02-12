import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class ImgUploader extends Component {
    render() {
        return (
            <div id="ImgUploader" 
                className={this.props.fileUrl?"hide":""}>
            <Dropzone onDrop={this.props.handleDropFile}>
            {({getRootProps, getInputProps, isDragActive}) => {
                return (
                    <div
                    {...getRootProps({
                        className: ("dropBox " + (isDragActive?"active":""))
                    })}>
                        <input {...getInputProps({
                            type: "file",
                            id:"img_upload",
                            accept:"image/*",
                            onChange: ()=>{this.props.handleSelectFile()}
                        })} />
                        {
                            isDragActive ?
                            <p>Drop image here...</p> :
                            <p>Drop your image here <br/> or click to select file.</p>
                        }
                    </div>
                )
                }}
            </Dropzone>
            </div>
        );
    }
}

export default ImgUploader;