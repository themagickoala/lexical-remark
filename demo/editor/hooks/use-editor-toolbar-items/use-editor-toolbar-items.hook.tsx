/* eslint-disable import/no-extraneous-dependencies */
import { $createCodeNode } from '@lexical/code';
import { $isLinkNode } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  mdiCodeTags,
  mdiCommentQuoteOutline,
  mdiFormatAlignJustify,
  mdiFormatBold,
  mdiFormatClear,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiImageOutline,
  mdiLanguageMarkdownOutline,
  mdiLink,
  mdiLinkOff,
  mdiMinus,
  mdiPlus,
  mdiRedo,
  mdiUndo,
  mdiUnfoldMoreHorizontal,
  mdiYoutube,
} from '@mdi/js';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { $createRemarkExport, $createRemarkImport, $isImageNode, INSERT_COLLAPSIBLE_COMMAND } from '../../../../src';
import { EditorToolbarButton } from '../../components/editor-toolbar/editor-toolbar-button';
import { EditorToolbarDivider } from '../../components/editor-toolbar/editor-toolbar-divider';
import {
  EditorToolbarDropdown,
  EditorToolbarDropdownItem,
} from '../../components/editor-toolbar/editor-toolbar-dropdown';
import { useEditorContext } from '../../context/editor-context';
import { TOGGLE_LINK_COMMAND } from '../../plugins/editor-link/editor-link.plugin';
import { $createQuoteNode } from '../../plugins/editor-quote/editor-quote.node';
import { editorSanitiseUrl } from '../../utils/editor-sanitise-url';
import { getEditorSelectedNode } from '../../utils/get-editor-selected-node';

export type EditorToolbarItem = {
  component: ReactElement;
  type: 'button' | 'divider' | 'dropdown';
};

// istanbul ignore next
const blockTypeMap: Record<string, { iconPath: string; name: string }> = {
  bullet: { iconPath: mdiFormatListBulleted, name: 'Bulleted list' },
  code: { iconPath: mdiCodeTags, name: 'Code block' },
  h1: { iconPath: mdiFormatHeader1, name: 'Heading 1' },
  h2: { iconPath: mdiFormatHeader2, name: 'Heading 2' },
  h3: { iconPath: mdiFormatHeader3, name: 'Heading 3' },
  number: { iconPath: mdiFormatListNumbered, name: 'Numbered list' },
  paragraph: { iconPath: mdiFormatAlignJustify, name: 'Paragraph' },
  quote: { iconPath: mdiCommentQuoteOutline, name: 'Quote' },
};

// istanbul ignore next
export const useEditorToolbarItems = (): EditorToolbarItem[][] => {
  const [editor] = useLexicalComposerContext();
  const { isMarkdownMode, markdownValue, setIsMarkdownMode, setMarkdownValue, setShowImageModal, setShowVideoModal } =
    useEditorContext();

  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeMap>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getEditorSelectedNode(selection);
      const anchorNode = selection.anchor.getNode();

      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsCode(selection.hasFormat('code'));
      setIsLink($isLinkNode(node.getParent()) || $isLinkNode(node));

      if (activeEditor.getElementByKey(element.getKey()) !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();

          if (type in blockTypeMap) {
            setBlockType(type as keyof typeof blockTypeMap);
          }
        }
      }
    } else if ($isNodeSelection(selection)) {
      const node = selection.getNodes()[0];
      const testIsImageLink = $isLinkNode(node.getParent()) && $isImageNode(node);
      setIsLink(testIsImageLink);
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [activeEditor, updateToolbar]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      activeEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      activeEditor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      activeEditor.update(() => {
        let selection = $getSelection();

        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            selection.insertNodes([$createCodeNode()]);
            selection = $getSelection();

            if ($isRangeSelection(selection)) {
              selection.insertRawText(selection.getTextContent());
            }
          }
        }
      });
    }
  };

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle('');
          }

          if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const handleMarkdownToggle = useCallback(() => {
    activeEditor.update(() => {
      if (isMarkdownMode && typeof document !== 'undefined') {
        $createRemarkImport()(markdownValue);
        const root = $getRoot();
        const lastChild = root.getLastChild();
        if (lastChild) {
          lastChild.insertAfter($createParagraphNode());
        }
        root.selectStart();
      } else if (typeof document !== 'undefined') {
        setMarkdownValue($createRemarkExport()());
      }
      setIsMarkdownMode(!isMarkdownMode);
    });
  }, [activeEditor, setIsMarkdownMode, isMarkdownMode, markdownValue, setMarkdownValue]);

  return [
    [
      {
        component: (
          <EditorToolbarButton
            key="undo"
            aria-label="Undo"
            iconPath={mdiUndo}
            isDisabled={!canUndo || isMarkdownMode}
            title="Undo (Ctrl+Z)"
            onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
          />
        ),
        type: 'button',
      },
      {
        component: (
          <EditorToolbarButton
            key="redo"
            aria-label="Redo"
            iconPath={mdiRedo}
            isDisabled={!canRedo || isMarkdownMode}
            title="Redo (Ctrl+Y)"
            onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
          />
        ),
        type: 'button',
      },
      {
        component: <EditorToolbarDivider key="divider-1" />,
        type: 'divider',
      },
      {
        component: (
          <EditorToolbarDropdown
            key="formatting-options"
            buttonAriaLabel="Formatting options for text style"
            buttonIconPath={blockTypeMap[blockType].iconPath}
            buttonLabel={blockTypeMap[blockType].name}
            isDisabled={isMarkdownMode}
          >
            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.paragraph.iconPath}
              isActive={blockType === 'paragraph'}
              label={blockTypeMap.paragraph.name}
              onClick={formatParagraph}
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.h1.iconPath}
              isActive={blockType === 'h1'}
              label={blockTypeMap.h1.name}
              onClick={() => formatHeading('h1')}
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.h2.iconPath}
              isActive={blockType === 'h2'}
              label={blockTypeMap.h2.name}
              onClick={() => formatHeading('h2')}
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.h3.iconPath}
              isActive={blockType === 'h3'}
              label={blockTypeMap.h3.name}
              onClick={() => formatHeading('h3')}
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.bullet.iconPath}
              isActive={blockType === 'bullet'}
              label={blockTypeMap.bullet.name}
              onClick={() =>
                activeEditor.dispatchCommand(
                  blockType === 'bullet' ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
                  undefined,
                )
              }
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.number.iconPath}
              isActive={blockType === 'number'}
              label={blockTypeMap.number.name}
              onClick={() =>
                activeEditor.dispatchCommand(
                  blockType === 'number' ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
                  undefined,
                )
              }
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.quote.iconPath}
              isActive={blockType === 'quote'}
              label={blockTypeMap.quote.name}
              onClick={formatQuote}
            />

            <EditorToolbarDropdownItem
              iconPath={blockTypeMap.code.iconPath}
              isActive={blockType === 'code'}
              label={blockTypeMap.code.name}
              onClick={formatCode}
            />
          </EditorToolbarDropdown>
        ),
        type: 'dropdown',
      },
      {
        component: <EditorToolbarDivider key="divider-2" />,
        type: 'divider',
      },
      {
        component: (
          <EditorToolbarButton
            key="bold"
            aria-label="Format text as bold. Shortcut: Ctrl+B"
            iconPath={mdiFormatBold}
            isActive={isBold}
            isDisabled={isMarkdownMode}
            title="Bold (Ctrl+B)"
            onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          />
        ),
        type: 'button',
      },
      {
        component: (
          <EditorToolbarButton
            key="italic"
            aria-label="Format text as italics. Shortcut: Ctrl+I"
            iconPath={mdiFormatItalic}
            isActive={isItalic}
            isDisabled={isMarkdownMode}
            title="Italic (Ctrl+I)"
            onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          />
        ),
        type: 'button',
      },
      {
        component: (
          <EditorToolbarButton
            key="code-block"
            aria-label="Insert code snippet"
            iconPath={mdiCodeTags}
            isActive={isCode}
            isDisabled={isMarkdownMode}
            title="Insert code snippet"
            onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          />
        ),
        type: 'button',
      },
      {
        component: (
          <EditorToolbarButton
            key="link"
            aria-label="Insert link"
            iconPath={isLink ? mdiLinkOff : mdiLink}
            isActive={isLink}
            isDisabled={isMarkdownMode}
            title="Insert link"
            onClick={() =>
              activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, !isLink ? editorSanitiseUrl('https://') : null)
            }
          />
        ),
        type: 'button',
      },
      {
        component: (
          <EditorToolbarButton
            key="clear-formatting"
            aria-label="Clear all text formatting"
            iconPath={mdiFormatClear}
            isDisabled={isMarkdownMode}
            title="Clear text formatting"
            onClick={clearFormatting}
          />
        ),
        type: 'button',
      },
      {
        component: <EditorToolbarDivider key="divider-3" />,
        type: 'divider',
      },
      {
        component: (
          <EditorToolbarDropdown
            key="insert-editor-node"
            buttonAriaLabel="Insert specialised editor node"
            buttonIconPath={mdiPlus}
            buttonLabel="Insert"
            isDisabled={isMarkdownMode}
          >
            <EditorToolbarDropdownItem
              iconPath={mdiMinus}
              label="Horizontal Rule"
              onClick={() => activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
            />

            <EditorToolbarDropdownItem
              iconPath={mdiImageOutline}
              label="Insert Image"
              onClick={() => setShowImageModal(true)}
            />

            <EditorToolbarDropdownItem
              iconPath={mdiYoutube}
              label="Insert YouTube Video"
              onClick={() => setShowVideoModal(true)}
            />

            <EditorToolbarDropdownItem
              iconPath={mdiUnfoldMoreHorizontal}
              label="Collapsible Section"
              onClick={() => {
                activeEditor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, 'View content');
              }}
            />
          </EditorToolbarDropdown>
        ),
        type: 'dropdown',
      },
      {
        component: <EditorToolbarDivider key="divider-4" />,
        type: 'divider',
      },
      {
        component: (
          <EditorToolbarButton
            key="markdown"
            aria-label="Markdown"
            iconPath={mdiLanguageMarkdownOutline}
            isActive={isMarkdownMode}
            title="Markdown"
            onClick={handleMarkdownToggle}
          />
        ),
        type: 'button',
      },
    ],
  ];
};
