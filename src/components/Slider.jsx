import React, { Component } from 'react';
import './Slider.css';

class Slider extends Component {
    state = {
        value: this.props.defaultValue
    }

    componentDidUpdate () {
        let elem_val = document.getElementById(this.props.name).value;
        if (elem_val !== this.state.value) {
            this.setState({value: elem_val});
        }
        
    }

    render() {
        return (
            <div className="Slider">
            <div className="sliderTitle">
                {this.props.title}
            </div>
            <div className="sliderMain">
                <input id={this.props.name} 
                    type="range" step="1"
                    min={this.props.min} max={this.props.max}
                    defaultValue = {this.props.defaultValue}
                    onChange={() => {
                        this.props.handler();
                        }
                } />
                <span className="SliderValue">
                    <span className="SliderText">
                    {this.state.value}
                    </span>
                </span>
            </div>
            </div>
        );
    }
}

export default Slider;