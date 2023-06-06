/* eslint-disable import/no-extraneous-dependencies */
import { $isAtNodeEnd } from '@lexical/selection';
import { ElementNode, RangeSelection, TextNode } from 'lexical';

export const getEditorSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
  const focus = selection.focus;
  const focusNode = selection.focus.getNode();
  const anchor = selection.anchor;
  const anchorNode = selection.anchor.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  return $isAtNodeEnd(selection.isBackward() ? focus : anchor) ? anchorNode : focusNode;
};
