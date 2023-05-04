import { Emphasis } from "mdast";
import { Handler } from ".";

export const emphasis: Handler<Emphasis> = (node, { parent, formatting = [], rootHandler }) => {
  node.children.forEach((child) => {
    rootHandler(child, { parent, formatting: [...formatting, 'italic'], rootHandler });
  });
};
