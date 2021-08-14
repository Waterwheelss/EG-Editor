export const getRenderArray = (group: any, text: string) => {
  let index = 0;

  if (group.length === 0) {
    return [
      'none',
      text.length,
      text,
    ];
  }

  const isNextClose = (data: any) => data?.tagType === 'closing';

  const getNextTag = (data: any): any => {
    const result: any = [];
    const textSlice = text.substring(data[index].position, data[index + 1].position);
    result.push(data[index].tag, data[index].closingAt, textSlice);

    while (!isNextClose(data[index + 1])) {
      index += 1;
      const next = getNextTag(data);
      result.push(next[0], next[1] ? next[1] : '');
    }
    index += 1;
    if (index + 1 >= data.length) {
      return [result];
    }
    // eslint-disable-next-line max-len
    return [result, text.substring(data[index].position, data[index + 1].position)];
  };

  const renderArray = getNextTag(group);

  return renderArray[0];
};

export default getRenderArray;
