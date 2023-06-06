import { $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { $isImageNode } from '../../../../src';
import { editorSanitiseUrl } from '../../utils/editor-sanitise-url';
import { getEditorSelectedNode } from '../../utils/get-editor-selected-node';
import { setEditorPopoverPosition } from '../../utils/set-editor-popover-position';
import { TOGGLE_LINK_COMMAND } from '../editor-link/editor-link.plugin';
import { EditorLinkPopoverComponent } from './editor-link-popover.component';

// istanbul ignore next: not possible to reliably test with jest
const FloatingLinkEditor = ({
  anchorElement,
  editor,
  isOpen,
  setIsOpen,
}: {
  anchorElement: HTMLElement;
  editor: LexicalEditor;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [lastSelection, setLastSelection] = useState<RangeSelection | GridSelection | NodeSelection | null>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    const editorElement = editorRef.current;

    const getNode = () => {
      if ($isNodeSelection(selection)) {
        return selection.getNodes()[0];
      } else if ($isRangeSelection(selection)) {
        return getEditorSelectedNode(selection);
      }
      return null;
    };

    const node = getNode();

    if (node) {
      let link = '';
      const parent = node.getParent();

      if ($isLinkNode(parent)) {
        link = parent.getURL();
      } else if ($isLinkNode(node)) {
        link = node.getURL();
      }

      setIsEditing(link === 'https://');
      setLinkUrl(link);
    }

    if (!editorElement || !node) {
      setIsOpen(false);
      setLastSelection(null);
      setIsEditing(false);
      setLinkUrl('');
      return;
    }

    const rootElement = editor.getRootElement();
    const nativeSelection = window.getSelection();

    if (selection && nativeSelection && rootElement && editor.isEditable()) {
      let rect;

      // check if is a text link
      if ($isRangeSelection(selection) && rootElement.contains(nativeSelection.anchorNode)) {
        rect = nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      } else if (editor.getElementByKey(node.getKey())) {
        const element = editor.getElementByKey(node.getKey());
        rect = element?.getBoundingClientRect();
      }

      if (rect) {
        setEditorPopoverPosition(rect, editorElement, anchorElement);
        setLastSelection(selection);
      }
    }

    return true;
  }, [anchorElement, editor, setIsOpen]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (!isOpen) {
            return false;
          }

          setIsOpen(false);
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, updateLinkEditor, setIsOpen, isOpen]);

  useEffect(() => {
    const observer = new ResizeObserver(() =>
      editor.getEditorState().read(() => {
        updateLinkEditor();
      }),
    );

    observer.observe(document.documentElement);

    return () => observer.unobserve(document.documentElement);
  }, [editor, updateLinkEditor]);

  return (
    <EditorLinkPopoverComponent
      ref={editorRef}
      isEditing={isEditing}
      linkUrl={linkUrl}
      setIsEditing={setIsEditing}
      onClose={() => {
        editor.update(() => {
          if (lastSelection) {
            $setSelection(lastSelection.clone());
          }
        });

        setIsEditing(false);
      }}
      onFormSubmit={(newLinkUrl) => {
        setLinkUrl(newLinkUrl);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, newLinkUrl !== '' ? editorSanitiseUrl(newLinkUrl) : null);
      }}
    />
  );
};

// istanbul ignore next: not possible to reliably test with jest
const useFloatingLinkEditorToolbar = (editor: LexicalEditor, anchorElement: HTMLElement) => {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isOpen, setIsOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const node = selection?.getNodes()[0];

    if (node) {
      const isImageLink = $isLinkNode(node.getParent()) && $isImageNode(node);

      if (isImageLink && $isNodeSelection(selection)) {
        setIsOpen(true);
      } else if (!isImageLink && $isRangeSelection(selection)) {
        setIsOpen($findMatchingParent(getEditorSelectedNode(selection), $isLinkNode) !== null);
      } else {
        setIsOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  if (!isOpen || !anchorElement) {
    return null;
  }

  return createPortal(
    <FloatingLinkEditor
      anchorElement={anchorElement}
      editor={activeEditor}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />,
    anchorElement,
  );
};

// istanbul ignore next: not possible to reliably test with jest
export const EditorLinkPopoverPlugin = ({ anchorElement = document.body }: { anchorElement?: HTMLElement }) => {
  const [editor] = useLexicalComposerContext();

  return useFloatingLinkEditorToolbar(editor, anchorElement);
};
