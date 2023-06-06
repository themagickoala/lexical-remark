import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MutableRefObject } from 'react';

import { $createRemarkImport } from '../../../../src';

export const RegisterUpdateValueMethodPlugin = ({
  updateValueRef,
}: {
  updateValueRef?: MutableRefObject<((value: string) => void) | undefined>;
}) => {
  const [editor] = useLexicalComposerContext();

  if (updateValueRef && !updateValueRef.current) {
    updateValueRef.current = (value: string) =>
      editor.update(() => {
        $createRemarkImport()(value);
      });
  }

  return null;
};
