import { Block } from '../../types/block';

type Tag = {
  position: number,
  closingAt?: number,
  tagType: string,
  tag: string,
}

export const getTags = (block: Block, text: string) => {
  const tags: Array<Tag> = [];

  if (block.styles.length === 0) {
    return [];
  }

  block.styles?.forEach((style) => {
    const { startOffset, endOffset, tag } = style;
    tags.push({
      position: startOffset,
      closingAt: endOffset,
      tagType: 'openning',
      tag,
    });
    tags.push({
      position: endOffset,
      tagType: 'closing',
      tag,
    });
  });

  tags.sort((a: any, b: any) => {
    if (a.position < b.position) {
      return -1;
    }
    return 1;
  });

  const firstTag = {
    position: 0,
    closingAt: text.length,
    tagType: 'openning',
    tag: 'none',
  };

  const lastTag = {
    position: text.length,
    tagType: 'closing',
    tag: 'none',
  };

  return [firstTag, ...tags, lastTag];
};

export default getTags;
