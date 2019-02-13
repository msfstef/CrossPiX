import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
    render() {
        return (
            <div id="Header">
                <p className="logo" 
                    onClick={()=>{
                        this.props.handleMenu()
                        }}>
                    Logo
                </p>
                
                <div className="itemContainer">
                <p className="new item"
                    onClick={()=>{
                        this.props.handleMenu()
                        }}>
                    New Pattern
                </p>
                <a className="contact item"
                    target="_blank" rel="noopener noreferrer"
                    href="https://msfstef.github.io/#/contact">
                    Contact
                </a>
                <a className="about item"
                    target="_blank" rel="noopener noreferrer"
                    href="https://msfstef.github.io/#/about">
                    About Me
                </a>
                </div>
            </div>
        );
    }
}

export default Header;