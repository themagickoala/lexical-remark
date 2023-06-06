import { $createLinkNode, $isLinkNode, LinkNode, toggleLink as lexicalToggleLink } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $isImageNode } from '../../../../src';

// Source: https://stackoverflow.com/a/8234912/2013580
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);

export type ToggleLinkCommand = string | null;

export const TOGGLE_LINK_COMMAND: LexicalCommand<ToggleLinkCommand> = createCommand('NEXT_TOGGLE_LINK_COMMAND');

// istanbul ignore next: not possible to reliably test with jest

// istanbul ignore next: not possible to reliably test with jest
export function toggleLink(url: ToggleLinkCommand): boolean {
  const selection = $getSelection();

  if ($isRangeSelection(selection)) {
    if (url === null) {
      lexicalToggleLink(url);
      return true;
    } else if (typeof url === 'string') {
      if (url === 'https://' || urlRegExp.test(url)) {
        lexicalToggleLink(url);
        return true;
      }
      return false;
    }
    return true;
  }

  const imageNode = $isNodeSelection(selection) ? selection.getNodes()[0] : null;
  if (!imageNode || !$isImageNode(imageNode)) {
    return false;
  }

  if (url === null) {
    // Remove nodes - Copied from Lexical
    const parent = imageNode.getParent();
    if ($isLinkNode(parent)) {
      const children = parent.getChildren();

      for (let i = 0; i < children.length; i++) {
        parent.insertBefore(children[i]);
      }

      parent.remove();
    }

    return true;
  }

  const imageNodeParent = imageNode.getParent();
  if ($isLinkNode(imageNodeParent)) {
    // it's updating a image node parent's url
    imageNodeParent.setURL(url);
    return true;
  }

  // Else it's a brand new link
  // Add wrap node and append the image
  const linkNode = $createLinkNode(url);
  imageNode.insertBefore(linkNode);
  linkNode.append(imageNode);

  imageNodeParent?.insertAfter($createParagraphNode());

  return true;
}

export const EditorLinkPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor');
    }

    return mergeRegister(editor.registerCommand(TOGGLE_LINK_COMMAND, toggleLink, COMMAND_PRIORITY_EDITOR));
  }, [editor]);

  return <LexicalLinkPlugin validateUrl={(url) => url === 'https://' || urlRegExp.test(url)} />;
};
