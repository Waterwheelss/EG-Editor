import { Block } from '../../types/block';

type Tag = {
  position: number,
  tagType: string,
  tag: string,
}

export const getTags = (block: Block, text: string) => {
  const Tags: Array<Tag> = [];

  if (block.styles.length === 0) {
    return [];
  }

  block.styles?.forEach((style) => {
    const { startOffset, endOffset, tag } = style;
    Tags.push({
      position: startOffset,
      tagType: 'openning',
      tag,
    });
    Tags.push({
      position: endOffset,
      tagType: 'closing',
      tag,
    });
  });

  Tags.sort((a: any, b: any) => {
    if (a.position < b.position) {
      return -1;
    }
    return 1;
  });

  if (Tags[0].position !== 0) {
    const firstTag = {
      position: 0,
      tagType: 'openning',
      tag: 'none',
    };

    Tags.unshift(firstTag);
  }

  if (Tags[Tags.length - 1].position !== text.length) {
    const lastTag = {
      position: text.length,
      tagType: 'closing',
      tag: 'none',
    };

    Tags.push(lastTag);
  }

  return Tags;
};

export default getTags;
