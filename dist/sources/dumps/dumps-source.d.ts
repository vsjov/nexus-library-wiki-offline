import type { SourceProvider } from '../types.js';
declare const dumpsSource: SourceProvider & {
    getAvailableTypes: (lang: string) => Promise<string[]>;
};
export default dumpsSource;
//# sourceMappingURL=dumps-source.d.ts.map