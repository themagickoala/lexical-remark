import { $createCodeNode } from "@lexical/code";
import { Code, Text } from "mdast";
import { Handler } from ".";

export const code: Handler<Code> = (node, { rootHandler, parent, formatting }) => {
  const lexicalNode = $createCodeNode();
  const textNode: Text = {
    type: 'text',
    value: node.value,
  };
  rootHandler(textNode, { parent: lexicalNode, formatting, rootHandler });
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};