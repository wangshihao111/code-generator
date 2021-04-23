import * as parser from "@babel/parser";
import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";
import fs from "fs";

export const buildImportStatement = template(
  "import MODULE_NAME from 'MODULE';"
);

function getImportStatement(opt: any) {
  const importStatement = buildImportStatement(opt);
  return Array.isArray(importStatement) ? importStatement : [importStatement];
}

const node = template("let a = <div>11</div>; return a;", {
  plugins: ["jsx"],
})();

// const fileBody = root.program.body;
const fileBody: t.Statement[] = [];

const componentName = t.identifier("Component");
componentName.typeAnnotation = t.tsTypeAnnotation(
  t.tsTypeReference(t.identifier("FC"))
);
const fcNode = t.variableDeclaration("const", [
  t.variableDeclarator(
    componentName,
    t.arrowFunctionExpression(
      [t.identifier("props")],
      t.blockStatement(node as any[])
    )
  ),
]);

fileBody.push(fcNode);
fileBody.push(t.exportDefaultDeclaration(t.identifier("Component")));

fileBody.unshift(
  ...getImportStatement({ MODULE_NAME: "React, { FC }", MODULE: "react" }),
  ...getImportStatement({ MODULE_NAME: "{ Button }", MODULE: "antd" })
);

const root = t.file(t.program(fileBody))

fs.writeFileSync("./tests/test.tsx", generate(root).code, "utf8");
