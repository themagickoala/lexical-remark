import { useEffect } from 'react';
import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import { $createImageNode, ImageNode, ImagePayload } from './node.js';
import lexical, { LexicalCommand } from 'lexical';
import lexicalUtils from '@lexical/utils';

type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = lexical.createCommand('INSERT_IMAGE_COMMAND');

// istanbul ignore next: not possible to reliably test with jest
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
