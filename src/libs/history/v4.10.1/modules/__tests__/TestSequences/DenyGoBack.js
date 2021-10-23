import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let unblock;
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

      unblock = history.block(nextLocation => {
        expect(nextLocation).toMatchObject({
          pathname: '/'
        });

        return 'Are you sure?';
      });

      history.goBack();
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      unblock();
    }
  ];

  execSteps(steps, history, done);
}
