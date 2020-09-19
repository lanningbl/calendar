import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './components/Calendar';

function App() {
  return (
    <Router>
      <Route path='/' exact component={Calendar} />
    </Router>
  );
}

export default App;
