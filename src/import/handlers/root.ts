import { ElementNode } from "lexical";
import { Root } from "mdast";
import { Handler } from "./index.js";

export const root: Handler<Root> = (node, { rootHandler }) => {
  return node.children.map((child) => rootHandler(child, { rootHandler })).filter((child): child is ElementNode => !!child);
};