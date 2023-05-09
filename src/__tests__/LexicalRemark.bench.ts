import { bench } from 'vitest';
import lexicalCode from "@lexical/code";
import lexicalHeadless from "@lexical/headless";
import lexicalLink from "@lexical/link";
import lexicalList from "@lexical/list";
import lexicalRichText from "@lexical/rich-text";
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
  const editor = lexicalHeadless.createHeadlessEditor({
    nodes: [
      lexicalRichText.HeadingNode,
      lexicalList.ListNode,
      lexicalList.ListItemNode,
      lexicalRichText.QuoteNode,
      lexicalCode.CodeNode,
      lexicalCode.CodeHighlightNode,
      lexicalLink.LinkNode,
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