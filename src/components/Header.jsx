import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
    render() {
        return (
            <div id="Header">
                <p className="logo">
                    Logo
                </p>
                
                <p className="new item"
                    onClick={()=>{
                        this.props.handleMenu()
                        }}>
                    New Pattern
                </p>
            </div>
        );
    }
}

export default Header;