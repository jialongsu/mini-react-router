import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let hookLocation, hookAction;
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    (location, action) => {
      expect(hookAction).toBe(action);
      expect(hookLocation).toBe(location);
    }
  ];

  const unblock = history.block((location, action) => {
    hookLocation = location;
    hookAction = action;

    return 'Are you sure?';
  });

  execSteps(steps, history, (...args) => {
    unblock();
    done(...args);
  });
}
