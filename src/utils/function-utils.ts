import * as t from "@babel/types";
import { getTSIdentifier } from ".";

type IdType = { name: string; type?: string };

export const createArrowFunction = (
  nameDef: IdType,
  params: IdType[] = [],
  content: t.Statement[]
) => {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      getTSIdentifier(nameDef.name, nameDef.type),
      t.arrowFunctionExpression(
        params.map((param) => getTSIdentifier(param.name, param.type)),
        t.blockStatement(content),
      )
    ),
  ]);
};
