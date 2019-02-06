import React, { Component } from 'react';

class PreEditor extends Component {
    onImgLoad () {
        var scale = 2;

        var img = new Image();
        img.src = this.props.fileUrl;

        var canvas = document.getElementById('PreEditorCanvas');

        var ctx = canvas.getContext('2d');
        
        

        img.onload = () => {
            canvas.height = img.height / scale ;
            canvas.width = img.width / scale;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var w = canvas.width;
            var h = canvas.height;
            ctx.drawImage(img, 0, 0, w, h);
            img.style.display = 'none';
            this.props.outputHandler({"preEditUrl" : canvas.toDataURL(),
                                    "width" : canvas.width,
                                    "height" : canvas.height});
        }


    }

    componentDidUpdate(prevProps) {
        if(this.props.fileUrl !== prevProps.fileUrl)
        {   
            this.onImgLoad()
        }
    }

    render() {
        return (
            <div>
                <canvas id="PreEditorCanvas"></canvas>    
            </div>
        );
    }
}

export default PreEditor;