import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalUtils from '@lexical/utils';
import lexical, { LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createImageNode, ImageNode, ImagePayload } from './node.js';

type InsertImagePayload = Readonly<ImagePayload>;

/**
 * A command to insert an image. The argument is an {@link ImagePayload}.
 */
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = lexical.createCommand('INSERT_IMAGE_COMMAND');

/**
 * A Lexical plugin to register the INSERT_IMAGE_COMMAND
 */
export const ImagePlugin = (): JSX.Element | null => {
  const [editor] = lexicalComposerContext.useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return lexicalUtils.mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          lexical.$insertNodes([imageNode]);

          if (lexical.$isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            lexicalUtils.$wrapNodeInElement(imageNode, lexical.$createParagraphNode).selectEnd();
          }

          return true;
        },
        lexical.COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};
