import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalUtils from '@lexical/utils';
import lexical, { LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createAttachmentNode, AttachmentNode } from './node.js';

type AttachmentPayload = Readonly<{ filename: string; url: string }>;

/**
 * A command to insert an attachment. The argument is an {@link AttachmentPayload}.
 */
export const INSERT_ATTACHMENT_COMMAND: LexicalCommand<AttachmentPayload> =
  lexical.createCommand('INSERT_ATTACHMENT_COMMAND');

/**
 * A Lexical plugin to register the INSERT_ATTACHMENT_COMMAND
 */
export const AttachmentPlugin = (): JSX.Element | null => {
  const [editor] = lexicalComposerContext.useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([AttachmentNode])) {
      throw new Error('AttachmentsPlugin: AttachmentNode not registered on editor');
    }

    return lexicalUtils.mergeRegister(
      editor.registerCommand<AttachmentPayload>(
        INSERT_ATTACHMENT_COMMAND,
        (payload) => {
          const attachmentNode = $createAttachmentNode(payload.url, payload.filename);
          lexical.$insertNodes([attachmentNode]);

          if (lexical.$isRootOrShadowRoot(attachmentNode.getParentOrThrow())) {
            lexicalUtils.$wrapNodeInElement(attachmentNode, lexical.$createParagraphNode).selectEnd();
          }

          return true;
        },
        lexical.COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};
