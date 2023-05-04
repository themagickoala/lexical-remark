import { $createListItemNode, $isListNode } from "@lexical/list";
import { ListItem } from "mdast";
import { Handler } from ".";

export const listItem: Handler<ListItem, true> = (node, { parent, formatting, rootHandler }) => {
  if (!$isListNode(parent)) {
    return;
  }
  const lexicalNode = $createListItemNode();
  node.children.forEach((child) => rootHandler(child, { parent: lexicalNode, formatting, rootHandler }));

  parent.append(lexicalNode);
};