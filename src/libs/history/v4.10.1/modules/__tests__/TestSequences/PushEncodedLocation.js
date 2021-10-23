import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      const pathname = '/歴史';
      const search = '?%E3%82%AD%E3%83%BC=%E5%80%A4';
      const hash = '#%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5';
      history.push(pathname + search + hash);
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/歴史',
        search: '?%E3%82%AD%E3%83%BC=%E5%80%A4',
        hash: '#%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5'
      });
    }
  ];

  execSteps(steps, history, done);
}
