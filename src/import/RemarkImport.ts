import lexical from 'lexical';
import { Content, Parent } from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { Handler, importFromRemarkTree } from './handlers/index.js';
import { remarkYoutube } from '../plugins/remark-youtube.js';

export function remarkLexify(this: any, handlers: Record<string, Handler> = {}) {
  const compiler = (tree: Parent | Content) => {
    return importFromRemarkTree(tree, handlers);
  };

  Object.assign(this, { Compiler: compiler });
}

export function $createRemarkImport(handlers?: Record<string, Handler>): (markdownString: string) => void {
  return (markdownString) => {
    const root = lexical.$getRoot();
    root.clear();

    const file = unified()
      .use(remarkParse)
      .use<any[]>(remarkYoutube)
      .use(remarkLexify, handlers)
      .processSync(markdownString);

    root.append(...(file.result as any));
  };
}
