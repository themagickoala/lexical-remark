import lexicalComposerContext from '@lexical/react/LexicalComposerContext.js';
import lexicalUtils from '@lexical/utils';
import lexical, {
  ElementNode,
  LexicalNode,
  NodeKey,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
  CollapsibleContainerNode,
} from './container/node.js';
import {
  $createCollapsibleContentNode,
  $isCollapsibleContentNode,
  CollapsibleContentNode,
} from './content/node.js';
import {
  $createCollapsibleTitleNode,
  $isCollapsibleTitleNode,
  CollapsibleTitleNode,
} from './title/node.js';

export const INSERT_COLLAPSIBLE_COMMAND = lexical.createCommand<void>();
export const TOGGLE_COLLAPSIBLE_COMMAND = lexical.createCommand<NodeKey>();

export function CollapsiblePlugin(): null {
  const [editor] = lexicalComposerContext.useLexicalComposerContext();

  useEffect(() => {
    if (
      !editor.hasNodes([
        CollapsibleContainerNode,
        CollapsibleTitleNode,
        CollapsibleContentNode,
      ])
    ) {
      throw new Error(
        'CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor',
      );
    }

    const onEscapeUp = () => {
      const selection = lexical.$getSelection();
      if (
        lexical.$isRangeSelection(selection) &&
        selection.isCollapsed() &&
        selection.anchor.offset === 0
      ) {
        const container = lexicalUtils.$findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleContainerNode,
        );

        if ($isCollapsibleContainerNode(container)) {
          const parent = container.getParent<ElementNode>();
          if (
            parent !== null &&
            parent.getFirstChild<LexicalNode>() === container &&
            selection.anchor.key ===
              container.getFirstDescendant<LexicalNode>()?.getKey()
          ) {
            container.insertBefore(lexical.$createParagraphNode());
          }
        }
      }

      return false;
    };

    const onEscapeDown = () => {
      const selection = lexical.$getSelection();
      if (lexical.$isRangeSelection(selection) && selection.isCollapsed()) {
        const container = lexicalUtils.$findMatchingParent(
          selection.anchor.getNode(),
          $isCollapsibleContainerNode,
        );

        if ($isCollapsibleContainerNode(container)) {
          const parent = container.getParent<ElementNode>();
          if (
            parent !== null &&
            parent.getLastChild<LexicalNode>() === container
          ) {
            const lastDescendant = container.getLastDescendant<LexicalNode>();
            if (
              lastDescendant !== null &&
              selection.anchor.key === lastDescendant.getKey() &&
              selection.anchor.offset === lastDescendant.getTextContentSize()
            ) {
              container.insertAfter(lexical.$createParagraphNode());
            }
          }
        }
      }

      return false;
    };

    return lexicalUtils.mergeRegister(
      // Structure enforcing transformers for each node type. In case nesting structure is not
      // "Container > Title + Content" it'll unwrap nodes and convert it back
      // to regular content.
      editor.registerNodeTransform(CollapsibleContentNode, (node) => {
        const parent = node.getParent<ElementNode>();
        if (!$isCollapsibleContainerNode(parent)) {
          const children = node.getChildren<LexicalNode>();
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),

      editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
        const parent = node.getParent<ElementNode>();
        if (!$isCollapsibleContainerNode(parent)) {
          node.replace(
            lexical.$createParagraphNode().append(...node.getChildren<LexicalNode>()),
          );
          return;
        }
      }),

      editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
        const children = node.getChildren<LexicalNode>();
        if (
          children.length !== 2 ||
          !$isCollapsibleTitleNode(children[0]) ||
          !$isCollapsibleContentNode(children[1])
        ) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),

      // This handles the case when container is collapsed and we delete its previous sibling
      // into it, it would cause collapsed content deleted (since it's display: none, and selection
      // swallows it when deletes single char). Instead we expand container, which is although
      // not perfect, but avoids bigger problem
      editor.registerCommand(
        lexical.DELETE_CHARACTER_COMMAND,
        () => {
          const selection = lexical.$getSelection();
          if (
            !lexical.$isRangeSelection(selection) ||
            !selection.isCollapsed() ||
            selection.anchor.offset !== 0
          ) {
            return false;
          }

          const anchorNode = selection.anchor.getNode();
          const topLevelElement = anchorNode.getTopLevelElement();
          if (topLevelElement === null) {
            return false;
          }

          const container = topLevelElement.getPreviousSibling<LexicalNode>();
          if (!$isCollapsibleContainerNode(container) || container.getOpen()) {
            return false;
          }

          container.setOpen(true);
          return true;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        lexical.DELETE_CHARACTER_COMMAND,
        () => {
          const selection = lexical.$getSelection();
          if (
            !lexical.$isRangeSelection(selection) ||
            !selection.isCollapsed() ||
            selection.anchor.offset !== 0
          ) {
            return false;
          }

          const anchorNode = selection.anchor.getNode();
          if (!$isCollapsibleTitleNode(anchorNode)) {
            return false;
          }

          if (anchorNode.getTextContentSize() !== 0) {
            return false;
          }
          anchorNode.getParent<CollapsibleContainerNode>()?.remove();

          return true;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),

      // When collapsible is the last child pressing down/right arrow will insert paragraph
      // below it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if trailing paragraph is accidentally deleted
      editor.registerCommand(
        lexical.KEY_ARROW_DOWN_COMMAND,
        onEscapeDown,
        lexical.COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        lexical.KEY_ARROW_RIGHT_COMMAND,
        onEscapeDown,
        lexical.COMMAND_PRIORITY_LOW,
      ),

      // When collapsible is the first child pressing up/left arrow will insert paragraph
      // above it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if leading paragraph is accidentally deleted
      editor.registerCommand(
        lexical.KEY_ARROW_UP_COMMAND,
        onEscapeUp,
        lexical.COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        lexical.KEY_ARROW_LEFT_COMMAND,
        onEscapeUp,
        lexical.COMMAND_PRIORITY_LOW,
      ),

      // Handling CMD+Enter to toggle collapsible element collapsed state
      editor.registerCommand(
        lexical.INSERT_PARAGRAPH_COMMAND,
        () => {
          // @ts-ignore
          const windowEvent: KeyboardEvent | undefined = editor._window?.event;

          if (
            windowEvent &&
            (windowEvent.ctrlKey || windowEvent.metaKey) &&
            windowEvent.key === 'Enter'
          ) {
            const selection = lexical.$getPreviousSelection();
            if (lexical.$isRangeSelection(selection) && selection.isCollapsed()) {
              const parent = lexicalUtils.$findMatchingParent(
                selection.anchor.getNode(),
                (node) => lexical.$isElementNode(node) && !node.isInline(),
              );

              if ($isCollapsibleTitleNode(parent)) {
                const container = parent.getParent<ElementNode>();
                if ($isCollapsibleContainerNode(container)) {
                  container.toggleOpen();
                  lexical.$setSelection(selection.clone());
                  return true;
                }
              }
            }
          }

          return false;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_COLLAPSIBLE_COMMAND,
        () => {
          editor.update(() => {
            const title = $createCollapsibleTitleNode();
            lexicalUtils.$insertNodeToNearestRoot(
              $createCollapsibleContainerNode(true).append(
                title,
                $createCollapsibleContentNode().append(lexical.$createParagraphNode()),
              ),
            );
            title.select();
          });
          return true;
        },
        lexical.COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return null;
}