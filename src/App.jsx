import React, { Component } from 'react';
import AppContainer from './components/AppContainer';
import Header from './components/Header';
import './App.css';


class App extends Component {
  state = {
    newImage: false
  }

  handleMenu = () => {
    this.setState({newImage: !this.state.newImage})
  }

  render() {
    return (
      <div className="App">
        <Header handleMenu={this.handleMenu} />
        <AppContainer newImage={this.state.newImage} />
      </div>
    );
  }
}

export default App;
