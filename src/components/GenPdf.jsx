import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class GenPdf extends Component {

    
    genPdf = () => {
        var pdf = new jsPDF('l','px','a4');
        var margins = {
            top: 20,
            bottom: 20,
            left: 25,
            right: 25
        }
        var width = pdf.internal.pageSize.getWidth() - margins.left - margins.right;    
        var height = pdf.internal.pageSize.getHeight() - margins.top - margins.bottom;
        var imageSize = 720;
        console.log(width)

        var paletteTable = document.getElementsByClassName("paletteTable")[0]
        var paletteImage = "";
        var pattern = new Image();
        pattern.src = this.props.fileUrl;
        pattern.onload = () => {
            var imagePieces = splitImage(pattern, imageSize)
            html2canvas(paletteTable).then(
                function(canvas) {
                    paletteImage = canvas.toDataURL("image/png");
    
                    var tableWidth = width/4;
                    var tableHeight = (canvas.height/canvas.width)*tableWidth;
                    if(tableHeight > height) {
                        tableHeight = height;
                    }
    
                    for (let i = 0; i < imagePieces.length; i++) {
                        pdf.addImage(
                            paletteImage,
                            'PNG',
                            margins.left, 
                            margins.top,
                            tableWidth,
                            tableHeight)
                        
                        pdf.addImage(
                            imagePieces[i],
                            'PNG',
                            2*margins.left + tableWidth,
                            margins.top)
    
                        if (i !== imagePieces.length - 1) {
                            pdf.addPage('a4', 'landscape')
                        }
                    }
                    pdf.save('stitch_pattern.pdf')
                }
            )
        }       
    }

    render() {
        return (
            <div>
                <input type="submit" value="Generate PDF"
                        onClick = {()=>{this.genPdf();}} />
            </div>
        );
    }
}

export default GenPdf;


var splitImage = (img, size) => {
    var cols = Math.ceil(img.width/size)
    var rows = Math.ceil(img.height/size)
    
    var pieces = []

    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    if (img.height > img.width) {
        ctx.drawImage(img, 0, 0, img.width, img.height,  
                            (size/2) - ((img.width/img.height)*size)/2, 0, 
                            (img.width/img.height)*size, size);
    } else {
        ctx.drawImage(img, 0, 0, img.width, img.height, 
                            0, (size/2) - ((img.height/img.width)*size)/2, 
                            size, (img.height/img.width)*size);
    }

    pieces.push(canvas.toDataURL());

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, i*size, j*size, size, size, 
                            0, 0, canvas.width, canvas.height);
            pieces.push(canvas.toDataURL());
        }
    }
    return pieces;
}