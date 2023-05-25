import { Image } from "mdast";
import { $createImageNode } from "../../extensions/image/node.js";
import { Handler } from "../parser.js";

export const image: Handler<Image> = (node, parser) => {
  const lexicalNode = $createImageNode({ altText: node.alt ?? '', src: node.url });
  parser.append(lexicalNode);
};