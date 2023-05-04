import { $getRoot, LexicalNode, RootNode } from "lexical";
import { Root } from "mdast";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { Processor, TransformCallback, unified } from "unified";
import { VFile } from "vfile";
import { exportToRemarkTree, Handler } from "./handlers";

class RootNoodWithChildrenAndType extends RootNode {
  type: string;
  children: LexicalNode[];

  constructor(rootNode: RootNode) {
    super();
    this.type = rootNode.getType();
    this.children = rootNode.getChildren();
  }
}


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