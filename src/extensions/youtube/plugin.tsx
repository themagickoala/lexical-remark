import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalUtils from '@lexical/utils';
import lexical, { type LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createYouTubeNode, YouTubeNode } from './node.js';

/**
 * A command to insert an embedded YouTube video. The argument is a video id.
 */
export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = lexical.createCommand('INSERT_YOUTUBE_COMMAND');

/**
 * A Lexical plugin to register the INSERT_YOUTUBE_COMMAND
 */
export function YouTubePlugin(): JSX.Element | null {
  const [editor] = lexicalComposerContext.useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        lexicalUtils.$insertNodeToNearestRoot(youTubeNode);
        const root = lexical.$getRoot();
        const lastChild = root.getLastChild();
        if (lastChild === youTubeNode) {
          lastChild.insertAfter(lexical.$createParagraphNode());
        }

        return true;
      },
      lexical.COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
