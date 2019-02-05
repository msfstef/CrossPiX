import React, { Component } from 'react';

class Slider extends Component {
    render() {
        return (
            <div>
                <input id={this.props.name} type="range" min="1" max="20" 
                    defaultValue = {this.props.defaultScale}
                    onChange={() => {this.props.handler()}} />
            </div>
        );
    }
}

export default Slider;