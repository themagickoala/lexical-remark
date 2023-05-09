import { $isImageNode } from './node.js';
import lexicalUtils from '@lexical/utils';
import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalNodeSelection from '@lexical/react/useLexicalNodeSelection.js';
import lexical from 'lexical';
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
  const [isSelected, setSelected, clearSelection] = lexicalNodeSelection.useLexicalNodeSelection(nodeKey);
  const [editor] = lexicalComposerContext.useLexicalComposerContext();
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && lexical.$isNodeSelection(lexical.$getSelection())) {
        event.preventDefault();
        const node = lexical.$getNodeByKey(nodeKey);

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
    const unregister = lexicalUtils.mergeRegister(
      editor.registerCommand(
        lexical.SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand<MouseEvent>(
        lexical.CLICK_COMMAND,
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
