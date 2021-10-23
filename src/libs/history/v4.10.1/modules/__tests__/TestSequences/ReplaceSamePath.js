import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let prevLocation;

  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.replace('/home');
    },
    (location, action) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      prevLocation = location;

      history.replace('/home');
    },
    (location, action) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      expect(location).not.toBe(prevLocation);
    }
  ];

  execSteps(steps, history, done);
}
