import React, { useState, useRef } from 'react';

const Block = () => {
  const [tempText, setTempText] = useState('');
  const [text, setText] = useState('');
  return (
    <div
      contentEditable="true"
      className="block"
      onInput={(e) => {
        const target = e.target as Element;
        setTempText(target.innerHTML);
      }}
      onBlur={(e) => setText(tempText)}
    />
  );
};

export default Block;
