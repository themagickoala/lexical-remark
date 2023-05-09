import { $isImageNode } from './node.js';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.js';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { LexicalEditor, NodeKey } from 'lexical';
import { Suspense, useCallback, useEffect, useRef } from 'react';

// istanbul ignore next: not possible to reliably test with jest
const LazyImage = ({
  altText,
  className,
  height,
  imageRef,
  src,
  width,
}: {
  altText: string;
  className?: string;
  height: 'inherit' | number;
  imageRef: { current: null | HTMLImageElement };
  src: string;
  width: 'inherit' | number;
}) => (
  <img
    ref={imageRef}
    alt={altText}
    className={className}
    src={src}
    style={{ height, width }}
  />
);

// istanbul ignore next: not possible to reliably test with jest
export default function EditorImageComponent({
  altText,
  height,
  nodeKey,
  src,
  width,
}: {
  altText: string;
  height: 'inherit' | number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);

        if ($isImageNode(node)) {
          node.remove();
        }

        setSelected(false);
      }

      return false;
    },
    [isSelected, nodeKey, setSelected],
  );

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );

    return () => {
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  return (
    <Suspense fallback={null}>
      <LazyImage
        {...(isSelected ? { className: 'selected' } : {})}
        altText={altText}
        height={height}
        imageRef={imageRef}
        src={src}
        width={width}
      />
    </Suspense>
  );
}
