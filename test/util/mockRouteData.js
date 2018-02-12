import {expect} from 'chai';

/**
 * This class is used to mock route information sent to the controllers.
 *
 * Pass in the details you want the request object to have (such as params,
 * query, etc). Then, wherever the controller has the method signature
 * `doSomething(req, res, next)` you should pass in mock.req, mock.res,
 * and mock.next(). Note the parenthesis on the next method.
 *
 * To assert things against the mock object, you can check the following:
 *
 * mock.wasSent   : true or false, depending on if send() was called
 * mock.wasNexted : true or false, depending on if next() was called
 * mock.sent      : the object passed to send() by the controller
 * mock.nexted    : the object passed to next() by the controller
 */
export default class MockRouteData {
  constructor(req) {
    this.req = req;
    // const that = this;
    this.res = {
      send: this.send(this),
      status: this.status(this)
    };
    this.wasSent = false;
    this.sent = null;
    this.wasNexted = false;
    this.nexted = null;
    this.statusCode = null;
  }

  send(that) {
    return function (obj) {
      that.wasSent = true;
      that.sent = obj;
    };
  }

  status(that) {
    return function (code) {
      that.statusCode = code;
      return that.res;
    }
  }

  next() {
    const that = this;
    return function (obj) {
      that.wasNexted = true;
      that.nexted = obj;
    };
  }

  assertWasSent(wasSent) {
    const msg = (wasSent)
      ? 'Expected res.send() to be called, but it wasn\'t.'
      : 'Expected res.send() to NOT be called, but it was.';
    expect(this.wasSent, msg).to.equal(wasSent);
  }

  assertWasNexted(wasNexted) {
    const msg = (wasNexted)
      ? 'Expected res.next() to be called, but it wasn\'t.'
      : 'Expected res.next() to NOT be called, but it was.';
    expect(this.wasNexted, msg).to.equal(wasNexted);
  }

  assertStatusCode(code) {
    const msg = 'Unexpected status code on the route result';
    expect(this.statusCode, msg).to.equal(code);
  }
}
