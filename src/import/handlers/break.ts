import lexical from "lexical";
import { Break } from "mdast";
import { Handler } from "../parser.js";

export const hardBreak: Handler<Break> = (_, parser) => {
  const lexicalNode = lexical.$createLineBreakNode();
  parser.append(lexicalNode);
};