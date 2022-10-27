<h1 align="center">PteroJSLite</h1>
<h3 align="center"><strong>A lightweight alternative to PteroJS</strong></h3>
<p align="center"><a href="https://discord.com/invite/dwcfTjgn7S" type="_blank"><img src="https://img.shields.io/badge/discord-join-5865f2?style=for-the-badge&logo=discord&logoColor=white"></a> <img src="https://img.shields.io/badge/version-1.0.0-3572A5?style=for-the-badge"> <img src="https://img.shields.io/github/issues/PteroPackages/PteroJSLite.svg?style=for-the-badge"> <!--<a href="https://pteropackages.github.io/PteroJS/" type="_blank"><img src="https://img.shields.io/badge/docs-typedoc-e67e22?style=for-the-badge"></a>--></p>

## About

PteroJSLite is a lightweight alternative to [PteroJS](https://github.com/PteroPackages/PteroJS) using only objects and functions - absolutely no classes! This package is ideal if you want a high-level package without the abstractions and helper methods of larger libraries, while still getting same amount of functionality.

## Installing

You must have NodeJS v14 or above to use this package.

```
npm install @devnote-dev/pterojslite
yarn add @devnote-dev/pterojslite
```

## Compatibility

PteroJSLite supports version 1.7+ of the panel, and version 1.6+ of Wings.

## Getting Started

Application and Client API instances can be created using the `createApp` and `createClient` functions respectively. Both application keys (`ptla`) and client keys (`ptlc`) are currently supported.

```js
const { createApp } = require('@devnote-dev/pterojslite');

const app = createApp('https://your.panel.domain', 'ptla_your_api_key');

app.getServers().then(console.log);

(async () => {
    const users = await app.getUsers(); // returns an array of user objects
    console.log(users.filter(u => u.rootAdmin)); // filters out non-admin users
})();
```

```js
const { createClient } = require('@devnote-dev/pterojslite');

const client = createClient('https://your.panel.domain', 'ptlc_your_api_key');

client.getAccount().then(console.log);

(async () => {
    const activities = await app.getActivities(); // returns an array of activity logs
    console.log(activities.filter(a => a.isAPI)); // filters out non-API activities
})();
```

## Contributing

Please [create an issue](https://github.com/PteroPackages/PteroJSLite/issues) for issues or feature requests for the package.

1. [Fork this repo](https://github.com/PteroPackages/PteroJSLite/fork)!
2. Make a branch from `main` (`git branch -b <new-feature>`)
3. Commit your changes (`git commit -am "..."`)
4. Open a PR here (`git push origin <new-feature>`)

## Contributors

- [Devonte](https://github.com/devnote-dev) - Owner, maintainer
- [Tlkh40](https://github.com/tlkh40) - Code contributor

This repository is managed under the MIT license.

© 2021-2022 PteroPackages
