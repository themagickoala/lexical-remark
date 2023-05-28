import { YouTubeNode } from '../../extensions/youtube/node.js';
import { YouTube } from '../../types.js';
import { Handler } from './index.js';

export const youtube: Handler<YouTubeNode> = (node) => {
  const remarkNode: YouTube = {
    type: 'youtube',
    videoId: node.getId(),
  };

  return remarkNode;
};
