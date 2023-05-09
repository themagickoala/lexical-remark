import lexicalRichText from "@lexical/rich-text";
import { Blockquote } from "mdast";
import { Handler } from "./index.js";

export const blockquote: Handler<Blockquote> = (node, { parent, formatting, rootHandler }) => {
  const lexicalNode = lexicalRichText.$createQuoteNode();
  node.children.forEach((child) => rootHandler(child, { parent: lexicalNode, formatting, rootHandler }));
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};
