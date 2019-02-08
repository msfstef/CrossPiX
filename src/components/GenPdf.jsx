import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class GenPdf extends Component {

    
    genPdf = () => {
        var pdf = new jsPDF('l','px','a4');
        var paletteTable = document.getElementsByClassName("paletteTable")[0]
        var paletteImage = "";
        var margins = {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
        }
        var width = pdf.internal.pageSize.getWidth() - margins.left - margins.right;    
        var height = pdf.internal.pageSize.getHeight() - margins.top - margins.bottom;

        html2canvas(paletteTable).then(
            function(canvas) {
                paletteImage = canvas.toDataURL("image/png");

                var tableWidth = width/4;
                var tableHeight = (canvas.height/canvas.width)*tableWidth;
                if(tableHeight > height) {
                    tableHeight = height;
                }

                console.log(height)
                console.log(canvas.height)
                pdf.addImage(
                    paletteImage,
                    'PNG',
                    margins.top, 
                    margins.left,
                    tableWidth,
                    tableHeight)
                pdf.save('two-by-four.pdf')
            }
        )

        //pdf.fromHTML(paletteTable)
        
    }

    render() {
        return (
            <div>
                <input type="submit" value="Generate DPF"
                        onClick = {()=>{this.genPdf();}} />
            </div>
        );
    }
}

export default GenPdf;