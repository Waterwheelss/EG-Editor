import React from 'react';

type Props = {
  htmlArray: Array<any>,
  // eslint-disable-next-line react/require-default-props, no-undef
  tagName?: any,
  currentCaretPosition: number | null
}

const RenderHtml = React.forwardRef(({
  htmlArray,
  tagName: Wrapper = htmlArray[0] === 'none' ? React.Fragment : htmlArray[0],
  currentCaretPosition,
}: Props, ref) => {
  const closingAt = htmlArray[1];

  const render = (array: any): any => {
    const arrayWithoutTagElement = array.filter((_: any, index: any) => index !== 0 && index !== 1);
    return arrayWithoutTagElement.map((item: any) => {
      if (typeof (item) === 'string') {
        return item;
      }
      return <RenderHtml ref={ref} htmlArray={item} currentCaretPosition={currentCaretPosition} />;
    });
  };

  return (
    <Wrapper ref={currentCaretPosition === closingAt + 1 ? ref : null}>
      {render(htmlArray)}
    </Wrapper>
  );
});

export default RenderHtml;
