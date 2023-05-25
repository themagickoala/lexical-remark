import { Emphasis } from "mdast";
import { Handler } from "../parser.js";

export const emphasis: Handler<Emphasis> = (node, parser) => {
  parser.formatting.push('italic');
  node.children.forEach((child) => {
    parser.parse(child);
  });
  parser.formatting.pop();
};
