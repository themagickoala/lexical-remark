import lexical from "lexical";
import { Text } from "mdast";
import { Handler } from "../parser.js";

export const text: Handler<Text> = (node, parser) => {
  const lines = node.value.split(/\n/);
  lines.forEach((line, index) => {
    const lexicalNode = lexical.$createTextNode(line);
    parser.formatting.forEach((format) => {
      lexicalNode.toggleFormat(format);
    });
    parser.append(lexicalNode);
    if (index < lines.length - 1) {
      parser.append(lexical.$createLineBreakNode());
    }
  });
};