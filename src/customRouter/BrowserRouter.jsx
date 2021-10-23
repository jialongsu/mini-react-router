import { useEffect, useState} from 'react';
import RouterContext from './routerContext';
import HistoryContext from './historyContext';

// 单页面
// 页面刷新的场景：1.页面中点击跳转  2.用户点击浏览器的前进后退按钮  3.用户修改浏览器的url（重新刷新页面）
// 单页面的特点是：只会向服务器请求一次，加载成功后，之后的页面跳转不会再向服务器请求，而是以切换组件的渲染显示来达到页面跳转的目的

// 自定义BrowserRouter
function BrowserRouter(props) {
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

  //history Api: https://developer.mozilla.org/zh-CN/docs/Web/API/History_API

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

export default BrowserRouter;

