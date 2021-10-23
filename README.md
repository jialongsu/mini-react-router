## 前言
本文并不是一步一步按照`react-router`的源码来分析的，而是通过阅读完`react-router`源码后，总结的一些核心点以及想法。

## 关于react-router
我们平时使用的都是`react-router-dom`，那`react-router-dom`与`react-router`有什么关系呢？

`react-router`是基于`history`的第三方插件来实现路由的核心功能，而`react-router-dom`是根据`react-router`的功能封装的`React`组件。

## 单页面的概念
我们平常使用react开发的应用都是单页面应用，单页面应用的特点是:只会在首次加载的时候，向服务器请求资源以加载页面，后续跳转页面是不会再向服务器请求资源，并且不会重新加载页面，会以切换组件重新渲染来达到页面跳转的目的。

## 页面刷新的场景
在浏览器中，可以通过不同的方式进行页面的跳转，总共可以分为三种方式：
1. 在js中发起页面跳转，改变浏览器的url
2. 用户通过点击浏览器的前进或后退按钮发生页面跳转
3. 用户修改浏览器url导致重新加载页面

## History API
通过上面，我们知道，要在react中发起页面的跳转，需要满足这几个条件:
1. 页面不会重新加载
2. 需要改变浏览器的url

`history`对象则提供了对浏览器会话历史的访问，总共5个Api：
1. pushState: 创建一个新的url，并跳转至该url
2. replaceState：修改当前url
3. back：返回后一个url
4. forward：返回前一个url
5. go：跳转到指定页面的url
具体可以看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

![QQ20211022-174901.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb0affcd825f4dc39691ea4db3df5929~tplv-k3u1fbpfcp-watermark.image?)

可以看到这些api的特点：可以修改浏览器的url，但是不会重新加载页面。

为了对比更明显在最后使用了a标签的href做了页面跳转，然后整个页面都重新加载了。

**注：在调用go方法时，如果没有传参则会与调用location.reload()一样，会重新加载页面。**

## 监听用户点击浏览器前进和后退按钮

在浏览器中，用户也可以通过与浏览器的交互来控制页面的跳转：点击浏览器前进和后退按钮。

那如何知道用户做了点击操作呢？

那就是监听`popstate`事件，具体请看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowEventHandlers/onpopstate)。

> 调用`history.pushState()`或者`history.replaceState()`不会触发popstate事件. `popstate`事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用`history.back()、history.forward()、history.go()`方法)，此外，a 标签的锚点也会触发该事件.

## 实现一个简易的react-router
从上面的分析，到这里我们大概知道了react-router的核心原理，使用history的Api改变浏览器的url，但是不会造成页面重载，同时使用切换组件的方式达到跳转页面的目的。

### 实现BrowserRouter

```js
function BrowserRouter(props) 
   const [path, setPath] = useState(() => {
     // 首次渲染，获取到对应的路由
     const {pathname} = window.location;
     return pathname || '/';
   });
  
    useEffect(function componentDidMount() {
    // 监听用户点击浏览器的前进，后退按钮跳转页面
    window.addEventListener('popstate', handlePopstate);

    return function componentWillUnmount() {
      window.removeEventListener('popstate', handlePopstate);
    }
  }, []);
  
  const handlePopstate = function(event) {
    const {pathname} = window.location;
    setPath(pathname);
  }
  
  return (
    <ul>
      <li>Home</li>
      <li>About</li>
      <li>Users</li>
    </ul>
  );
}
```
首先我们创建一个`BrowserRouter`的函数组件，使用`useEffect`模拟`componentDidMount`和`componentWillUnmount`，在其中监听`popstate`事件，用于监听用户点击浏览器的前进，后退按钮跳转页面。

在用户点击前进后退按钮的时候会触发`handlePopstate`函数，我们在里面通过location获取到路由名称`pathname`，然后更新对应的state。

现在路由取到了，那么需要根据路由渲染相对应的组件。

### 实现Route
那我们再封装一个Route组件对需要渲染的组件进行封装：

```js
export function Route(props) {
  const {component: Component, path: componentPath} = props;
  
  return componentPath === path ? <Component /> : null;
}
```
我们看到，在`Route`组件中，需要获取到最新的路由变量，如果我们使用props进行传递的话，当路由嵌套过深，这样的做法会太麻烦。这时我们需要使用`Context`进行props传递。

回过头，我们现在`BrowserRouter`中使用`Context`将`path`向下传递：

```js
import {createContext} from 'react';

const RouterContext = createContext();

function BrowserRouter(props) 
   const [path, setPath] = useState(() => {
     // 首次渲染，获取到对应的路由
     const {pathname} = window.location;
     return pathname || '/';
   });
  
   ...
  
  return (
    <RouterContext.Provider value={path}>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Users</li>
      </ul>
    </RouterContext.Provider>
  );
}
```
然后在`Route`组件中通过`RouterContext`拿到`path`：

```
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
```
这里有的同学可能会问，为什么不使用`useContext`？因为每当路由变化时，我们都需要重新渲染一个对应的组件，需要监听路由的变化。

可以看到，`Route`中的逻辑还是很简单，将传入的path与浏览器的path进行对比，如果相等就渲染当前组件。

现在我们将使用Route来注册路由：

```js
function BrowserRouter(props) 
   const [path, setPath] = useState(() => {
     // 首次渲染，获取到对应的路由
     const {pathname} = window.location;
     return pathname || '/';
   });
  
   ...
  
  return (
    <RouterContext.Provider value={path}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/users" component={Users} />
    </RouterContext.Provider>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
```

到这里，当浏览器url变化时，会触发`popstate`事件，更新`path`对应的`state`，`RouterContext.Consumer`的函数会被触发渲染相对应的组件。

然后我们在`BrowserRouter`中再添加`history`的api，以供js事件调用：


```js
import {createContext} from 'react';

const HistoryContext = createContext();

function BrowserRouter(props) {
  const [path, setPath] = useState(() => {
    // 首次渲染，获取到对应的路由
    const {pathname} = window.location;
    return pathname || '/';
  });

  ...

  // 点击ui跳转页面
  const push = function(path) {
    setPath(path);
    window.history.pushState({path}, null, path);
  }

  const goBack = function() {
    window.history.go(-1);
  }

  return (
    <RouterContext.Provider value={path}>
      <HistoryContext.Provider value={{
        push,
        goBack
      }}>
        {props.children}
      </HistoryContext.Provider>
    </RouterContext.Provider>
  );
}
```
可以看到，对`BrowserRouter`进行了独立的封装，然后我们新增了两个方法：`push`，`goBack`，当调用对应函数时，会传入路由名称，更新state，这异步的目的是触发重新渲染，`RouterContext.Consumer`会被触发渲染对应的组件，然后调用了`history`的`api`，修改了浏览器的url。

最后使用了新的`Context`将封装的路由方法向下传递。

在子组件中使用`useContext`就可以使用对应的路由方法。

到这里，一个简易的BrowserRouter就完成了。

### 实现HashRouter
对于`HashRouter`来说，和`BrowserRouter`的区别点，在于：
1. 监听的事件不同，`HashRouter`监听的是`hashchange`事件
2. 修改浏览器url的方式不同，`HashRouter`使用了`location.hash = 'xx'`

其它部分都是一样的，我们就不一一分析了，直接上源码：


```js
import {useEffect, useState} from 'react';
import RouterContext from './routerContext';
import HistoryContext from './historyContext';

// 自定义HashRouter
function HashRouter(props) {
  const [path, setPath] = useState(() => {
    const {hash} = window.location;
    if(hash) {
      return hash.slice(1);
    }
    return '/#/';
  });

  useEffect(function componentDidMount() {
    // 监听用户点击浏览器的前进，后退按钮跳转页面
    window.addEventListener('hashchange', handlePopstate);
    
    return function componentWillUnmount() {
      window.removeEventListener('hashchange', handlePopstate);
    }
  }, []);

  const handlePopstate = function(event) {
    const {hash} = window.location;
    setPath(hash.slice(1));
  }

  //history Api: https://developer.mozilla.org/zh-CN/docs/Web/API/History_API

  // 点击ui跳转页面
  const push = function(path) {
    window.location.hash = path;
  }

  const goBack = function() {
    window.history.go(-1);
  }

  return (
    <RouterContext.Provider value={path}>
      <HistoryContext.Provider value={{
        push,
        goBack
      }}>
        {props.children}
      </HistoryContext.Provider>
    </RouterContext.Provider>
  );
}

export default HashRouter;
```
[点击查看完整源码](https://github.com/jialongsu/mini-react-router)