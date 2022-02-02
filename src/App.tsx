import React from 'react';

import './App.css';


import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

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
