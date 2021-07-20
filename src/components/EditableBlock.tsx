import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../rootReducer';
import keyDownHandler from '../keyDownHandler';

const EditableBlock = (props: any) => {
  const [tempText, setTempText] = useState('');
  const [text, setText] = useState('Type \'/\' for commands');
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const selectedBlock = useSelector((state: RootState) => state.blocks.selectedBlock);

  const onInputHandler = (e: React.FormEvent) => {
    const target = e.target as Element;
    setTempText(target.innerHTML);
  };

  useEffect(() => {
    if (props.id === selectedBlock.id) {
      ref.current?.focus();
    }
  });

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
};

export default EditableBlock;
