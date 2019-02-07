import React, { Component } from 'react';
import './Palette.css';

class Palette extends Component {

    componentDidUpdate () {

    }

    render() {
        let data = this.props.palette
        let data_sorted = []
        var colors = []
        

        for (var key in data) {
            data_sorted.push([key, data[key][0], data[key][1], data[key][2]]);
        }
        data_sorted.sort((a, b) => {return b[3]-a[3]})

        for (let i = 0; i < data_sorted.length; i++) {
            let boxStyle = {
                backgroundColor: "#" + data_sorted[i][2],
                height: "20px",
                width: "40px"
            }
            colors.push(
                <div key={data_sorted[i]} className="paletteColor">
                    <div style={boxStyle} className="paletteBox">
                    </div>
                    <p>{data_sorted[i][1]}</p>
                    <p>{"DMC: " + data_sorted[i][0]}</p>
                    <p>{"Count: " + data_sorted[i][3]}</p>
                </div>
                
            );
        }

        return (
            <div className="Palette">     
                {colors}           
            </div>
        );
    }
}

export default Palette;