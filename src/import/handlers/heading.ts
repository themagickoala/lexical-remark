import { $createHeadingNode } from "@lexical/rich-text";
import { Heading } from "mdast";
import { Handler } from "./index.js";

export const heading: Handler<Heading> = (node, { parent, formatting, rootHandler }) => {
  const rank = Math.max(Math.min(6, node.depth || 1), 1) as 1 | 2 | 3 | 4 | 5 | 6
  const lexicalNode = $createHeadingNode(`h${rank}`);
  node.children.forEach((child) => rootHandler(child, { parent: lexicalNode, formatting, rootHandler }));
  
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};