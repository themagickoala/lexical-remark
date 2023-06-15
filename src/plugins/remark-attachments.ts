/* eslint-disable @typescript-eslint/no-use-before-define */
import { Link, Root } from 'mdast';
import { Plugin, Processor } from 'unified';
import { visit } from 'unist-util-visit';

import { Attachment, Node } from '../types';

/**
 * A remark plugin to enrich an mdast node tree by converting paragraph nodes containing only a Attachment url into Attachment nodes
 */
export const remarkAttachment: Plugin<[{ prefix: string }], string, Root> = (options: { prefix?: string }) => {
  return convertAttachmentLinks;

  function convertAttachmentLinks(tree: Node) {
    const filename = isAttachmentLinkNode(tree);
    if (filename) {
      tree.type = 'attachment';
      (tree as Attachment).filename = filename;
      delete (tree as Link).title;
      (tree as Attachment).children = [
        {
          type: 'text',
          value: `📎 ${filename}`,
        },
      ];
    }

    visit(tree, function (node) {
      const visitedFilename = isAttachmentLinkNode(node);
      if (visitedFilename) {
        node.type = 'attachment';
        (node as Attachment).filename = visitedFilename;
        delete (node as Link).title;
        (node as Attachment).children = [
          {
            type: 'text',
            value: `📎 ${visitedFilename}`,
          },
        ];
      }
    });
  }

  function isAttachmentLinkNode(node: Node) {
    if (
      options.prefix &&
      node.type === 'link' &&
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      (node as Link).url.startsWith(options.prefix)
    ) {
      return node.children[0].value;
    }

    return false;
  }
};

/**
 * A remark plugin to simplify an mdast node tree by converting Attachment nodes back to paragraph nodes
 */
export function attachmentRemark(this: any) {
  return convertToAttachmentLinks;
}

function convertToAttachmentLinks(tree: any) {
  if (tree.type === 'attachment') {
    tree.type = 'link';
    (tree as Link).children = [
      {
        type: 'text',
        value: (tree as Attachment).filename,
      },
    ];
    // @ts-expect-error casting to Attachment
    delete (tree as Attachment).filename;
  }

  visit(tree, function (node) {
    if (node.type === 'attachment') {
      node.type = 'link';
      (node as Link).children = [
        {
          type: 'text',
          value: (node as Attachment).filename,
        },
      ];
      // @ts-expect-error casting to Attachment
      delete (node as Attachment).filename;
    }
  });
}
