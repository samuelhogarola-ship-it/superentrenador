import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

test("places the trainer signup CTA after the featured profiles section", () => {
  const sourceFile = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const sections: ts.JsxElement[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sourceFile) === "section") {
      sections.push(node);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  const hasAttribute = (section: ts.JsxElement, name: string, value: string) =>
    section.openingElement.attributes.properties.some(
      (attribute) =>
        ts.isJsxAttribute(attribute) &&
        attribute.name.getText(sourceFile) === name &&
        attribute.initializer?.getText(sourceFile) === `"${value}"`,
    );

  const featuredSection = sections.find((section) =>
    hasAttribute(section, "className", "bg-white px-5 py-16 text-[var(--ink)] sm:px-8 lg:px-12"),
  );
  const trainerCta = sections.find((section) =>
    hasAttribute(section, "aria-label", "Inscripción de entrenadores"),
  );

  assert.ok(featuredSection);
  assert.ok(trainerCta);
  assert.equal(featuredSection.parent, trainerCta.parent);
  assert.ok(ts.isJsxElement(featuredSection.parent));

  const siblingSections = featuredSection.parent.children.filter(ts.isJsxElement);
  assert.equal(siblingSections.indexOf(trainerCta), siblingSections.indexOf(featuredSection) + 1);
  assert.match(source, /href="\/registro\?intent=trainer"/);
  assert.match(source, /¿Eres entrenador\?/);
  assert.match(source, /Inscríbete/);
});
