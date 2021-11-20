import React from 'react';
import logo from './logo.svg';
import './App.css';
import CountdownTimer from './components/CountdownTimer';
import RotatingPicture from './components/RotatingPicture';

function App() {

  return (
    <div className="App">
        <CountdownTimer />
        <RotatingPicture/>
    </div>
  );
}

export default App;