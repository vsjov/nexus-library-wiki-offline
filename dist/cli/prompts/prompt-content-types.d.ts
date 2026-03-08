/**
 * Flags indicating which content types the user selected in the initial checkbox prompt.
 */
export type SelectedContent = {
    /** Whether the user selected the ZIM archive download option. */
    zim: boolean;
    /** Whether the user selected the Kiwix tools download option. */
    kiwix: boolean;
    /** Whether the user selected the database dump download option. */
    dump: boolean;
};
/**
 * Presents a checkbox prompt for selecting content types (ZIM, Kiwix, Dumps).
 *
 * @returns Object with boolean flags for each selected content type.
 */
declare const promptContentTypes: () => Promise<SelectedContent>;
export default promptContentTypes;
//# sourceMappingURL=prompt-content-types.d.ts.map