import remarkStringify from 'remark-stringify';
import remarkParse from 'remark-parse';
import { test, expect } from 'vitest';
import { CodeNode } from "@lexical/code";
import { createHeadlessEditor } from "@lexical/headless";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { createRemarkImport } from "../import/RemarkImport";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { createRemarkExport } from 'src/export/RemarkExport';
import { unified } from 'unified';

type TestCase = {
  name: string;
  markdown: string;
  html: string;
}

const testCases: TestCase[] = [
  {
    name: 'headings',
    markdown: '# A test\n\n## A test\n\n### A test\n\n#### A test\n\n##### A test\n\n###### A test\n',
    html: '<h1><span>A test</span></h1><h2><span>A test</span></h2><h3><span>A test</span></h3><h4><span>A test</span></h4><h5><span>A test</span></h5><h6><span>A test</span></h6>'
  },
  {
    name: 'blockquotes',
    markdown: '> This is a blockquote\n',
    html: '<blockquote><p><span>This is a blockquote</span></p></blockquote>'
  },
  {
    name: 'multi-line blockquotes',
    markdown: '> This is a blockquote\n> With multiple lines\n',
    html: '<blockquote><p><span>This is a blockquote</span><br><span>With multiple lines</span></p></blockquote>'
  },
  {
    name: 'links',
    markdown: '[A link to Google](https://google.com)\n',
    html: '<p><a href="https://google.com"><span>A link to Google</span></a></p>'
  },
  {
    name: 'lists',
    markdown: '1.  A list item\n\n2.  A list item\n\n3.  A list item\n',
    html: '<ol><li value="1"><span>A list item</span></li><li value="2"><span>A list item</span></li><li value="3"><span>A list item</span></li></ol>'
  },
];

testCases.forEach(({ name, markdown, html }) => {
  test(`can import "${name}"`, () => {
    const editor = createHeadlessEditor({
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        LinkNode,
      ],
    });

    editor.update(
      () => createRemarkImport()(markdown),
      {
        discrete: true,
      },
    );

    expect(
      editor.getEditorState().read(() => $generateHtmlFromNodes(editor)),
    ).toBe(html);
  });

  test(`can export "${name}"`, () => {
    const editor = createHeadlessEditor({
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        LinkNode,
      ],
    });

    editor.update(
      () => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().select();
        $insertNodes(nodes);
      },
      {
        discrete: true,
      },
    );

    expect(
      editor.getEditorState().read(() => createRemarkExport()()),
    ).toBe(markdown);
  });

  test(`regularRehyper "${name}"`, () => {
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .processSync(markdown);
    expect(String(file)).toBe(markdown);
  });
});