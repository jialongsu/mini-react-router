# &lt;Route>

The Route component is perhaps the most important component in React Router to understand and learn to use well. Its most basic responsibility is to render some UI when its `path` matches the current URL.

Consider the following code:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/news">
        <NewsFeed />
      </Route>
    </div>
  </Router>,
  node
);
```

If the location of the app is `/` then the UI hierarchy will be something like:

```html
<div>
  <Home />
  <!-- react-empty: 2 -->
</div>
```

And if the location of the app is `/news` then the UI hierarchy will be:

```html
<div>
  <!-- react-empty: 1 -->
  <NewsFeed />
</div>
```

The "react-empty" comments are just implementation details of React's `null` rendering. But for our purposes, it is instructive. A Route is always technically "rendered" even though it's rendering `null`. When the `<Route>`'s `path` matches the current URL, it renders its `children` (your component).

If the same component is used as the child of multiple `<Route>`s at the same point in the component tree, React will see this as the same component instance and the component's state will be preserved between route changes. If this isn't desired, a unique `key` prop added to each route component will cause React to recreate the component instance when the route changes.

## Route render methods

The recommended method of rendering something with a `<Route>` is to use `children` elements, as shown above. There are, however, a few other methods you can use to render something with a `<Route>`. These are provided mostly for supporting apps that were built with earlier versions of the router before hooks were introduced.

- [`<Route component>`](#component)
- [`<Route render>`](#render-func)
- [`<Route children>` function](#children-func)

You should use only one of these props on a given `<Route>`. See their explanations below to understand the differences between them.

## Route props

All three [render methods](#route-render-methods) will be passed the same three route props

- [match](./match.md)
- [location](./location.md)
- [history](./history.md)

## component

A React component to render only when the location matches. It will be
rendered with [route props](#route-props).

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

// All route props (match, location and history) are available to User
function User(props) {
  return <h1>Hello {props.match.params.username}!</h1>;
}

ReactDOM.render(
  <Router>
    <Route path="/user/:username" component={User} />
  </Router>,
  node
);
```

When you use `component` (instead of `render` or `children`, below) the router uses [`React.createElement`](https://facebook.github.io/react/docs/react-api.html#createelement) to create a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) from the given component. That means if you provide an inline function to the `component` prop, you would create a new component every render. This results in the existing component unmounting and the new component mounting instead of just updating the existing component. When using an inline function for inline rendering, use the `render` or the `children` prop (below).

## render: func

This allows for convenient inline rendering and wrapping without the undesired remounting explained above.

Instead of having a new [React element](https://facebook.github.io/react/docs/rendering-elements.html) created for you using the [`component`](#component) prop, you can pass in a function to be called when the location matches. The `render` prop function has access to all the same [route props](#route-props) (match, location and history) as the `component` render prop.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

// convenient inline rendering
ReactDOM.render(
  <Router>
    <Route path="/home" render={() => <div>Home</div>} />
  </Router>,
  node
);

// wrapping/composing
// You can spread routeProps to make them available to your rendered Component
function FadingRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => (
        <FadeIn>
          <Component {...routeProps} />
        </FadeIn>
      )}
    />
  );
}

ReactDOM.render(
  <Router>
    <FadingRoute path="/cool" component={Something} />
  </Router>,
  node
);
```

**Warning:** `<Route component>` takes precedence over `<Route render>` so don't use both in the same `<Route>`.

## children: func

Sometimes you need to render whether the path matches the location or not. In these cases, you can use the function `children` prop. It works exactly like `render` except that it gets called whether there is a match or not.

The `children` render prop receives all the same [route props](#route-props) as the `component` and `render` methods, except when a route fails to match the URL, then `match` is `null`. This allows you to dynamically adjust your UI based on whether or not the route matches. Here we're adding an `active` class if the route matches

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  Route
} from "react-router-dom";

function ListItemLink({ to, ...rest }) {
  return (
    <Route
      path={to}
      children={({ match }) => (
        <li className={match ? "active" : ""}>
          <Link to={to} {...rest} />
        </li>
      )}
    />
  );
}

ReactDOM.render(
  <Router>
    <ul>
      <ListItemLink to="/somewhere" />
      <ListItemLink to="/somewhere-else" />
    </ul>
  </Router>,
  node
);
```

This could also be useful for animations:

```jsx
<Route
  children={({ match, ...rest }) => (
    {/* Animate will always render, so you can use lifecycles
        to animate its child in and out */}
    <Animate>
      {match && <Something {...rest}/>}
    </Animate>
  )}
/>
```

**Warning:** `<Route children>` takes precedence over both `<Route component>` and `<Route render>` so don't use more than one in the same `<Route>`.

## path: string | string[]

Any valid URL path or array of paths that [`path-to-regexp@^1.7.0`](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) understands.

```jsx
<Route path="/users/:id">
  <User />
</Route>
```

```jsx
<Route path={["/users/:id", "/profile/:id"]}>
  <User />
</Route>
```

Routes without a `path` _always_ match.

## exact: bool

When `true`, will only match if the path matches the `location.pathname` _exactly_.

```jsx
<Route exact path="/one">
  <About />
</Route>
```

| path   | location.pathname | exact   | matches? |
| ------ | ----------------- | ------- | -------- |
| `/one` | `/one/two`        | `true`  | no       |
| `/one` | `/one/two`        | `false` | yes      |

## strict: bool

When `true`, a `path` that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the `location.pathname`.

```jsx
<Route strict path="/one/">
  <About />
</Route>
```

| path    | location.pathname | matches? |
| ------- | ----------------- | -------- |
| `/one/` | `/one`            | no       |
| `/one/` | `/one/`           | yes      |
| `/one/` | `/one/two`        | yes      |

**Warning:** `strict` can be used to enforce that a `location.pathname` has no trailing slash, but in order to do this both `strict` and `exact` must be `true`.

```jsx
<Route exact strict path="/one">
  <About />
</Route>
```

| path   | location.pathname | matches? |
| ------ | ----------------- | -------- |
| `/one` | `/one`            | yes      |
| `/one` | `/one/`           | no       |
| `/one` | `/one/two`        | no       |

## location: object

A `<Route>` element tries to match its `path` to the current history location (usually the current browser URL).
However, a [`location`](location.md) with a different `pathname` can also be passed for matching.

This is useful in cases when you need to match a `<Route>` to a location other than the current history location, as shown in the [Animated Transitions](https://reactrouter.com/web/example/animated-transitions) example.

If a `<Route>` element is wrapped in a `<Switch>` and matches the location passed to the `<Switch>` (or the current history location), then the `location` prop passed to `<Route>` will be overridden by the one used by the `<Switch>` (given [here](https://github.com/remix-run/react-router/blob/main/packages/react-router/modules/Switch.js#L51)).

## sensitive: bool

When `true`, will match if the path is **case sensitive**.

```jsx
<Route sensitive path="/one">
  <About />
</Route>
```

| path   | location.pathname | sensitive | matches? |
| ------ | ----------------- | --------- | -------- |
| `/one` | `/one`            | `true`    | yes      |
| `/One` | `/one`            | `true`    | no       |
| `/One` | `/one`            | `false`   | yes      |
