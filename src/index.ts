import { $createRemarkExport } from './export/RemarkExport.js';
import { $createRemarkImport } from './import/RemarkImport.js';

/**
 * @deprecated Use `$createRemarkExport` instead.
 */
const createRemarkExport = $createRemarkExport;

/**
 * @deprecated Use `$createRemarkImport` instead.
 */
const createRemarkImport = $createRemarkImport;

export { createRemarkExport, $createRemarkExport };
export type { Handler as ExportHandler } from './export/handlers';

export { createRemarkImport, $createRemarkImport };
export type { Handler as ImportHandler } from './import/handlers';

export { ImageNode, $createImageNode, $isImageNode } from './extensions/image/node.js';
export type { ImagePayload, SerializedImageNode } from './extensions/image/node';
export { ImagePlugin, INSERT_IMAGE_COMMAND } from './extensions/image/plugin.js';

export { YouTubeNode, $createYouTubeNode, $isYouTubeNode } from './extensions/youtube/node.js';
export type { SerializedYouTubeNode } from './extensions/youtube/node';
export { YouTubePlugin, INSERT_YOUTUBE_COMMAND } from './extensions/youtube/plugin.js';
export { YOUTUBE_URL_REGEX } from './plugins/remark-youtube.js';

export {
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
  CollapsibleContainerNode,
} from './extensions/collapsible/container/node.js';
export {
  $createCollapsibleContentNode,
  $isCollapsibleContentNode,
  CollapsibleContentNode,
} from './extensions/collapsible/content/node.js';
export {
  $createCollapsibleTitleNode,
  $isCollapsibleTitleNode,
  CollapsibleTitleNode,
} from './extensions/collapsible/title/node.js';
export {
  CollapsiblePlugin,
  INSERT_COLLAPSIBLE_COMMAND,
  TOGGLE_COLLAPSIBLE_COMMAND,
} from './extensions/collapsible/plugin.js';