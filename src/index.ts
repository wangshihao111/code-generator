import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { insertImport } from "./utils";
import fs from "fs";

const node = template("let a = <div>11</div>; return a;", {
  plugins: ["jsx"],
})();

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

insertImport(fileBody, { name: "React", source: "react" });
insertImport(fileBody, { name: ["Spin", "Input"], source: "antd" });

const root = t.file(t.program(fileBody));

fs.writeFileSync("./tests/test.tsx", generate(root).code, "utf8");
