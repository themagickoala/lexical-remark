import { $getRoot,  RootNode } from "lexical";
import { Root } from "mdast";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { exportToRemarkTree, Handler } from "./handlers";

function lexicalToRemark(rootNode: RootNode, options: { handlers?: Record<string, Handler> } = {}) {
  return exportToRemarkTree(rootNode, options) as Root;
}

export function createRemarkExport(handlers?: Record<string, Handler>): () => string {
  return () => {
    const root = $getRoot();

    const remarkTree = lexicalToRemark(root, { handlers });

    const file = unified()
      .use(remarkStringify)
      .stringify(remarkTree);

    return String(file);
  };
}