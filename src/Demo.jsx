
function Demo() {

  const pushState = function() {
    window.history.pushState({}, null, '/pushState');
  }

  const replaceState = function() {
    window.history.pushState({}, null, '/replaceState');
  }

  const back = function() {
    window.history.back();
  }

  const forward = function() {
    window.history.forward();
  }

  const go = function() {
    window.history.go(-1);
  }

  return (
   <ul>
    <li onClick={pushState}>pushState</li>
    <li onClick={replaceState}>replaceState</li>
    <li onClick={back}>back</li>
    <li onClick={forward}>forward</li>
    <li onClick={go}>go</li>
    <a href='/reload'>点击重新加载页面</a>
   </ul>
  );
}


export default Demo;
