import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  const steps = [
    location => {
      expect(location.key).toBeFalsy();
    }
  ];

  execSteps(steps, history, done);
}
