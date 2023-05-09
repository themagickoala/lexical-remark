import { Image } from 'mdast';
import { Handler } from "./index.js";
import { ImageNode } from '../../extensions/image/node.js';

export const image: Handler<ImageNode> = (node) => {
  const remarkNode: Image = {
    type: 'image',
    url: node.getSrc(),
    alt: node.getAltText(),
  };

  return remarkNode;
};