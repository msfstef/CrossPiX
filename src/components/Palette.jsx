import React, { Component } from 'react';
import './Palette.css';

class Palette extends Component {
    render() {
        let data = this.props.palette
        let data_sorted = []
        var colors = []
        

        for (var key in data) {
            data_sorted.push([data[key]["code"], 
                            data[key]["name"], 
                            data[key]["hex"], 
                            data[key]["count"],
                            data[key]["symb"]]);
        }
        data_sorted.sort((a, b) => {return b[3]-a[3]})

        for (let i = 0; i < data_sorted.length; i++) {
            let boxStyle = {
                backgroundColor: "#" + data_sorted[i][2]
            }

            colors.push(
                <tr key={data_sorted[i]} className="paletteColor">
                    <td>
                    <div style={boxStyle} className="paletteBox">
                        <span className="paletteSymb">{data_sorted[i][4]}</span>
                    </div>
                    </td>
                    <td>{data_sorted[i][1]}</td>
                    <td style={{textAlign:"right"}}>{data_sorted[i][0]}</td>
                    <td style={{textAlign:"right"}}>{data_sorted[i][3]}</td>
                </tr>
                
            );
        }

        return (
            <div className="Palette">
                <table className="paletteTable" >
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Name</th>
                        <th>DMC</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {colors}
                </tbody>
                </table>
            </div>
        );
    }
}

export default Palette;