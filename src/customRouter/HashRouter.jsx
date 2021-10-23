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

