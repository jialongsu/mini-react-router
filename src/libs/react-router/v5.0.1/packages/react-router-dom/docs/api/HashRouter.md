# &lt;HashRouter>

A [`<Router>`](../../../react-router/docs/api/Router.md) that uses the hash portion of the URL (i.e. `window.location.hash`) to keep your UI in sync with the URL.

**IMPORTANT NOTE:** Hash history does not support `location.key` or `location.state`. In previous versions we attempted to shim the behavior but there were edge-cases we couldn't solve. Any code or plugin that needs this behavior won't work. As this technique is only intended to support legacy browsers, we encourage you to configure your server to work with `<BrowserHistory>` instead.

```jsx
<HashRouter
  basename={optionalString}
  getUserConfirmation={optionalFunc}
  hashType={optionalString}
>
  <App />
</HashRouter>
```

## basename: string

The base URL for all locations. A properly formatted basename should have a leading slash, but no trailing slash.

```jsx
<HashRouter basename="/calendar"/>
<Link to="/today"/> // renders <a href="#/calendar/today">
```

## getUserConfirmation: func

A function to use to confirm navigation. Defaults to using [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm).

```jsx
<HashRouter
  getUserConfirmation={(message, callback) => {
    // this is the default behavior
    const allowTransition = window.confirm(message);
    callback(allowTransition);
  }}
/>
```

## hashType: string

The type of encoding to use for `window.location.hash`. Available values are:

- `"slash"` - Creates hashes like `#/` and `#/sunshine/lollipops`
- `"noslash"` - Creates hashes like `#` and `#sunshine/lollipops`
- `"hashbang"` - Creates ["ajax crawlable"](https://developers.google.com/webmasters/ajax-crawling/docs/learn-more) (deprecated by Google) hashes like `#!/` and `#!/sunshine/lollipops`

Defaults to `"slash"`.

## children: node

A [single child element](https://facebook.github.io/react/docs/react-api.html#reactchildrenonly) to render.
