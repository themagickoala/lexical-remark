import { $createYouTubeNode } from "../../extensions/youtube/node.js";
import { YouTube } from "../../types.js";
import { Handler } from "./index.js";

export const youtube: Handler<YouTube> = (node, { parent }) => {
  const lexicalNode = $createYouTubeNode(node.videoId);
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};