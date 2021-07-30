export const addString = (string: string, index: number, stringToAdd: string) => {
  return string.substring(0, index) + stringToAdd + string.substring(index, string.length);
};

export const deleteString = (string: string, index: number) => {
  return string.substring(0, index - 1) + string.substring(index, string.length);
};

export const replaceString = (
  string: string,
  startOffset: number,
  endOffset: number,
  newString: string | null = null,
) => {
  if (newString === null) {
    return string.substring(0, startOffset) + string.substring(endOffset, string.length);
  }
  return string.substring(0, startOffset) + newString + string.substring(endOffset, string.length);
};
