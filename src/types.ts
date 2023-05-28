import { Content, Parent } from 'mdast';

export type YouTube = {
  type: 'youtube';
  videoId: string;
};

export type Node = Parent | Content | YouTube;
