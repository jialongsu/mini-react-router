import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let unblock,
    hookWasCalled = false;
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      unblock = history.block(() => {
        hookWasCalled = true;
      });

      window.history.go(-1);
    },
    (location, action) => {
      expect(action).toBe('POP');
      expect(location).toMatchObject({
        pathname: '/'
      });

      expect(hookWasCalled).toBe(true);

      unblock();
    }
  ];

  execSteps(steps, history, done);
}
