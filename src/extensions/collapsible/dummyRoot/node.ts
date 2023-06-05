import type { LexicalNode } from 'lexical';

export class DummyRootNode {
  children: LexicalNode[] = [];

  append(...nodesToAppend: LexicalNode[]) {
    this.children.push(...nodesToAppend);
  }

  getChildren() {
    return this.children;
  }
}
