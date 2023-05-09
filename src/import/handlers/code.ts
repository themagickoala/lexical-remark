import lexicalCode from "@lexical/code";
import lexical from "lexical";
import { Code, Text } from "mdast";
import { Handler } from "./index.js";

export const code: Handler<Code> = (node, { rootHandler, parent, formatting }) => {
  const lexicalNode = lexicalCode.$createCodeNode();
  const lines = node.value.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) {
      lexicalNode.append(lexical.$createLineBreakNode());
    }
    lexicalNode.append(lexicalCode.$createCodeHighlightNode(line));
  });
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};