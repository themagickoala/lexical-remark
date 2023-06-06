import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export const EditorEditablePlugin = ({ isEditable = true }: { isEditable?: boolean }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editor.isEditable() !== isEditable) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  return null;
};
