#!/usr/bin/env node
// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { createRequire } from 'node:module';
// External
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pc from 'picocolors';
// Internal
import { DEFAULT_OUTPUT_DIR } from '../config/constants.js';
// Version
// -----------------------------------------------------------------------------
const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');
// Helpers
// -----------------------------------------------------------------------------
const exitWithError = (message) => {
    console.error(`\n${pc.red('Error:')} ${message}\n`);
    process.exit(1);
};
// Main
// -----------------------------------------------------------------------------
const main = async () => {
    const args = hideBin(process.argv);
    if (args.includes('--help') || args.includes('-h')) {
        process.stdout.write(`\n${pc.bold(name)} v${version} - ${description}\n\n`);
    }
    const argv = await yargs(args)
        .scriptName('wio')
        .version(version)
        .usage('wio [options]')
        .wrap(Math.min(100, process.stdout.columns ?? 100))
        .option('interactive', {
        alias: 'i',
        type: 'boolean',
        description: 'Run in interactive mode',
        default: false,
    })
        .option('type', {
        alias: 't',
        type: 'string',
        choices: ['zim', 'kiwix', 'dump'],
        description: 'Content type to download',
    })
        .option('lang', {
        alias: 'l',
        type: 'string',
        description: 'Language code (e.g. en, de, fr)',
    })
        .option('variant', {
        alias: 'v',
        type: 'string',
        description: 'ZIM variant (mini, nopic, maxi) or dump type (pages-articles, etc.)',
    })
        .option('os', {
        type: 'string',
        choices: ['linux', 'macos', 'win'],
        description: 'Target OS for Kiwix tools download (default: current OS)',
    })
        .option('arch', {
        type: 'string',
        choices: ['x86_64', 'arm64', 'aarch64', 'armv6', 'armv8', 'armhf', 'i586', 'i686'],
        description: 'Target CPU architecture for Kiwix tools download (default: current arch)',
    })
        .option('out', {
        alias: 'o',
        type: 'string',
        description: 'Output directory',
        default: DEFAULT_OUTPUT_DIR,
    })
        .option('list', {
        type: 'boolean',
        description: 'List available files instead of downloading',
        default: false,
    })
        .example('$0 -i', 'Run interactive download wizard')
        .example('$0 --type zim --lang en --variant maxi', 'Download English Wikipedia ZIM')
        .example('$0 --type kiwix', 'Download Kiwix reader for current platform')
        .example('$0 --list --type zim --lang en', 'List available English ZIM files')
        .help()
        .parse();
    const isInteractive = argv.interactive || (!argv.type && !argv.list);
    if (isInteractive) {
        const { runInteractive } = await import('./interactive.js');
        await runInteractive();
        return;
    }
    if (!argv.type) {
        exitWithError('--type is required in manual mode. Use --interactive or -i for guided mode.');
    }
    const { runManual } = await import('./manual.js');
    await runManual({
        type: argv.type,
        lang: argv.lang,
        variant: argv.variant,
        os: argv.os,
        arch: argv.arch,
        out: argv.out,
        list: argv.list,
    });
};
main().catch((err) => {
    exitWithError(err.message ?? String(err));
});
//# sourceMappingURL=cli.js.map