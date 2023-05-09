import { $createListNode } from "@lexical/list";
import { List } from "mdast";
import { Handler } from "./index.js";

export const list: Handler<List> = (node, { parent, formatting, rootHandler }) => {
  const lexicalNode = $createListNode(node.ordered ? "number" : "bullet");
  node.children.forEach((child) => {
    if (child.type === 'listItem') {
      rootHandler(child, { parent: lexicalNode, formatting, rootHandler });
    }
  });
  
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
}