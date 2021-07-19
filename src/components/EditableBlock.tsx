import React, { useState, useRef, useEffect } from 'react';

const EditableBlock = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  const [tempText, setTempText] = useState('');
  const [text, setText] = useState('Type \'/\' for commands');

  const onInputHandler = (e: React.FormEvent) => {
    const target = e.target as Element;
    setTempText(target.innerHTML);
  };

  return (
    <div
      ref={ref}
      contentEditable="true"
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
