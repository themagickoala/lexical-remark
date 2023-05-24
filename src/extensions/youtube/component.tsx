import { ElementFormatType, LexicalEditor, NodeKey } from "lexical";
import lexicalBlockWithAlignableContents from "@lexical/react/LexicalBlockWithAlignableContents.js";
import lexicalNodeSelection from '@lexical/react/useLexicalNodeSelection.js';
import lexical from 'lexical';
import lexicalUtils from '@lexical/utils';
import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import { useCallback, useEffect, useRef } from "react";
import { $isYouTubeNode } from "./node.js";

type YouTubeComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoID: string;
}>;

export const YouTubeComponent = ({
  className,
  format,
  nodeKey,
  videoID,
}: YouTubeComponentProps) => {
  const videoRef = useRef<null | HTMLIFrameElement>(null);
  const [isSelected, setSelected, clearSelection] = lexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [editor] = lexicalComposerContext.useLexicalComposerContext();
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && lexical.$isNodeSelection(lexical.$getSelection())) {
        event.preventDefault();
        const node = lexical.$getNodeByKey(nodeKey);

        if ($isYouTubeNode(node)) {
          node.remove();
        }

        setSelected(false);
      }

      return false;
    },
    [isSelected, nodeKey, setSelected],
  );

  useEffect(() => {
    const unregister = lexicalUtils.mergeRegister(
      editor.registerCommand(
        lexical.SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(lexical.KEY_DELETE_COMMAND, onDelete, lexical.COMMAND_PRIORITY_LOW),
      editor.registerCommand(lexical.KEY_BACKSPACE_COMMAND, onDelete, lexical.COMMAND_PRIORITY_LOW),
    );

    return () => {
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);
  return (
    <lexicalBlockWithAlignableContents.BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}>
      <iframe
        ref={videoRef}
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
        title="YouTube video"
      />
    </lexicalBlockWithAlignableContents.BlockWithAlignableContents>
  );
}