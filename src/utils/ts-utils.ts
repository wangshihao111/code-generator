import * as t from "@babel/types";

export const getTypeAnnotation = (name: string) =>
  t.tsTypeAnnotation(t.tsTypeReference(t.identifier(name)));

export const getTSIdentifier = (name: string, type?: string) => {
  const id = t.identifier(name);
  if (type) {
    id.typeAnnotation = getTypeAnnotation(type);
  }
  return id;
};
