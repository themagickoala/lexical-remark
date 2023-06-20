/* eslint-disable import/no-extraneous-dependencies */
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { MutableRefObject, useState } from 'react';

import {
  $createRemarkExport,
  $createRemarkImport,
  AttachmentNode,
  AttachmentPlugin,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsiblePlugin,
  CollapsibleTitleNode,
  ImageNode,
  ImagePlugin,
  YouTubeNode,
  YouTubePlugin,
} from '../../../../src';
import { joinClasses } from '../../../utils/join-classes';
import { EditorProvider, useEditorContext } from '../../context/editor-context';
import { EditorEditablePlugin } from '../../plugins/editor-editable';
import { EditorLinkPlugin } from '../../plugins/editor-link';
import { EditorLinkPopoverPlugin } from '../../plugins/editor-link-popover';
import { RegisterUpdateValueMethodPlugin } from '../../plugins/register-update-value-method';
import { EditorMarkdownView } from '../editor-markdown-view';
import { EditorToolbar } from '../editor-toolbar';
import { editorTheme } from './editor.theme';
import TreeViewPlugin from '../../plugins/editor-tree-view/editor-tree-view.plugin';

export type EditorProps = {
  className?: string;
  contentClassName?: string;
  hasFocus?: boolean;
  isEditable?: boolean;
  markdownClassName?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  toolbarClassName?: string;
  toolbarStickyOffset?: number;
  updateValueRef?: MutableRefObject<((value: string) => void) | undefined>;
  value?: string;
};

export const EditorInner = ({
  className = '',
  contentClassName = '',
  hasFocus = false,
  isEditable = true,
  markdownClassName = '',
  onChange,
  placeholder,
  toolbarClassName,
  toolbarStickyOffset,
  updateValueRef,
  value = '',
}: EditorProps) => {
  const [floatingAnchorElement, setFloatingAnchorElement] = useState<HTMLDivElement>();
  const { isMarkdownMode } = useEditorContext();

  // istanbul ignore next
  const onError = (error: Error) => console.log(error);

  return (
    <section
      {...(isEditable ? { 'aria-label': 'Rich text editor' } : {})}
      className={joinClasses(['w-full', className], { relative: isEditable })}
    >
      <LexicalComposer
        initialConfig={{
          editable: isEditable,
          editorState: () => {
            $createRemarkImport()(value);
          },
          namespace: 'Editable',
          nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            LinkNode,
            HorizontalRuleNode,
            MarkNode,
            ImageNode,
            YouTubeNode,
            CollapsibleContainerNode,
            CollapsibleContentNode,
            CollapsibleTitleNode,
            AttachmentNode,
          ],
          onError,
          theme: editorTheme,
        }}
      >
        <>
          {isEditable && (
            <EditorToolbar
              className={toolbarClassName}
              stickyOffset={toolbarStickyOffset}
            />
          )}

          {isMarkdownMode && (
            <EditorMarkdownView
              className={joinClasses(['max-h-[50rem]', markdownClassName])}
              onChange={onChange}
            />
          )}

          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <div
                  ref={(element: HTMLDivElement) => setFloatingAnchorElement(element)}
                  className={joinClasses(contentClassName, {
                    'hidden': isMarkdownMode,
                    'relative p-4 bg-slate-900 border-x border-b border-border-container rounded-b-lg overflow-auto max-h-[50rem]':
                      isEditable,
                  })}
                >
                  <ContentEditable
                    className={joinClasses('prose-lexical prose', {
                      'editor min-h-[10rem] max-w-full outline-none': isEditable,
                    })}
                  />
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
              placeholder={
                !isMarkdownMode && isEditable && !!placeholder ? (
                  <div className="prose-lexical prose text-font-secondary-dark pointer-events-none absolute left-4 top-4 select-none pl-px">
                    {placeholder}
                  </div>
                ) : null
              }
            />
          </div>

          {isEditable && hasFocus && <AutoFocusPlugin />}

          <EditorEditablePlugin isEditable={isEditable} />
          <HistoryPlugin />
          <EditorLinkPlugin />
          <ListPlugin />
          <HorizontalRulePlugin />
          <ImagePlugin />
          <YouTubePlugin />
          <AttachmentPlugin />
          <CollapsiblePlugin />
          <EditorLinkPopoverPlugin anchorElement={floatingAnchorElement} />
          <RegisterUpdateValueMethodPlugin updateValueRef={updateValueRef} />
          <TreeViewPlugin />

          {!!onChange && (
            <OnChangePlugin
              ignoreSelectionChange={true}
              onChange={(editorState) => editorState.read(() => onChange($createRemarkExport()()))}
            />
          )}
        </>
      </LexicalComposer>
    </section>
  );
};

export const Editor = (props: EditorProps) => (
  <EditorProvider>
    <EditorInner {...props} />
  </EditorProvider>
);
