import RouterContext from './routerContext';

export function Route(props) {
  const {component: Component, path: componentPath} = props;
  
  return (
    <RouterContext.Consumer>
      {(path) => {
        return componentPath === path ? <Component /> : null;
      }}
    </RouterContext.Consumer>
  );
}

export default Route;