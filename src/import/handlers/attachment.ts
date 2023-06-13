import { $createAttachmentNode } from '../../extensions/attachments/node.js';
import { Attachment } from '../../types.js';
import { Handler } from '../parser.js';

export const attachment: Handler<Attachment> = (node, parser) => {
  const lexicalNode = $createAttachmentNode(node.url, node.filename);
  parser.stack.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.stack.pop();
  parser.append(lexicalNode);
};
