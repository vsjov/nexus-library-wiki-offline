# Nexus Library: Wikipedia Offline Downloader

A CLI tool for downloading all necessary files to use Wikipedia offline. Goal of
this project is to provide a single, user-friendly interface for obtaining
Wikipedia content in various formats, without needing to navigate multiple
websites or manually select files.

This will hopefully preserve knowledge and access to Wikipedia content for
future generations, even if the online site becomes unavailable or restricted in
certain regions.

Supports three content types:
- **ZIM archives** -- compressed Wikipedia snapshots for use with the Kiwix
  reader
- **Kiwix reader** -- the kiwix-serve binary for browsing ZIM files in a browser
- **Wikimedia database dumps** -- raw XML and SQL exports for advanced use cases


## Installation

**From npm (recommended):**
```bash
npm install -g nexus-library-wiki-offline
```

**From source:**
Ensure that you have [supported](./.nvmrc) NodeJS installed, then:
```bash
npm start
npm install -g .
```

After that, the `wio` command will be available in your terminal. Run `wio
--help` to see usage instructions.


## Usage

### Interactive mode

Run without arguments (or with `-i`) to start the guided download wizard:

```bash
wio
```

The wizard will ask:

1. What to download (ZIM, Kiwix reader, database dump)
2. Language and variant/type for each selected item
3. Output directory (default: `~/Downloads/wiki-offline/`)

### Manual mode

Specify options directly with flags:

```
wio --type <zim|kiwix|dump> [options]
```

**Options:**

| Flag            | Alias | Description                                                        | Default                    |
|-----------------|-------|--------------------------------------------------------------------|----------------------------|
| `--type`        | `-t`  | Content type: `zim`, `kiwix`, or `dump`                            | required                   |
| `--lang`        | `-l`  | Language code (e.g. `en`, `de`, `fr`)                              | none                       |
| `--variant`     | `-v`  | ZIM variant or dump type (see below)                               | none                       |
| `--os`          |       | Target OS for Kiwix tools: `linux`, `macos`, `win`                 | auto-detected              |
| `--arch`        |       | Target CPU arch: `x86_64`, `aarch64`, `arm64`, `armv6`, and others | auto-detected              |
| `--out`         | `-o`  | Output directory                                                   | `~/Downloads/wiki-offline` |
| `--list`        |       | List available files instead of downloading                        | false                      |
| `--interactive` | `-i`  | Run interactive wizard                                             | false                      |
| `--version`     |       | Print version and exit                                             |                            |
| `--help`        |       | Print help and exit                                                |                            |



## Content Types

### ZIM files (`--type zim`)

Wikipedia snapshots in the ZIM format, ready to use with Kiwix. Files are
downloaded from `download.kiwix.org`.

**Variants** (passed via `--variant`):

| Variant | Description                | Approximate size |
|---------|----------------------------|------------------|
| `maxi`  | Full Wikipedia with images | 80+ GB           |
| `nopic` | Wikipedia without images   | ~20 GB           |
| `mini`  | Small curated subset       | ~2 GB            |

**Examples:**

**Download the English Wikipedia without images**
```bash
wio --type zim --lang en --variant nopic
```

**List all available German ZIM files**
```bash
wio --list --type zim --lang de
```
**Download to a custom directory**
```bash
wio --type zim --lang fr --variant mini --out /data/wiki
```

### Kiwix reader (`--type kiwix`)

Downloads the `kiwix-tools` binary package for the current platform. The
included `kiwix-serve` binary lets you serve ZIM files over HTTP and browse
them in any web browser.

The platform and architecture are detected automatically. Override them with
`--os` and `--arch` if cross-downloading for a different machine.

You can start a local Wikipedia server with:

```bash
kiwix-serve wikipedia_en_all_nopic_2024-11.zim
```

Then open `http://localhost:8080` in your browser.

**Examples:**

**Download Kiwix tools for the current platform**
```bash
wio --type kiwix
```

**Download Kiwix tools for a specific platform**
```bash
wio --type kiwix --os linux --arch aarch64
```

### Database dumps (`--type dump`)

Raw Wikipedia exports from `dumps.wikimedia.org`. Useful for data analysis,
research, or building custom search indexes.

**Available dump types** (passed via `--variant`):

| Type                 | Description                                  |
|----------------------|----------------------------------------------|
| `pages-articles`     | All article text in XML format (recommended) |
| `pages-meta-current` | Articles with full metadata                  |
| `abstract`           | Short article abstracts                      |
| `all-titles`         | Plain list of all article titles             |
| `pagelinks`          | Page link graph (SQL)                        |
| `categorylinks`      | Category membership data (SQL)               |
| `stub-meta-history`  | Revision history stubs                       |

**Examples:**

**Download English article text**
```bash
wio --type dump --lang en --variant pages-articles
```

**List available dumps for Spanish Wikipedia**
```bash
wio --list --type dump --lang es
```

## Download Behavior

- Files are saved with a `.part` extension while downloading. The extension is
  removed on successful completion.
- If a `.part` file already exists, the download resumes from where it left
  off using HTTP range requests.
- On network errors, the download retries up to 3 times with exponential
  backoff (1 s, 2 s, 4 s).
- A progress bar is shown for each file, displaying percentage, downloaded
  size, speed, and estimated time remaining. If the server does not return a
  content length, size and percentage are not shown.
- Downloaded files are created with mode `0600` (owner read/write only).



## Security

The tool enforces several protections when making HTTP requests:

- **HTTPS only** — all source URLs and redirects must use HTTPS. HTTP
  redirects (protocol downgrade attacks) are rejected.
- **Private IP rejection** — redirects to loopback (`127.x.x.x`, `::1`),
  private (`10.x`, `172.16–31.x`, `192.168.x`), and link-local
  (`169.254.x.x`) addresses are blocked.
- **Response size cap** — HTML listing responses are capped at 10 MB to
  prevent memory exhaustion from malicious servers.
- **Path traversal protection** — filenames from remote listings are validated
  before being written to disk; names containing `/`, `\`, or `..` are
  rejected.



## Project Structure

```
src/
  cli/
    cli.ts                  Entry point — parses flags, routes to interactive or manual mode
    interactive.ts          Interactive mode using @inquirer/prompts
    manual.ts               Manual mode — validates args, lists or downloads
    run-list.ts             Lists available files for a content type
    run-download.ts         Resolves and downloads a file for a given type
    prompts/
      prompt-content-types.ts  Prompts for content type selection
      prompt-zim-selection.ts  Prompts for language and ZIM variant
      prompt-kiwix-selection.ts Prompts for OS and architecture
      prompt-dumps-selection.ts Prompts for language and dump type
    utils/
      expand-tilde.ts       Expands ~/path to an absolute path
      format-bytes.ts       Formats byte counts as human-readable strings
      format-variant-label.ts  Human-readable ZIM variant labels
      format-dump-type-label.ts Human-readable dump type labels
      print-table.ts        Prints an aligned table to stdout
      detect-platform.ts    Detects OS and CPU arch for Kiwix binary selection
  config/
    constants.ts            Base URLs, timeouts, retry limits, default output directory
    languages.ts            Map of language codes to display names
    validate-url.ts         URL safety validation (HTTPS enforcement, private IP rejection)
  sources/
    types.ts                Shared types: SourceEntry, SourceProvider, ContentType
    fetch-html.ts           HTTP utility for fetching directory listing pages
    create-cached-fetcher.ts Caches the result of an async fetcher after the first call
    parse-size-text.ts      Parses human-readable size strings (e.g. "1.2G") to bytes
    zim/
      zim-source.ts         Fetches and filters ZIM file listings
      parse-zim-listing.ts  Parses Apache autoindex HTML into SourceEntry[]
      extract-languages.ts  Extracts unique language codes from ZIM entries
      extract-variants.ts   Extracts size variants for a given language
    kiwix/
      kiwix-source.ts       Fetches Kiwix tools releases, resolves platform binary
      parse-kiwix-listing.ts Parses Kiwix release listing HTML
      extract-latest-version.ts Selects the highest version from a list of entries
    dumps/
      dumps-source.ts       Fetches Wikimedia dump listings
      parse-dump-listing.ts Parses dump index HTML into SourceEntry[]
      filter-dumps-by-type.ts Filters dump entries by known type patterns
      extract-dump-types.ts Extracts recognised dump type identifiers
      dump-patterns.ts      Regex patterns for known dump file types
  download/
    download-engine.ts      Orchestrates download with resume, retry, and progress
    download-file-once.ts   Single streaming HTTP GET with Range header support
    get-content-length.ts   Reads Content-Length via HEAD request
    resolve-redirects.ts    Follows redirects (with SSRF validation) to the final URL
    progress-reporter.ts    cli-progress bar wrapper
```


## Development

**Install dependencies:**
```bash
npm install
```

**Run tests:**
```bash
npm test
npm run test:watch
```

**Build:**
```bash
npm run build
```

**Lint:**
```bash
npm run lint
npm run lint:fix
```

**Run locally after build:**
```bash
node dist/cli/cli.js --help
```

**Install as a global CLI tool:**
```bash
npm install -g .
wio --help
```


## Supported Languages

The interactive mode and `--list` output shows display names for the most
common Wikipedia languages. Any language code available on Kiwix or
dumps.wikimedia.org can be used with `--lang`, even if it is not in the
built-in list.

Common codes: `en` (English), `sr` (Serbian), `de` (German), `fr` (French), `es`
(Spanish), `it` (Italian), `pt` (Portuguese), `ru` (Russian), `ja` (Japanese),
`zh` (Chinese), `ar` (Arabic).

## Author
Vladimir Jovanović ([vsjov](https://github.com/vsjov)) 2026.
