import React from 'react';

type Props = {
  htmlArray: Array<any>,
  // eslint-disable-next-line no-undef
  tagName: keyof JSX.IntrinsicElements
}

const RenderHtml: any = ({ htmlArray, tagName: Wrapper = htmlArray[0] }: Props) => {
  const render = (array: any): any => {
    const arrayWithoutTagElement = array.filter((_: any, index: any) => index !== 0);
    return arrayWithoutTagElement.map((item: any) => {
      if (typeof (item) === 'string') {
        return item;
      }
      return <RenderHtml htmlArray={item} />;
    });
  };

  return (
    <Wrapper>
      {render(htmlArray)}
    </Wrapper>
  );
};

export default RenderHtml;
