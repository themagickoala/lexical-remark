import lexicalHorizontalRuleNode from '@lexical/react/LexicalHorizontalRuleNode.js';
import { ThematicBreak } from 'mdast';

import { Handler } from '../parser.js';

export const thematicBreak: Handler<ThematicBreak> = (_, parser) => {
  const lexicalNode = lexicalHorizontalRuleNode.$createHorizontalRuleNode();
  parser.append(lexicalNode);
};
