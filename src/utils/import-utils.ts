import * as t from "@babel/types";
import template from "@babel/template";

export const buildImportDefaultStatement = template(
  "import MODULE_NAME from 'MODULE';"
);

export const buildImportStatement = (names: string[], source: string) => {
  return t.importDeclaration(
    names.map((name) =>
      t.importSpecifier(t.identifier(name), t.identifier(name))
    ),
    t.stringLiteral(source)
  );
};

export type ImportConfig = {
  name: string | string[];
  source: string;
};

export function insertImport(body: t.Statement[], importConfig: ImportConfig) {
  const { name, source } = importConfig;
  const isDefaultImport = typeof name === "string";
  const found: t.ImportDeclaration = body.find(
    (node) => node.type === "ImportDeclaration" && node.source.value === source
  ) as t.ImportDeclaration;

  // 如果存在，向现有的import语句中添加，否则直接插入
  if (found) {
    // 如果是默认导入且没有找到默认导入已经存在
    if (isDefaultImport) {
      const exist = found.specifiers.find(
        (node) => node.type === "ImportDefaultSpecifier"
      );
      !exist &&
        found.specifiers.unshift(
          t.importDefaultSpecifier(t.identifier(<string>name))
        );
      return;
    } else {
      // 非默认导入
      (<string[]>name).forEach((name) => {
        if (
          !found.specifiers.find(
            (node: t.ImportSpecifier) => (node.imported as any).name === name
          )
        ) {
          found.specifiers.push(
            t.importSpecifier(t.identifier(name), t.identifier(name))
          );
        }
      });
    }
  } else {
    const importAst = isDefaultImport
      ? buildImportDefaultStatement({
          MODULE_NAME: name,
          MODULE: source,
        })
      : buildImportStatement(name as string[], source);
    body.unshift(importAst as t.ImportDeclaration);
  }
}
