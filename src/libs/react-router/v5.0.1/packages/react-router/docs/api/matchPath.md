# matchPath

This lets you use the same matching code that `<Route>` uses except outside of the normal render cycle, like gathering up data dependencies before rendering on the server.

```js
import { matchPath } from "react-router";

const match = matchPath("/users/123", {
  path: "/users/:id",
  exact: true,
  strict: false
});
```

## pathname

The first argument is the pathname you want to match. If you're using
this on the server with Node.js, it would be `req.path`.

## props

The second argument are the props to match against, they are identical
to the matching props `Route` accepts. It could also be a string or
an array of strings as shortcut for `{ path }`:

```js
{
  path, // like /users/:id; either a single string or an array of strings
  strict, // optional, defaults to false
  exact, // optional, defaults to false
}
```

## returns

It returns an object when provided pathname does match `path` prop.

```js
matchPath("/users/2", {
  path: "/users/:id",
  exact: true,
  strict: true
});

//  {
//    isExact: true
//    params: {
//        id: "2"
//    }
//    path: "/users/:id"
//    url: "/users/2"
//  }
```

It returns `null` when provided pathname does not match `path` prop.

```js
matchPath("/users", {
  path: "/users/:id",
  exact: true,
  strict: true
});

//  null
```
