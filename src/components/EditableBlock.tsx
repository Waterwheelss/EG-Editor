import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../rootReducer';
import keyDownHandler from '../keyDownHandler';

const EditableBlock = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  const [tempText, setTempText] = useState('');
  const [text, setText] = useState('Type \'/\' for commands');

  const onInputHandler = (e: React.FormEvent) => {
    const target = e.target as Element;
    setTempText(target.innerHTML);
  };

  // useEffect(() => {
  //   document.addEventListener('keydown', (e) => keyDownHandler(e, dispatch));
  // });

  // useEffect(() => {
  //   if (id === selectedBlock.id) {
  //     ref.current?.focus();
  //   }
  // });

  return (
    <div
      ref={ref}
      contentEditable="true"
      suppressContentEditableWarning
      className="block"
      onInput={onInputHandler}
      onBlur={() => setText(tempText)}
      onFocus={() => setText('')}
    >
      {text}
    </div>
  );
});

export default EditableBlock;
