import path from 'node:path';
import { parse } from '@babel/parser';
import MagicString from 'magic-string';

const IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

function walk(node, visitor) {
  if (!node || typeof node !== 'object') return;
  visitor(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) walk(child, visitor);
    } else if (value && typeof value === 'object' && typeof value.type === 'string') {
      walk(value, visitor);
    }
  }
}

function attributeName(attribute) {
  return attribute?.type === 'JSXAttribute' && attribute.name?.type === 'JSXIdentifier'
    ? attribute.name.name
    : null;
}

function stringAttributeValue(attribute) {
  if (!attribute?.value) return null;
  if (attribute.value.type === 'StringLiteral') return attribute.value.value;
  if (
    attribute.value.type === 'JSXExpressionContainer'
    && attribute.value.expression?.type === 'StringLiteral'
  ) {
    return attribute.value.expression.value;
  }
  return null;
}

function importedAssetForSource(sourceAttribute, importedAssets) {
  if (!sourceAttribute?.value) return null;
  if (sourceAttribute.value.type === 'StringLiteral') return sourceAttribute.value.value;
  const expression = sourceAttribute.value.type === 'JSXExpressionContainer'
    ? sourceAttribute.value.expression
    : null;
  if (expression?.type === 'Identifier') return importedAssets.get(expression.name) ?? null;
  return null;
}

function insertionForImage(node, importedAssets, config) {
  const attributes = new Map(
    node.attributes.map((attribute) => [attributeName(attribute), attribute]).filter(([name]) => name),
  );
  const loading = stringAttributeValue(attributes.get('loading'));
  const asset = importedAssetForSource(attributes.get('src'), importedAssets);
  const eager = loading === 'eager' || (!loading && asset && config.eagerAssetPattern.test(asset));
  const additions = [];

  if (!attributes.has('loading')) additions.push(`loading="${eager ? 'eager' : 'lazy'}"`);
  if (!attributes.has('decoding')) additions.push('decoding="async"');
  if (eager && !attributes.has('fetchPriority')) additions.push('fetchPriority="high"');

  return additions;
}

function insertionForVideo(node) {
  const names = new Set(node.attributes.map(attributeName).filter(Boolean));
  const additions = [];
  if (!names.has('preload')) additions.push('preload="metadata"');
  if (!names.has('playsInline')) additions.push('playsInline');
  return additions;
}

export function transformMediaJsx(code, id, loadingConfig) {
  const cleanId = id.split('?', 1)[0];
  if (!/\.[jt]sx$/i.test(cleanId) || cleanId.includes(`${path.sep}node_modules${path.sep}`)) {
    return null;
  }

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
      'objectRestSpread',
      'optionalChaining',
      'topLevelAwait',
      ...(cleanId.endsWith('.tsx') ? ['typescript'] : []),
    ],
  });
  const importedAssets = new Map();

  for (const statement of ast.program.body) {
    if (statement.type !== 'ImportDeclaration' || !IMAGE_EXTENSIONS.test(statement.source.value)) continue;
    for (const specifier of statement.specifiers) {
      if (specifier.local?.name) importedAssets.set(specifier.local.name, statement.source.value);
    }
  }

  const changes = [];
  walk(ast.program, (node) => {
    if (node.type !== 'JSXOpeningElement' || node.name?.type !== 'JSXIdentifier') return;
    let additions = [];
    if (node.name.name === 'img') {
      additions = insertionForImage(node, importedAssets, loadingConfig);
    } else if (node.name.name === 'video') {
      additions = insertionForVideo(node);
    }
    if (additions.length) changes.push({ position: node.name.end, text: ` ${additions.join(' ')}` });
  });

  if (!changes.length) return null;
  const output = new MagicString(code);
  for (const change of changes.sort((a, b) => b.position - a.position)) {
    output.appendLeft(change.position, change.text);
  }
  return {
    code: output.toString(),
    map: output.generateMap({ source: cleanId, includeContent: true, hires: true }),
  };
}
