import lexical, { type RootNode } from 'lexical';
import { Root } from 'mdast';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { attachmentRemark } from '../plugins/remark-attachments.js';
import { youtubeRemark } from '../plugins/remark-youtube.js';
import { exportToRemarkTree, Handler } from './handlers/index.js';

function lexicalToRemark(rootNode: RootNode, options: { handlers?: Record<string, Handler> } = {}) {
  return exportToRemarkTree(rootNode, options) as Root;
}

export function serializeFromRemark(tree: Root) {
  const file = unified()
    .use(remarkStringify, {
      bullet: '-',
      fence: '`',
      fences: true,
      listItemIndent: 'one',
    })
    .stringify(tree);

  return String(file).trimEnd();
}

export function $convertToMarkdownViaRemark(options?: { handlers?: Record<string, Handler> }): string {
  const root = lexical.$getRoot();

  const remarkTree = lexicalToRemark(root, { handlers: options?.handlers });
  youtubeRemark()(remarkTree);
  attachmentRemark()(remarkTree);

  return serializeFromRemark(remarkTree);
}

/**
 * Creates a parsing function which converts a Lexical state to a markdown string via remark
 *
 * @param handlers A set of additional handlers designed to parse Lexical nodes into remark mdast nodes
 * @returns A function which returns the state of the active Lexical editor as a markdown string
 */
export function $createRemarkExport(options?: { handlers?: Record<string, Handler> }): () => string {
  return () => $convertToMarkdownViaRemark(options);
}
