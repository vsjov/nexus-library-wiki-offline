// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Functions
// -----------------------------------------------------------------------------
/**
 * ES6 `__dirname` polyfill
 *
 * @param fileLocation - Use `import.meta.url`
 * @returns Directory path
 */
export const _dirname = (fileLocation) => {
    return dirname(fileURLToPath(fileLocation));
};
export default _dirname;
//# sourceMappingURL=dirname.js.map