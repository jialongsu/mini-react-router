import React from "react";
import { StaticRouter } from "react-router";
import { matchRoutes, renderRoutes } from "react-router-config";

import renderToStringStrict from "./utils/renderToStringStrict.js";

describe("integration", () => {
  it("generates the same matches in renderRoutes and matchRoutes", () => {
    const rendered = [];

    function Comp({ match, route: { routes } }) {
      rendered.push(match);
      return renderRoutes(routes);
    }

    const routes = [
      {
        path: "/pepper",
        component: Comp,
        routes: [
          {
            path: "/pepper/:type",
            component: Comp,
            routes: [
              {
                path: "/pepper/:type/scoville",
                component: Comp
              }
            ]
          }
        ]
      },

      {
        path: undefined,
        component: Comp,
        routes: [
          {
            path: "/ghost",
            component: Comp
          }
        ]
      }
    ];

    const pathname = "/pepper/jalepeno";
    const branch = matchRoutes(routes, pathname);

    renderToStringStrict(
      <StaticRouter location={pathname} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    );

    expect(branch.length).toEqual(2);
    expect(rendered.length).toEqual(2);
    expect(branch[0].match).toEqual(rendered[0]);
    expect(branch[1].match).toEqual(rendered[1]);
  });

  it("generates the same matches in renderRoutes and matchRoutes with pathless routes", () => {
    const rendered = [];

    function Comp({ match, route: { routes } }) {
      rendered.push(match);
      return renderRoutes(routes);
    }

    const routes = [
      {
        path: "/pepper",
        component: Comp,
        routes: [
          {
            path: "/pepper/:type",
            component: Comp,
            routes: [
              {
                path: "/pepper/:type/scoville",
                component: Comp
              }
            ]
          }
        ]
      },

      {
        path: undefined,
        component: Comp,
        routes: [
          {
            path: "/ghost",
            component: Comp
          }
        ]
      }
    ];

    const pathname = "/ghost";
    const branch = matchRoutes(routes, pathname);
    renderToStringStrict(
      <StaticRouter location={pathname} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    );
    expect(branch.length).toEqual(2);
    expect(rendered.length).toEqual(2);
    expect(branch[0].match).toEqual(rendered[0]);
    expect(branch[1].match).toEqual(rendered[1]);
  });

  it("generates the same matches in renderRoutes and matchRoutes with routes using exact", () => {
    const rendered = [];

    function Comp({ match, route: { routes } }) {
      rendered.push(match);
      return renderRoutes(routes);
    }

    const routes = [
      // should skip
      {
        path: "/pepper/habanero",
        component: Comp,
        exact: true
      },
      // should match
      {
        path: "/pepper",
        component: Comp,
        exact: true
      }
    ];

    const pathname = "/pepper";
    const branch = matchRoutes(routes, pathname);
    renderToStringStrict(
      <StaticRouter location={pathname} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    );
    expect(branch.length).toEqual(1);
    expect(rendered.length).toEqual(1);
    expect(branch[0].match).toEqual(rendered[0]);
  });

  it("generates the same matches in renderRoutes and matchRoutes with routes using exact + strict", () => {
    const rendered = [];

    function Comp({ match, route: { routes } }) {
      rendered.push(match);
      return renderRoutes(routes);
    }

    const routes = [
      // should match
      {
        path: "/pepper/",
        component: Comp,
        strict: true,
        exact: true,
        routes: [
          // should skip
          {
            path: "/pepper",
            component: Comp,
            strict: true,
            exact: true
          }
        ]
      }
    ];

    let pathname = "/pepper";
    let branch = matchRoutes(routes, pathname);

    renderToStringStrict(
      <StaticRouter location={pathname} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    );

    expect(branch.length).toEqual(0);
    expect(rendered.length).toEqual(0);

    pathname = "/pepper/";
    branch = matchRoutes(routes, pathname);

    renderToStringStrict(
      <StaticRouter location={pathname} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    );

    expect(branch.length).toEqual(1);
    expect(rendered.length).toEqual(1);
    expect(branch[0].match).toEqual(rendered[0]);
  });
});
