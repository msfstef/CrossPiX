import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class GenPdf extends Component {    
    genPdf = () => {
        var pdf = new jsPDF('l','px','a4');
        let a4prop = Math.sqrt(2);
        let spacing = 10;
        var margins = {
            top: 15,
            bottom: 15,
            left: a4prop*15,
            right: a4prop*15
        }
        var width = pdf.internal.pageSize.getWidth() - margins.left - margins.right;    
        var height = pdf.internal.pageSize.getHeight() - margins.top - margins.bottom;
        var noOfStitches = 30;

        var paletteTable = document.getElementsByClassName("paletteTable")[0]
        var paletteImage = "";
        var pattern = new Image();
        pattern.src = this.props.fileUrl;
        pattern.onload = () => {
            var imagePieces = splitImage(pattern, noOfStitches, this.props.stitchSize)
            html2canvas(paletteTable, {logging: false}).then(
                function(canvas) {
                    paletteImage = canvas.toDataURL("image/png");
    
                    var tableWidth = (width-height);
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
                            margins.left + tableWidth + spacing,
                            margins.top + spacing/2,
                            height - spacing,
                            height - spacing)
    
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


var splitImage = (img, noOfStitches, stitchSize) => {
    let size = stitchSize * noOfStitches
    var cols = Math.ceil(img.width/size);
    var rows = Math.ceil(img.height/size);
    var lineWidth = 5;
    
    var pieces = new Array(cols*rows+1)

    var canvasWhole = document.createElement('canvas');
    canvasWhole.width = size + 2*lineWidth;
    canvasWhole.height = size + 2*lineWidth;
    var ctxWhole = canvasWhole.getContext('2d');
    var xStart = lineWidth;
    var yStart = lineWidth;
    var wholeSize = 0;

    if (img.height > img.width) {
        xStart += (size/2) - ((img.width/img.height)*size)/2;
        yStart += 0;
        wholeSize = (size/img.height)*size;
        ctxWhole.drawImage(img, 0, 0, img.width, img.height,  
                            xStart, yStart, 
                            (img.width/img.height)*size, size);
    } else {
        xStart += 0;
        yStart += (size/2) - ((img.height/img.width)*size)/2;
        wholeSize = (size/img.width)*size;
        ctxWhole.drawImage(img, 0, 0, img.width, img.height, 
                            xStart, yStart, 
                            size, (img.height/img.width)*size);
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            ctxWhole.lineWidth = lineWidth;
            ctxWhole.strokeStyle = "#ff0000"
            ctxWhole.strokeRect(xStart + i*wholeSize, yStart + j*wholeSize, 
                                wholeSize, wholeSize)

            let canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, i*size, j*size, size, size, 
                            0, 0, canvas.width, canvas.height);
            pieces[i*rows + j + 1] = canvas.toDataURL();
        }
    }

    xStart -= lineWidth/2;
    yStart -= lineWidth/2;

    if (xStart > lineWidth/2) {
        ctxWhole.clearRect(xStart + (img.width/img.height)*size, 0, 2*size, 2*size)
        ctxWhole.clearRect(0, yStart + size, 2*size, 2*size)
        ctxWhole.beginPath(); 
        ctxWhole.moveTo(xStart, yStart + size);
        ctxWhole.lineTo(xStart + (img.width/img.height)*size, yStart + size)
        ctxWhole.lineTo(xStart + (img.width/img.height)*size, yStart)
        ctxWhole.stroke();
    } else {
        ctxWhole.clearRect(0, yStart + (img.height/img.width)*size, 2*size, 2*size)
        ctxWhole.clearRect(xStart + size, 0, 2*size, 2*size)
        ctxWhole.beginPath(); 
        ctxWhole.moveTo(xStart + size, yStart);
        ctxWhole.lineTo(xStart + size, yStart + (img.height/img.width)*size)
        ctxWhole.lineTo(xStart, yStart + (img.height/img.width)*size)
        ctxWhole.stroke();
    }
    pieces[0] = canvasWhole.toDataURL();

    return pieces;
}