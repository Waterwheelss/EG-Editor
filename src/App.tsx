import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Block from './EditableBlock';
import keyDownHandler from './keyDownHandler';
import { RootState } from './rootReducer';
import './sass/style.scss';

const App = () => {
  const blocks = useSelector((state: RootState) => state.blocks);
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('keydown', (e) => keyDownHandler(e, dispatch));
  }, []);

  return (
    <div className="workspace">
      <Block />
    </div>
  );
};

export default App;
