import lexical from "lexical";
import { Root } from "mdast";
import { Handler } from "../parser.js";

export const root: Handler<Root> = (node, parser) => {
  const lexicalNode = new lexical.RootNode();
  parser.stack.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.stack.pop();
  return lexicalNode;
};