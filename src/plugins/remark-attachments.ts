/* eslint-disable @typescript-eslint/no-use-before-define */
import { Link } from 'mdast';
import { visit } from 'unist-util-visit';

import { Attachment, Node } from '../types';

/**
 * A remark plugin to enrich an mdast node tree by converting paragraph nodes containing only a Attachment url into Attachment nodes
 */
export function remarkAttachment(this: any) {
  return convertAttachmentLinks;
}

function convertAttachmentLinks(tree: Node) {
  const filename = isAttachmentLinkNode(tree);
  if (filename) {
    tree.type = 'attachment';
    (tree as Attachment).filename = filename;
    // @ts-expect-error casting to Link
    delete (tree as Link).children;
    delete (tree as Link).title;
  }

  visit(tree, function (node) {
    const visitedFilename = isAttachmentLinkNode(node);
    if (visitedFilename) {
      node.type = 'attachment';
      (node as Attachment).filename = visitedFilename;
      // @ts-expect-error casting to Link
      delete (node as Link).children;
      delete (node as Link).title;
    }
  });
}

function isAttachmentLinkNode(node: Node) {
  if (
    node.type === 'link' &&
    node.children.length === 1 &&
    node.children[0].type === 'text' &&
    (node as Link).title === 'attachment'
  ) {
    return node.children[0].value;
  }

  return false;
}

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
      (node as Link).title = 'attachment';
      // @ts-expect-error casting to Attachment
      delete (node as Attachment).filename;
    }
  });
}
