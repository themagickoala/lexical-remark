import { $createLinkNode } from "@lexical/link";
import { Link } from "mdast";
import { Handler } from "./index.js";

export const link: Handler<Link, true> = (node, { parent, formatting = [], rootHandler }) => {
  const lexicalNode = $createLinkNode(node.url, { title: node.title });
  node.children.forEach((child) => {
    rootHandler(child, { parent: lexicalNode, formatting, rootHandler });
  });
  parent.append(lexicalNode);
};