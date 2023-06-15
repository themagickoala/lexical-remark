import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { createHeadlessEditor } from '@lexical/headless';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import lexical, { ParagraphNode, type EditorThemeClasses, TextNode } from 'lexical';
import { expect, test } from 'vitest';

import { $createRemarkExport } from '../export/RemarkExport';
import { DummyRootNode } from '../extensions/collapsible/dummyRoot/node.js';
import { ImageNode } from '../extensions/image/node';
import { $createRemarkImport } from '../import/RemarkImport';
import { CollapsibleContainerNode } from './../extensions/collapsible/container/node';
import { CollapsibleContentNode } from './../extensions/collapsible/content/node';
import { CollapsibleTitleNode } from './../extensions/collapsible/title/node';
import { $createYouTubeNode, YouTubeNode } from './../extensions/youtube/node';
import { $createAttachmentNode, $isAttachmentNode, AttachmentNode } from '../extensions/attachments/node';
import { YOUTUBE_URL_REGEX } from '../plugins/remark-youtube';

type TestCase = {
  html: string;
  markdown: string;
  name: string;
  only?: true;
  skipExport?: true;
};

const only = true;

/* eslint-disable sort-keys */
const testCases: TestCase[] = [
  {
    name: 'headings',
    markdown: '# A test\n\n## A test\n\n### A test\n\n#### A test\n\n##### A test\n\n###### A test',
    html: '<h1><span>A test</span></h1><h2><span>A test</span></h2><h3><span>A test</span></h3><h4><span>A test</span></h4><h5><span>A test</span></h5><h6><span>A test</span></h6>',
  },
  {
    name: 'blockquotes',
    markdown: '> This is a blockquote',
    html: '<blockquote><p><span>This is a blockquote</span></p></blockquote>',
  },
  {
    name: 'multi-line blockquotes',
    markdown: '> This is a blockquote\n> With multiple lines',
    html: '<blockquote><p><span>This is a blockquote</span><br><span>With multiple lines</span></p></blockquote>',
  },
  {
    name: 'links',
    markdown: '[A link to Google](https://google.com)',
    html: '<p><a href="https://google.com"><span>A link to Google</span></a></p>',
  },
  {
    name: 'lists',
    markdown: '1. A list item\n2. A list item\n3. A list item',
    html: '<ol><li value="1"><span>A list item</span></li><li value="2"><span>A list item</span></li><li value="3"><span>A list item</span></li></ol>',
  },
  {
    name: 'inline formatting',
    markdown: 'This is some *italic text* in a paragraph',
    html: '<p><span>This is some </span><i><em class="italic">italic text</em></i><span> in a paragraph</span></p>',
  },
  {
    name: 'inline code',
    markdown: 'This is some `inline code` in a paragraph',
    html: '<p><span>This is some </span><code><span class="code-inline">inline code</span></code><span> in a paragraph</span></p>',
  },
  {
    name: 'inline code',
    markdown: 'This is some ***bold and italic text*** in a paragraph',
    html: '<p><span>This is some </span><i><b><strong class="italic">bold and italic text</strong></b></i><span> in a paragraph</span></p>',
  },
  {
    name: 'code block',
    markdown: '```\nThis is a code block\n```',
    html: '<code class="code-block" spellcheck="false"><span>This is a code block</span></code>',
    skipExport: true, // $generateNodesFromDom sees this as inline code because it's not multiline
  },
  {
    name: 'multiline code block',
    markdown: '```\nThis is a code block\nWith multiple lines\n```',
    html: '<code class="code-block" spellcheck="false"><span>This is a code block</span><br><span>With multiple lines</span></code>',
  },
  {
    name: 'image',
    markdown: '![image info](./pictures/image.png)',
    html: '<p><img src="./pictures/image.png" alt="image info" width="inherit" height="inherit"></p>',
  },
  {
    name: 'image link',
    markdown: '[![image info](./pictures/image.png)](https://google.com)',
    html: '<p><a href="https://google.com"><img src="./pictures/image.png" alt="image info" width="inherit" height="inherit"></a></p>',
    skipExport: true, // Lexical parsing from html gets this wrong
  },
  {
    name: 'video',
    markdown: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    html: '<p><iframe data-lexical-youtube="dQw4w9WgXcQ" width="560" height="315" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true" title="YouTube video"></iframe></p>',
  },
  {
    name: 'collapsible',
    markdown: '<details><summary>Collapsible</summary>\nContent\n</details>',
    html: '<details open="false"><summary><span>Collapsible</span></summary><div data-lexical-collapsible-content="true"><p><span>Content</span></p></div></details>',
  },
  {
    name: 'collapsible empty title',
    markdown: '<details><summary></summary>\nContent\n</details>',
    html: '<details open="false"><summary></summary><div data-lexical-collapsible-content="true"><p><span>Content</span></p></div></details>',
  },
  {
    name: 'collapsible multi-line',
    markdown: '<details><summary>Collapsible</summary>\nContent\n</details>',
    html: '<details open="false"><summary><span>Collapsible</span></summary><div data-lexical-collapsible-content="true"><p><span>Content</span></p></div></details>',
  },
  {
    name: 'collapsible nested',
    markdown: '<details><summary>Collapsible</summary>\n# Content\n</details>',
    html: '<details open="false"><summary><span>Collapsible</span></summary><div data-lexical-collapsible-content="true"><h1><span>Content</span></h1></div></details>',
  },
  {
    name: 'collapsible complex',
    markdown:
      "<details><summary>Collapsible</summary>\n# This is some markdown content\n\n- I'm making a list\n- I'm checking it twice\n- I'm going to [find](https://google.com) out who's **naughty** and *nice*\n</details>",
    html: `<details open="false"><summary><span>Collapsible</span></summary><div data-lexical-collapsible-content="true"><h1><span>This is some markdown content</span></h1><ul><li value="1"><span>I'm making a list</span></li><li value="2"><span>I'm checking it twice</span></li><li value="3"><span>I'm going to </span><a href="https://google.com"><span>find</span></a><span> out who's </span><b><strong>naughty</strong></b><span> and </span><i><em class="italic">nice</em></i></li></ul></div></details>`,
  },
  {
    name: 'collapsible with previous content',
    markdown: 'Some text\n\n<details><summary>Collapsible</summary>\nContent\n</details>',
    html: '<p><span>Some text</span></p><details open="false"><summary><span>Collapsible</span></summary><div data-lexical-collapsible-content="true"><p><span>Content</span></p></div></details>',
  },
  {
    name: 'nested details',
    markdown:
      'Previous content\n\n<details><summary>Spoiler</summary>\nText\n\n<details><summary>View content</summary>\nMore text\n</details>\n</details>',
    html: '<p><span>Previous content</span></p><details open="false"><summary><span>Spoiler</span></summary><div data-lexical-collapsible-content="true"><p><span>Text</span></p><details open="false"><summary><span>View content</span></summary><div data-lexical-collapsible-content="true"><p><span>More text</span></p></div></details></div></details>',
  },
  {
    name: 'attachment',
    markdown: '[somefile.txt](/uploads/somefile.txt)',
    html: '<p><a href="/uploads/somefile.txt" download="somefile.txt"><span>📎 somefile.txt</span></a></p>',
    only
  },
];
/* eslint-enable sort-keys */

export const editorTheme: EditorThemeClasses = {
  code: 'code-block',
  text: {
    code: 'code-inline',
    italic: 'italic',
  },
};

const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  ImageNode,
  YouTubeNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  AttachmentNode,
];

testCases.forEach(({ html, markdown, name, only, skipExport }) => {
  (only ? test.only : test)(`can import "${name}"`, () => {
    const editor = createHeadlessEditor({
      nodes,
      theme: editorTheme,
    });

    editor.update(async () => $createRemarkImport({ attachmentPrefix: '/uploads'})(markdown), {
      discrete: true,
    });

    expect(editor.getEditorState().read(() => $generateHtmlFromNodes(editor))).toBe(html);
  });

  if (!skipExport) {
    (only ? test.only : test)(`can export "${name}"`, () => {
      const editor = createHeadlessEditor({
        nodes,
        theme: editorTheme,
      });

      editor.update(
        () => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(html, 'text/html');
          const generatedNodes = $generateNodesFromDOM(editor, dom);
          lexical.$getRoot().select();
          lexical.$insertNodes(generatedNodes);
        },
        {
          discrete: true,
        },
      );

      expect(editor.getEditorState().read(() => $createRemarkExport()())).toBe(markdown);
    });
  }
});
