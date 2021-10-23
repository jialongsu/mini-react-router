import expect from 'expect';
import { createBrowserHistory } from 'history';

import * as TestSequences from './TestSequences/index.js';

describe('a browser history', () => {
  let history;
  beforeEach(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, null, '/');
    }
    history = createBrowserHistory();
  });

  it('knows how to create hrefs', () => {
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('/the/path?the=query#the-hash');
  });

  it('does not encode the generated path', () => {
    // encoded
    const encodedHref = history.createHref({
      pathname: '/%23abc'
    });
    // unencoded
    const unencodedHref = history.createHref({
      pathname: '/#abc'
    });

    expect(encodedHref).toEqual('/%23abc');
    expect(unencodedHref).toEqual('/#abc');
  });

  describe('listen', () => {
    it('does not immediately call listeners', done => {
      TestSequences.Listen(history, done);
    });
  });

  describe('the initial location', () => {
    it('does not have a key', done => {
      TestSequences.InitialLocationNoKey(history, done);
    });
  });

  describe('push a new path', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.PushNewLocation(history, done);
    });
  });

  describe('push the same path', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.PushSamePath(history, done);
    });
  });

  describe('push state', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.PushState(history, done);
    });
  });

  describe('push with no pathname', () => {
    it('calls change listeners with the normalized location', done => {
      TestSequences.PushMissingPathname(history, done);
    });
  });

  describe('push with a relative pathname', () => {
    it('calls change listeners with the normalized location', done => {
      TestSequences.PushRelativePathname(history, done);
    });
  });

  describe('push with an invalid pathname (bad percent-encoding)', () => {
    it('throws an error', done => {
      TestSequences.PushInvalidPathname(history, done);
    });
  });

  describe('push with a unicode path string', () => {
    it('creates a location with decoded properties', done => {
      TestSequences.PushUnicodeLocation(history, done);
    });
  });

  describe('push with an encoded path string', () => {
    it('creates a location object with encoded pathname', done => {
      TestSequences.PushEncodedLocation(history, done);
    });
  });

  describe('replace a new path', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.ReplaceNewLocation(history, done);
    });
  });

  describe('replace the same path', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.ReplaceSamePath(history, done);
    });
  });

  describe('replace with an invalid pathname (bad percent-encoding)', () => {
    it('throws an error', done => {
      TestSequences.ReplaceInvalidPathname(history, done);
    });
  });

  describe('replace state', () => {
    it('calls change listeners with the new location', done => {
      TestSequences.ReplaceState(history, done);
    });
  });

  describe('location created by encoded and unencoded pathname', () => {
    it('produces the same location.pathname', done => {
      TestSequences.LocationPathnameAlwaysSame(history, done);
    });
  });

  describe('location created with encoded/unencoded reserved characters', () => {
    it('produces different location objects', done => {
      TestSequences.EncodedReservedCharacters(history, done);
    });
  });

  describe('goBack', () => {
    it('calls change listeners with the previous location', done => {
      TestSequences.GoBack(history, done);
    });
  });

  describe('goForward', () => {
    it('calls change listeners with the next location', done => {
      TestSequences.GoForward(history, done);
    });
  });

  describe('block', () => {
    it('blocks all transitions', done => {
      TestSequences.BlockEverything(history, done);
    });
  });

  describe('block a POP without listening', () => {
    it('receives the next location and action as arguments', done => {
      TestSequences.BlockPopWithoutListening(history, done);
    });
  });

  describe('that accepts all transitions', () => {
    let history;
    beforeEach(() => {
      history = createBrowserHistory({
        getUserConfirmation(_, callback) {
          callback(true);
        }
      });
    });

    it('receives the next location and action as arguments', done => {
      TestSequences.TransitionHookArgs(history, done);
    });

    it('cancels the transition when it returns false', done => {
      TestSequences.ReturnFalseTransitionHook(history, done);
    });

    it('is called when the back button is clicked', done => {
      TestSequences.BackButtonTransitionHook(history, done);
    });

    it('is called on the hashchange event', done => {
      TestSequences.HashChangeTransitionHook(history, done);
    });
  });

  describe('that denies all transitions', () => {
    let history;
    beforeEach(() => {
      history = createBrowserHistory({
        getUserConfirmation(_, callback) {
          callback(false);
        }
      });
    });

    describe('clicking on a link (push)', () => {
      it('does not update the location', done => {
        TestSequences.DenyPush(history, done);
      });
    });

    describe('clicking the back button (goBack)', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoBack(history, done);
      });
    });

    describe('clicking the forward button (goForward)', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoForward(history, done);
      });
    });
  });
});
