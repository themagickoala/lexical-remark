import { ThematicBreak } from "mdast";
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode.js';
import { Handler } from "./index.js";

export const thematicBreak: Handler<ThematicBreak> = (_, { parent }) => {
  const lexicalNode = $createHorizontalRuleNode();
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};