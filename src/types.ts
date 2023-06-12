import { Content, Parent } from 'mdast';

export type YouTube = {
  type: 'youtube';
  videoId: string;
};

export type Attachment = {
  filename: string;
  type: 'attachment';
  url: string;
};

export type Node = Parent | Content | YouTube | Attachment;
