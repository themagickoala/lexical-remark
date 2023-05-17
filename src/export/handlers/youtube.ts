import { Handler } from "./index.js";
import { YouTubeNode } from '../../extensions/youtube/node.js';
import { YouTube } from '../../types.js';

export const youtube: Handler<YouTubeNode> = (node) => {
  const remarkNode: YouTube = {
    type: 'youtube',
    videoId: node.getId(),
  };

  return remarkNode;
};