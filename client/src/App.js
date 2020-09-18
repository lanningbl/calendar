import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from './components/Navigation';
import Calendar from './components/Calendar';

function App() {
  return (
    <Router>
      <Navigation />
      <div className='container'>
        <br />
        <Route path='/' exact component={Calendar} />
      </div>
    </Router>
  );
}

export default App;
