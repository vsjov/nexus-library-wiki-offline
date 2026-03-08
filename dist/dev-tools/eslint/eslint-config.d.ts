import type { Linter } from 'eslint';
export declare const rulesCommon: Linter.RulesRecord;
export declare const rulesTs: Linter.RulesRecord;
type ModuleType = 'esm' | 'cjs';
/**
 * Main, configurable ESLint configuration
 *
 * @param options Configuration options
 * @param options.tsconfigPath Path to the TypeScript configuration file relative to packageDir
 * @param options.packageDir Absolute or relative path to the package directory
 * @param options.type Module type, either `cjs` for CommonJS or `esm` for ES Modules
 * @returns ESLint configuration object
 */
export declare const eslintConfig: (options: {
    tsconfigPath?: string | null;
    packageDir?: string;
    type?: ModuleType;
    ignores?: Linter.Config["ignores"];
}) => import("eslint/config").Config[];
export {};
//# sourceMappingURL=eslint-config.d.ts.map