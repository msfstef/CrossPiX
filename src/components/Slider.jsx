import React, { Component } from 'react';

class Slider extends Component {
    render() {
        return (
            <div>
                <input id={this.props.name} type="range" 
                    min={this.props.min} max={this.props.max}
                    defaultValue = {this.props.defaultValue}
                    onChange={() => {this.props.handler()}} />
            </div>
        );
    }
}

export default Slider;