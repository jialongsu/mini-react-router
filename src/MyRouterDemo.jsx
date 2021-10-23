import {
  BrowserRouter, 
  HashRouter, 
  Route, 
  Link,
  HistoryContext
} from './customRouter';
import { useContext } from 'react';

function Demo(props) {
  return (
    <HashRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/users" component={Users} />
    </HashRouter>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  const history = useContext(HistoryContext);

  return <h2 onClick={() => history.goBack()}>Users</h2>;
}

export default Demo;
