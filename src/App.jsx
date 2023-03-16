import React from 'react';
import logo from './logo.svg';
import './App.css';
import Countdown from './components/CountdownTimer';
import RotatingPicture from './components/RotatingPicture';
import Clock from './components/Clock';

function App() {

  return (
    <div className="App">
      <Clock/>
        <Countdown />
        <RotatingPicture/>
    </div>
  );
}

export default App;