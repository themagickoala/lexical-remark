import { $createYouTubeNode } from "../../extensions/youtube/node.js";
import { YouTube } from "../../types.js";
import { Handler } from "../parser.js";

export const youtube: Handler<YouTube> = (node, parser) => {
  const lexicalNode = $createYouTubeNode(node.videoId);
  parser.append(lexicalNode);
};