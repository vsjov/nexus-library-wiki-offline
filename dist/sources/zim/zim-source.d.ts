import type { SourceProvider } from '../types.js';
declare const zimSource: SourceProvider & {
    getLanguages: () => Promise<string[]>;
    getVariants: (lang: string) => Promise<string[]>;
};
export default zimSource;
//# sourceMappingURL=zim-source.d.ts.map