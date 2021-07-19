import React, { useEffect } from 'react';

import BlockRender from './components/BlockRender';
import './sass/style.scss';

const App = () => {
  return (
    <div className="workspace">
      <BlockRender />
    </div>
  );
};

export default App;
