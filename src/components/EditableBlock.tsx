import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../rootReducer';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const [tempText, setTempText] = useState('');
  const [text, setText] = useState('');
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const selectedBlock = useSelector((state: RootState) => state.blocks.selectedBlock);

  const onInputHandler = (e: React.FormEvent) => {
    const target = e.target as Element;
    setTempText(target.innerHTML);
  };

  const setCaretToEnd = (element: HTMLDivElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.focus();
  };

  useEffect(() => {
    if (id === selectedBlock.id) {
      setCaretToEnd(ref.current as HTMLDivElement);
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
      placeholder="Type '/' for commands"
    >
      {text}
    </div>
  );
};

export default EditableBlock;
