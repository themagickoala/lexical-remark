import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalUtils from '@lexical/utils';
import lexical, {type LexicalCommand} from 'lexical';
import {useEffect} from 'react';
import {$createYouTubeNode, YouTubeNode} from './node.js';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = lexical.createCommand(
  'INSERT_YOUTUBE_COMMAND',
);

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

        return true;
      },
      lexical.COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}