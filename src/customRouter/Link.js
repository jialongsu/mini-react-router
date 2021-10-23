import { useContext } from 'react';
import HistoryContext from './historyContext';

function Link(props) {
  const history = useContext(HistoryContext);

  const handeTo = function() {
    history.push(props.to);
  }

  return (
    <a {...props} onClick={handeTo}>{props.children}</a>
  );
}

export default Link;
