import React, { Component } from 'react';
import './Slider.css';

class Slider extends Component {
    state = {
        value: this.props.defaultValue,
        textUpdate: false,
        textUpdateEnd: false,
        textUpdateDelay: 800
    }

    componentDidUpdate () {
        if (!this.state.textUpdate) {
            let val = parseInt(this.state.value);
            if (isNaN(val)){
                this.setState({value: this.props.defaultValue});
            } else if (val < this.props.min) {
                this.setState({value: this.props.min});
            } else if (val > this.props.max) {
                this.setState({value: this.props.max});
            }

            let elem_val = document.getElementById(this.props.name).value;
            if (elem_val !== this.state.value) {
                if (this.state.textUpdateEnd) {
                    document.getElementById(this.props.name).value = val;
                } else {
                    this.setState({value: elem_val});
                }
                
            }
        }
    }

    handleText = () => {
        if (!this.state.textUpdate) {
            this.setState({
                textUpdate: true,
                textUpdateEnd: true
            });
            setTimeout( ()=>{
                this.setState({textUpdate: false});
            }, this.state.textUpdateDelay)
            setTimeout( ()=>{
                this.setState({textUpdateEnd: false});
            }, this.state.textUpdateDelay + 10)
            setTimeout( ()=>{
                this.props.handler();
            }, this.state.textUpdateDelay + 20)
        }
        let valTxt = document.getElementById(this.props.name + "Text").value;
        valTxt = valTxt.slice(0,3);
        this.setState({value: valTxt});
    }

    render() {
        return (
            <div className="Slider">
            <div className="sliderTitle">
                {this.props.title}
            </div>
            <div className="sliderMain">
                <input id={this.props.name} className="SliderSlider" 
                    type="range" step="1"
                    min={this.props.min} max={this.props.max}
                    defaultValue = {this.props.defaultValue}
                    onChange={() => {
                        this.props.handler();
                        }
                } />
                <span className="SliderValue">
                <input className="SliderText"
                    id={this.props.name+"Text"} type="number" 
                    min={this.props.min} max={this.props.max}
                    maxLength="3"
                    value={this.state.value} 
                    onChange={() => {
                        this.handleText();                        
                    }}/>
                    
                </span>
            </div>
            </div>
        );
    }
}

export default Slider;