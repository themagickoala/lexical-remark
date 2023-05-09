import { Image } from "mdast";
import { $createImageNode } from "../../extensions/image/node";
import { Handler } from "./index.js";

export const image: Handler<Image> = (node, { parent }) => {
  const lexicalNode = $createImageNode({ altText: node.alt ?? '', src: node.url });
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};