// Imports
// -----------------------------------------------------------------------------
// NodeJS
import path from 'node:path'

// External
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import jsdoc from 'eslint-plugin-jsdoc'
import { defineConfig } from 'eslint/config'
import type { Linter } from 'eslint'

// Local
import { _dirname } from '../utils/dirname.js'

// Shims
const __dirname = _dirname(import.meta.url)


// ESLint rules
// -----------------------------------------------------------------------------
export const rulesCommon: Linter.RulesRecord = {
  // Code quality rules (ESLint)
  'no-console': 'off',
  'no-undef': 'warn',
  'prefer-promise-reject-errors': 'warn',
  'no-extra-boolean-cast': 'off',

  // JSDoc rules
  'jsdoc/check-alignment': 'error',
  'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],

  // Custom array and object formatting rules
  '@stylistic/array-element-newline': [
    'error',
    {
      consistent: true,
      multiline: true
    }
  ],
  '@stylistic/array-bracket-newline': ['error', 'consistent'],
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/object-curly-newline': [
    'error',
    {
      ObjectExpression: { multiline: true, consistent: true },
      ObjectPattern: { multiline: true, consistent: true },
      ImportDeclaration: { multiline: true, consistent: true },
      ExportDeclaration: { multiline: true, consistent: true },
    },
  ],
  '@stylistic/object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: true,
    },
  ],
  '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
  '@stylistic/comma-spacing': ['error', { before: false, after: true }],
  '@stylistic/comma-dangle': [
    'error',
    {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'only-multiline',
      importAttributes: 'never',
      dynamicImports: 'never',
      enums: 'never',
      generics: 'never',
      tuples: 'never'
    }
  ],
  '@stylistic/no-multiple-empty-lines': 'off',
  '@stylistic/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'comma',
        requireLast: true
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false
      }
    }
  ],
  '@stylistic/brace-style': 'off',
  '@stylistic/max-statements-per-line': ['error', { max: 2 }],
  '@stylistic/operator-linebreak': [
    'error',
    'after',
    { overrides: { '?': 'before', ':': 'before' } }
  ],
  '@stylistic/arrow-parens': ['error', 'as-needed'],
  '@stylistic/arrow-spacing': [
    'error',
    {
      before: true,
      after: true
    }
  ],
  '@stylistic/type-annotation-spacing': [
    'error',
    {
      before: false,
      after: true,
      overrides: {
        arrow: {
          before: true,
          after: true
        }
      }
    }
  ],
  '@stylistic/quote-props': ['error', 'as-needed'],

  // Padding and spacing rules
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
    { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
    { blankLine: 'always', prev: '*', next: 'multiline-expression' },
    { blankLine: 'always', prev: 'multiline-expression', next: '*' },
    { blankLine: 'always', prev: '*', next: 'multiline-const' },
    { blankLine: 'always', prev: 'multiline-const', next: '*' },
    { blankLine: 'always', prev: '*', next: 'multiline-let' },
    { blankLine: 'always', prev: 'multiline-let', next: '*' },
    { blankLine: 'always', prev: '*', next: 'multiline-var' },
    { blankLine: 'always', prev: 'multiline-var', next: '*' },
    { blankLine: 'always', prev: '*', next: 'try' },
    { blankLine: 'always', prev: 'try', next: '*' },
    { blankLine: 'always', prev: '*', next: 'return' },
  ],
  '@stylistic/padded-blocks': ['error', 'never'],
  '@stylistic/no-tabs': 'error',
  '@typescript-eslint/no-this-alias': 'off',
  '@typescript-eslint/ban-ts-comment': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
}

export const rulesTs: Linter.RulesRecord = {
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/ban-ts-comment': 'warn',
  '@typescript-eslint/no-empty-object-type': 'warn',
  '@typescript-eslint/no-this-alias': 'off',

  'jsdoc/check-types': 'warn',
  'jsdoc/require-returns-description': 'warn',
  'jsdoc/require-param-description': 'warn',
}


// ESLint Configurations
// -----------------------------------------------------------------------------
const globalIgnores: Linter.Config['ignores'] = [
  'node_modules',
  '**/public',
  '**/generated',
  '**/dist/',
  '**/*.old.*',
  '**/*.temp.*',
  '**/*.min.js',
  '**/*.min.js.map',
  '**/*.html',
  '**/*.json',
  '**/*.jsonc',
]

const globalPlugins: Linter.Config['plugins'] = {
  jsdoc,
  '@stylistic': stylistic,
}

type ModuleType = 'esm' | 'cjs'

const settingsJs = (type: ModuleType = 'esm') => {
  const files = type === 'esm'
    ? ['*.js', '**/*.js', '**/*.mjs', '**/*.d.ts']
    : ['*.js', '**/*.js', '**/*.cjs', '**/*.d.ts']

  const _settings: Linter.Config = {
    files,
    plugins: globalPlugins,
    rules: {
      ...rulesCommon,
    },
  }

  const settingsCommonJs: Linter.Config = {
    ..._settings,
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      parserOptions: { project: false },
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ..._settings.rules,
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'import/no-commonjs': 'off',
    },
  }

  const settingsEsm: Linter.Config = {
    ..._settings,
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: { project: false },
    },
  }

  return type === 'esm' ? settingsEsm : settingsCommonJs
}

const settingsTs = (
  tsconfigPath: string = './tsconfig.json',
  packageDir: string = __dirname
) => {
  const _settings: Linter.Config = {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.d.ts',
    ],
    plugins: globalPlugins,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: path.resolve(packageDir, tsconfigPath),
        tsconfigRootDir: path.resolve(packageDir),
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      ...rulesCommon,
      ...rulesTs,
    },
  }

  return _settings
}

/**
 * Main, configurable ESLint configuration
 *
 * @param options Configuration options
 * @param options.tsconfigPath Path to the TypeScript configuration file relative to packageDir
 * @param options.packageDir Absolute or relative path to the package directory
 * @param options.type Module type, either `cjs` for CommonJS or `esm` for ES Modules
 * @returns ESLint configuration object
 */
export const eslintConfig = (
  options: {
    tsconfigPath?: string | null,
    packageDir?: string,
    type?: ModuleType,
    ignores?: Linter.Config['ignores'],
  }
) => {
  const OPTIONS = {
    tsconfigPath: './tsconfig.json',
    type: 'esm' as ModuleType,
    ignores: [],
    ...options,
  }

  if (OPTIONS.tsconfigPath && !OPTIONS.packageDir) {
    throw new Error('packageDir is required for mainConfig options when using tsconfigPath')
  }

  return defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs.customize({
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
    }),
    {
      ignores: [
        ...globalIgnores,
        ...(OPTIONS.ignores ?? []),
      ]
    },
    settingsJs(OPTIONS.type),
    OPTIONS.tsconfigPath
      ? settingsTs(OPTIONS.tsconfigPath, OPTIONS.packageDir)
      : {},
  ])
}
