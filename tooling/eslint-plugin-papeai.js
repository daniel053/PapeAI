// Local ESLint plugin (no external dependency).
//
// `restricted-modules` blocks imports of protected folders (core/vault,
// core/net). Unlike the built-in `no-restricted-imports`, it resolves relative
// specifiers against the importing file, so a sibling import such as
// `'../vault'` from `core/tutor` is caught too.
import path from 'node:path';

const PROTECTED_NAME = /(^|\/)core\/([a-z-]+)(\/|$)/;

function normalize(p) {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isInside(target, dir) {
  return target === dir || target.startsWith(dir + path.sep);
}

/** @type {import('eslint').Rule.RuleModule} */
const restrictedModules = {
  meta: {
    type: 'problem',
    docs: { description: 'Restrict which files may import protected modules.' },
    schema: [
      {
        type: 'object',
        properties: {
          forbidden: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                dir: { type: 'string' },
                name: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['dir', 'name', 'message'],
              additionalProperties: false,
            },
          },
        },
        required: ['forbidden'],
        additionalProperties: false,
      },
    ],
    messages: { forbidden: '{{message}}' },
  },

  create(context) {
    const forbidden = context.options[0].forbidden.map((f) => ({ ...f, dir: normalize(f.dir) }));
    const fileDir = path.dirname(context.filename);

    function findViolation(specifier) {
      if (specifier.startsWith('.')) {
        const target = normalize(path.resolve(fileDir, specifier));
        return forbidden.find((f) => isInside(target, f.dir));
      }
      // Non-relative specifiers (aliases such as '@/core/vault').
      const match = PROTECTED_NAME.exec(specifier);
      return match ? forbidden.find((f) => f.name === match[2]) : undefined;
    }

    function check(sourceNode) {
      if (!sourceNode) return;
      if (sourceNode.type !== 'Literal' || typeof sourceNode.value !== 'string') return;
      const violation = findViolation(sourceNode.value);
      if (violation) {
        context.report({
          node: sourceNode,
          messageId: 'forbidden',
          data: { message: violation.message },
        });
      }
    }

    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ExportAllDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source),
    };
  },
};

export default {
  meta: { name: 'eslint-plugin-papeai' },
  rules: { 'restricted-modules': restrictedModules },
};
