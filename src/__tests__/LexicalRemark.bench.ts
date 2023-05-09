import { bench } from 'vitest';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { createHeadlessEditor } from "@lexical/headless";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { createRemarkImport } from "../import/RemarkImport";
import type { EditorThemeClasses } from 'lexical';
import fs from 'fs';
import path from 'path';

export const editorTheme: EditorThemeClasses = {
  code: 'code-block',
  text: {
    code: 'code-inline',
    italic: 'italic',
  },
};

const body = fs.readFileSync(path.join(__dirname, 'large_body.md'), 'utf8');

bench(`can export large text body`, () => {
  const editor = createHeadlessEditor({
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
    theme: editorTheme,
  });

  editor.update(
    () => createRemarkImport()(body),
    {
      discrete: true,
    },
  );
});