import React, { useRef } from 'react';

type ContentEditableProps = {
  value: string,
  onChange: Function,
  className: string,
  placeholder: string,
}

const ContentEditable = ({
  value,
  onChange = () => { },
  className,
  placeholder,
}: ContentEditableProps) => {
  const state = useRef({
    value,
    prevValue: null as any,
    key: null as any,
  });

  if (state.current.prevValue !== value) {
    state.current.value = value;
    state.current.key = Date.now();
  }

  const handleInput = (event: any) => {
    // eslint-disable-next-line no-shadow
    const value = event.target.innerText;
    state.current.prevValue = value;
    onChange(value);
  };

  return (
    <div
      key={state.current.key}
      className={className}
      placeholder={placeholder}
      contentEditable
      dangerouslySetInnerHTML={{ __html: state.current.value }}
      onInput={handleInput}
    />
  );
};
export default ContentEditable;
