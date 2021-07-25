export type BlockPayload = {
  name: string,
  text: string,
}

export type Block = {
  id: string,
} & BlockPayload

export type BlockState = {
  blocksGroup: Array<Block>,
  selectedBlock: Block,
}
