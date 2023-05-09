import { ThematicBreak } from "mdast";
import lexicalHorizontalRuleNode from '@lexical/react/LexicalHorizontalRuleNode.js';
import { Handler } from "./index.js";

export const thematicBreak: Handler<ThematicBreak> = (_, { parent }) => {
  const lexicalNode = lexicalHorizontalRuleNode.$createHorizontalRuleNode();
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};