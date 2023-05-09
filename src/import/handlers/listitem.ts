import lexicalList from "@lexical/list";
import { ListItem } from "mdast";
import { Handler } from "./index.js";

export const listItem: Handler<ListItem, true> = (node, { parent, formatting, rootHandler }) => {
  if (!lexicalList.$isListNode(parent)) {
    return;
  }
  const lexicalNode = lexicalList.$createListItemNode();
  node.children.forEach((child) => rootHandler(child, { parent: lexicalNode, formatting, rootHandler }));

  parent.append(lexicalNode);
};