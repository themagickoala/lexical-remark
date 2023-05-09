import { $createLineBreakNode } from "lexical";
import { Break } from "mdast";
import { Handler } from "./index.js";

export const hardBreak: Handler<Break, true> = (_, { parent }) => {
  const lexicalNode = $createLineBreakNode();
  parent.append(lexicalNode);
};