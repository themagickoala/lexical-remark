import React, { HTMLAttributes, useEffect, useRef } from 'react';

import { joinClasses } from '../../../utils/join-classes';
import { useEditorContext } from '../../context/editor-context';

type EditorMarkdownViewProps = Omit<HTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  className?: string;
  onChange?: (value: string) => void;
};

export const EditorMarkdownView = ({ className = '', onChange }: EditorMarkdownViewProps) => {
  const { markdownValue, setMarkdownValue } = useEditorContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // istanbul ignore next: height/clientHeight/scrollHeight in JestDOM is always 0
  const onTextAreaChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { scrollHeight, style, value: markdown },
  }) => {
    style.height = 'inherit';
    style.height = `${Math.max(160, scrollHeight)}px`;
    setMarkdownValue(markdown);
    onChange?.(markdown);
  };

  useEffect(() => {
    const clientHeight = textareaRef.current?.clientHeight || 0;
    const scrollHeight = textareaRef.current?.scrollHeight || 0;

    // istanbul ignore next: clientHeight/scrollHeight in JestDOM is always 0
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.max(160, scrollHeight)}px`;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0);
    }
  }, [textareaRef]);

  return (
    <textarea
      ref={textareaRef}
      className={joinClasses([
        'min-h-40 border-border-container bg-background-primary block w-full resize-none overflow-auto rounded-b-lg border p-4 pb-5 font-mono focus:outline-none',
        className,
      ])}
      data-testid="richtext-markdown"
      value={markdownValue}
      onChange={onTextAreaChange}
    />
  );
};
