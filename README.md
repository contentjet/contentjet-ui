# contentjet-ui

![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)

A React based front end for contentjet, a powerful headless API-first CMS.

Contentjet is composed of 2 discreet applications, the backend API [contentjet-api][contentjet-api] and the frontend HTML user interface contentjet-ui (this repository).

For more information and hosting documentation please visit **[contentjet.github.io](contentjet)**.

## Development

### Requirements

* Node 8+
* NPM 5+

### Quick start

1. Install dependencies with `npm install`
2. Make sure you have [contentjet-api][1] running
3. Edit `src/index.ejs` and change the value of `window.contentjet.BASE_URL` to point to the url serving [contentjet-api][1]
4. Run development server with `npm start`

[contentjet]: https://contentjet.github.io
[contentjet-api]: https://github.com/contentjet/contentjet-api
