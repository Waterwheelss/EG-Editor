import marked from 'marked';

const markdownParser = (text: string) => {
  const result = marked.parseInline(text);
  return result;
};

export default markdownParser;
