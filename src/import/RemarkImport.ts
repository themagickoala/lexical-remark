import lexical from 'lexical';
import { Root } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { remarkAttachment } from '../plugins/remark-attachments.js';
import { remarkYoutube } from '../plugins/remark-youtube.js';
import { Handler, Parser } from './parser.js';

export function remarkLexify(this: any, handlers: Record<string, Handler> = {}) {
  const compiler = (tree: Root) => {
    const parser = new Parser(handlers);
    return parser.parse(tree).getChildren();
  };

  Object.assign(this, { Compiler: compiler });
}

export function $convertFromMarkdownViaRemark(
  markdownString: string,
  options?: {
    attachmentPrefix?: string;
    handlers?: Record<string, Handler>;
  },
): void {
  const root = lexical.$getRoot();
  root.clear();

  const file = unified()
    .use(remarkParse)
    .use(remarkYoutube)
    .use(remarkAttachment, { prefix: options?.attachmentPrefix ?? '' })
    .use(remarkLexify, options?.handlers)
    .processSync(markdownString);

  root.append(...(file.result as any));
}

/**
 * Creates a parsing function which converts a markdown string to a Lexical state via remark
 *
 * @param handlers A set of additional handlers designed to parse remark mdast nodes into Lexical nodes
 * @returns A function which accepts a string in markdown format and replaces the tree of the active editor
 * with the parsed Lexical nodes
 */
export function $createRemarkImport(options: {
  attachmentPrefix?: string;
  handlers?: Record<string, Handler>;
}): (markdownString: string) => void {
  return (markdownString) => {
    $convertFromMarkdownViaRemark(markdownString, options);
  };
}
