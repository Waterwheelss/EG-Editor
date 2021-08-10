export type BlockPayload = {
  name: string,
  text: string,
}

export type Block = {
  id: string,
  styles: Array<BlockStyle>,
} & BlockPayload

export type BlockStyle = {
  tag: string,
  inlineStyle?: any,
  startOffset: number;
  endOffset: number;
}

export type BlockState = {
  blocksGroup: Array<Block>,
  selectedBlock: Block,
}
