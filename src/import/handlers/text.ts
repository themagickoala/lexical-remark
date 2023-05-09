import lexical from "lexical";
import { Text } from "mdast";
import { Handler } from "./index.js";

export const text: Handler<Text, true> = (node, { parent, formatting = [] }) => {
  const lines = node.value.split(/\n/);
  lines.forEach((line, index) => {
    const lexicalNode = lexical.$createTextNode(line);
    formatting.forEach((format) => {
      lexicalNode.toggleFormat(format);
    });
    parent.append(lexicalNode);
    if (index < lines.length - 1) {
      parent.append(lexical.$createLineBreakNode());
    }
  });
};