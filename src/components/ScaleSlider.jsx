import React, { Component } from 'react';

class ScaleSlider extends Component {
    render() {
        return (
            <div>
                <input id="scaleSlider" type="range" min="1" max="20" 
                    defaultValue = {this.props.defaultScale}
                    onChange={() => {this.props.handler()}} />
            </div>
        );
    }
}

export default ScaleSlider;