import { AttachmentNode } from '../../extensions/attachments/node.js';
import { Attachment } from '../../types.js';
import { Handler } from './index.js';

export const attachment: Handler<AttachmentNode> = (node, { rootHandler }) => {
  const remarkNode: Attachment = {
    filename: node.getFilename(),
    type: 'attachment',
    url: node.getURL(),
  };

  return remarkNode;
};
