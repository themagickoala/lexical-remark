import { Image } from 'mdast';

import { ImageNode } from '../../extensions/image/node.js';
import { Handler } from './index.js';

export const image: Handler<ImageNode> = (node) => {
  const remarkNode: Image = {
    alt: node.getAltText(),
    type: 'image',
    url: node.getSrc(),
  };

  return remarkNode;
};
