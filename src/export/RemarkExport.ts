import lexical, { type RootNode } from 'lexical';
import { Root } from "mdast";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { exportToRemarkTree, Handler } from "./handlers/index.js";
import { youtubeRemark } from '../plugins/remark-youtube.js';

function lexicalToRemark(rootNode: RootNode, options: { handlers?: Record<string, Handler> } = {}) {
  return exportToRemarkTree(rootNode, options) as Root;
}

export function serializeFromRemark(tree: Root) {
  const file = unified()
    .use(remarkStringify, { fences: true, fence: '`' })
    .stringify(tree);

  return String(file).trimEnd();
}

export function $createRemarkExport(handlers?: Record<string, Handler>): () => string {
  return () => {
    const root = lexical.$getRoot();

    const remarkTree = lexicalToRemark(root, { handlers });
    youtubeRemark()(remarkTree);

    return serializeFromRemark(remarkTree);
  };
}