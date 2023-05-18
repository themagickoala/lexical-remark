import { ElementFormatType, NodeKey } from "lexical";
import lexicalBlockWithAlignableContents from "@lexical/react/LexicalBlockWithAlignableContents.js";

type YouTubeComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoID: string;
}>;

export const YouTubeComponent = ({
  className,
  format,
  nodeKey,
  videoID,
}: YouTubeComponentProps) => {
  return (
    <lexicalBlockWithAlignableContents.BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${videoID}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={true}
        title="YouTube video"
      />
    </lexicalBlockWithAlignableContents.BlockWithAlignableContents>
  );
}