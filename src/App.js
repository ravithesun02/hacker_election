import React from 'react';
import logo from './logo.svg';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Main from './components/MainComponent';
import { ToastContainer } from 'react-toastify';

class App extends React.Component{
  render(){

    return (
      <div>
        <Main/>
        <ToastContainer/>
      </div>
    )
  }
}

export default App;
