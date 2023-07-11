import type { LexicalNode } from 'lexical';

export class DummyRootNode {
  children: LexicalNode[] = [];

  stack: LexicalNode[] = [];

  append(...nodesToAppend: LexicalNode[]) {
    this.children.push(...nodesToAppend);
  }

  getChildren() {
    return this.children;
  }

  setStack(stack: LexicalNode[]) {
    this.stack = stack;
  }

  getStack() {
    return this.stack;
  }
}
