export const addString = (string: string, index: number, stringToAdd: string) => {
  return string.substring(0, index) + stringToAdd + string.substring(index, string.length);
};

export const deleteString = (string: string, index: number) => {
  return string.substring(0, index - 1) + string.substring(index, string.length);
};
