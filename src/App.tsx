import React from 'react';
import logo from './logo.svg';
import './App.css';

import Polyglot from './components/polyglot';
import ControlPanel from './components/controlPanel';
import ContextPanel from './components/contextPanel';

function App() {
  return (
    <div style={{ position: 'relative' }}>
      <Polyglot />
      <ControlPanel />
      <ContextPanel />
    </div>
  );
}

export default App;
