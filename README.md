# semantic-release-zowe-cli

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a Zowe CLI component.

[![Build Status](https://github.com/t1m0thyj/semantic-release-zowe-cli/workflows/Test/badge.svg)](https://github.com/t1m0thyj/semantic-release-zowe-cli/actions?query=workflow%3ATest+branch%3Amaster)
<!-- [![npm latest version](https://img.shields.io/npm/v/semantic-release-zowe-cli/latest.svg)](https://www.npmjs.com/package/semantic-release-zowe-cli)
[![npm next version](https://img.shields.io/npm/v/semantic-release-zowe-cli/next.svg)](https://www.npmjs.com/package/semantic-release-zowe-cli)
[![npm beta version](https://img.shields.io/npm/v/semantic-release-zowe-cli/beta.svg)](https://www.npmjs.com/package/semantic-release-zowe-cli) -->

| Step               | Description |
|--------------------|-------------|
| `verifyConditions` | Convert the semver `level` property in branch config into a `range` value that the `verifyRelease` hook will validate. |
| `analyzeCommits`   | Check if version was already bumped in package.json, or if one of the following labels was specified on a PR: release-major, release-minor, release-patch, no-release |
| `generateNotes`    | Extract release notes from the Recent Changes section of CHANGELOG.md. |
| `prepare`          | Update latest version number in CHANGELOG.md. |
| `success`          | Publish additional tags to NPM specified in `aliasTags` property of branch config. |

## Install

```bash
$ npm install semantic-release-zowe-cli -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "semantic-release-zowe-cli",
    "@semantic-release/npm",
    "@semantic-release/git"
  ]
}
```

<!-- ## Configuration -->
