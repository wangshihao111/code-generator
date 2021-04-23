import * as t from "@babel/types";
import template from "@babel/template";

export const createExportDefault = (name: string) =>
  t.exportDefaultDeclaration(t.identifier(name));

export const insertExport = (body: t.Statement[], name: string, init?: any) => {
  const found = body.find(
    (node) =>
      node.type === "ExportNamedDeclaration" &&
      (node.specifiers.find(
        (n: t.ExportSpecifier) => (n.exported as any).name === name
      ) ||
        ((<t.VariableDeclaration>node.declaration)?.declarations[0].id as any)
          ?.name === name)
  );
  if (!found) {
    if (init) {
      body.push(
        t.exportNamedDeclaration(
          t.variableDeclaration("const", [
            t.variableDeclarator(t.identifier(name), init),
          ])
        )
      );
    } else {
      const canInsert = body.find(
        (node) =>
          node.type === "ExportNamedDeclaration" && node.specifiers?.length
      ) as t.ExportNamedDeclaration | undefined;

      if (canInsert) {
        !canInsert.specifiers.find(
          (node: t.ExportSpecifier) => node.local.name === name
        ) &&
          canInsert.specifiers.push(
            t.exportSpecifier(t.identifier(name), t.identifier(name))
          );
      } else {
        body.push(
          t.exportNamedDeclaration(null, [
            t.exportSpecifier(t.identifier(name), t.identifier(name)),
          ])
        );
      }
    }
  }
};
