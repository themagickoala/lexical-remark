import { Node, YouTube } from "../types";
import { visit } from 'unist-util-visit'
import { Paragraph } from "mdast";

export const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:watch\?v=|embed\/|shorts\/|v\/)?)([\w\-]+)(\S+)?$/;

export function remarkYoutube(this: any) {
  return convertYoutubeParagraphs;
}

function convertYoutubeParagraphs(tree: Node) {
  const videoId = isYoutubeParagraphNode(tree);
  if (videoId) {
    tree.type = 'youtube';
    (tree as YouTube).videoId = videoId;
    // @ts-expect-error
    delete (tree as Paragraph).children;
  }

  visit(tree, function (node, _, parent) {
    const videoId = isYoutubeParagraphNode(node);
    if (videoId) {
      node.type = 'youtube';
      (node as YouTube).videoId = videoId;
      // @ts-expect-error
      delete (node as Paragraph).children;
    }
  });
}

function isYoutubeParagraphNode(node: Node) {
  if (
    node.type === 'paragraph' &&
    node.children.length === 1 &&
    node.children[0].type === 'text'
  ) {
    const match = node.children[0].value.match(YOUTUBE_URL_REGEX);
    return !!match && match[6];
  }

  return false;
}

export function youtubeRemark(this: any) {
  return convertToYoutubeParagraphs;
}

function convertToYoutubeParagraphs(tree: any) {
  if (tree.type === 'youtube') {
    tree.type = 'paragraph';
    (tree as Paragraph).children = [{
      type: 'text',
      value: `https://www.youtube.com/watch?v=${(tree as YouTube).videoId}`
    }]
    // @ts-expect-error
    delete (tree as YouTube).videoId;
  }

  visit(tree, function (node) {
    if (node.type === 'youtube') {
      node.type = 'paragraph';
      (node as Paragraph).children = [{
        type: 'text',
        value: `https://www.youtube.com/watch?v=${(node as YouTube).videoId}`
      }]
      // @ts-expect-error
      delete (node as YouTube).videoId;
    }
  });
};