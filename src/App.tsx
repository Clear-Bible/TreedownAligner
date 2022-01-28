import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import './App.css';
//import atoms from './state/atoms';
//import createSelectors from './state/selectors';

import PolyglotComponent from './components/polyglot';
import ControlPanel from './components/controlPanel';
import ContextPanel from './components/contextPanel';

function App() {

  //createSelectors();

  return (
    <RecoilRoot>
      <div style={{ position: 'relative' }}>
        <PolyglotComponent />
        <ControlPanel />
        <ContextPanel />
      </div>
    </RecoilRoot>
  );
}

export default App;
