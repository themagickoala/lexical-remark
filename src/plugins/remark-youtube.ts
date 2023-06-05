/* eslint-disable @typescript-eslint/no-use-before-define */
import { Paragraph } from 'mdast';
import { visit } from 'unist-util-visit';

import { Node, YouTube } from '../types';

/**
 * A regular expression to detect a YouTube url and parse out the video id as the sixth capture group
 *
 * @example
 * function getVideoId(value: string) {
 *   const match = value.match(YOUTUBE_URL_REGEX);
 *   return !!match ? match[6] : null;
 * }
 */
export const YOUTUBE_URL_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:watch\?v=|embed\/|shorts\/|v\/)?)([\w\-]+)(\S+)?$/;

/**
 * A remark plugin to enrich an mdast node tree by converting paragraph nodes containing only a YouTube url into YouTube nodes
 */
export function remarkYoutube(this: any) {
  return convertYoutubeParagraphs;
}

function convertYoutubeParagraphs(tree: Node) {
  const videoId = isYoutubeParagraphNode(tree);
  if (videoId) {
    tree.type = 'youtube';
    (tree as YouTube).videoId = videoId;
    // @ts-expect-error casting to Paragraph
    delete (tree as Paragraph).children;
  }

  visit(tree, function (node) {
    const visitedVideoId = isYoutubeParagraphNode(node);
    if (visitedVideoId) {
      node.type = 'youtube';
      (node as YouTube).videoId = visitedVideoId;
      // @ts-expect-error casting to Paragraph
      delete (node as Paragraph).children;
    }
  });
}

function isYoutubeParagraphNode(node: Node) {
  if (node.type === 'paragraph' && node.children.length === 1 && node.children[0].type === 'text') {
    const match = node.children[0].value.match(YOUTUBE_URL_REGEX);
    return !!match && match[6];
  }

  return false;
}

/**
 * A remark plugin to simplify an mdast node tree by converting YouTube nodes back to paragraph nodes
 */
export function youtubeRemark(this: any) {
  return convertToYoutubeParagraphs;
}

function convertToYoutubeParagraphs(tree: any) {
  if (tree.type === 'youtube') {
    tree.type = 'paragraph';
    (tree as Paragraph).children = [
      {
        type: 'text',
        value: `https://www.youtube.com/watch?v=${(tree as YouTube).videoId}`,
      },
    ];
    // @ts-expect-error casting to Youtube
    delete (tree as YouTube).videoId;
  }

  visit(tree, function (node) {
    if (node.type === 'youtube') {
      node.type = 'paragraph';
      (node as Paragraph).children = [
        {
          type: 'text',
          value: `https://www.youtube.com/watch?v=${(node as YouTube).videoId}`,
        },
      ];
      // @ts-expect-error casting to Youtube
      delete (node as YouTube).videoId;
    }
  });
}
