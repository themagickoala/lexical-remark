import { ThematicBreak } from "mdast";
import lexicalHorizontalRuleNode from '@lexical/react/LexicalHorizontalRuleNode.js';
import { Handler } from "../parser.js";

export const thematicBreak: Handler<ThematicBreak> = (_, parser) => {
  const lexicalNode = lexicalHorizontalRuleNode.$createHorizontalRuleNode();
  parser.append(lexicalNode);
};