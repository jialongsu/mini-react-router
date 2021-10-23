# &lt;Switch>

Renders the first child [`<Route>`](Route.md) or [`<Redirect>`](Redirect.md) that matches the location.

**How is this different than just using a bunch of `<Route>`s?**

`<Switch>` is unique in that it renders a route _exclusively_. In contrast, every `<Route>` that matches the location renders _inclusively_. Consider these routes:

```jsx
import { Route } from "react-router";

let routes = (
  <div>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </div>
);
```

If the URL is `/about`, then `<About>`, `<User>`, and `<NoMatch>` will all render because they all match the path. This is by design, allowing us to compose `<Route>`s into our apps in many ways, like sidebars and breadcrumbs, bootstrap tabs, etc.

Occasionally, however, we want to pick only one `<Route>` to render. If we're at `/about` we don't want to also match `/:user` (or show our "404" page). Here's how to do it with `Switch`:

```jsx
import { Route, Switch } from "react-router";

let routes = (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </Switch>
);
```

Now, if we're at `/about`, `<Switch>` will start looking for a matching `<Route>`. `<Route path="/about"/>` will match and `<Switch>` will stop looking for matches and render `<About>`. Similarly, if we're at `/michael` then `<User>` will render.

This is also useful for animated transitions since the matched `<Route>` is rendered in the same position as the previous one.

```jsx
let routes = (
  <Fade>
    <Switch>
      {/* there will only ever be one child here */}
      <Route />
      <Route />
    </Switch>
  </Fade>
);

let routes = (
  <Fade>
    {/* there will always be two children here,
        one might render null though, making transitions
        a bit more cumbersome to work out */}
    <Route />
    <Route />
  </Fade>
);
```

## location: object

A [`location`](./location.md) object to be used for matching children elements instead of the current history location (usually the current browser URL).

## children: node

All children of a `<Switch>` should be `<Route>` or `<Redirect>` elements. Only the first child to match the current location will be rendered.

`<Route>` elements are matched using their `path` prop and `<Redirect>` elements are matched using their `from` prop. A `<Route>` with no `path` prop or a `<Redirect>` with no `from` prop will always match the current location.

When you include a `<Redirect>` in a `<Switch>`, it can use any of the `<Route>`'s location matching props: `path`, `exact`, and `strict`. `from` is just an alias for the `path` prop.

If a `location` prop is given to the `<Switch>`, it will override the `location` prop on the matching child element.

```jsx
import { Redirect, Route, Switch } from "react-router";

let routes = (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>

    <Route path="/users">
      <Users />
    </Route>
    <Redirect from="/accounts" to="/users" />

    <Route>
      <NoMatch />
    </Route>
  </Switch>
);
```
