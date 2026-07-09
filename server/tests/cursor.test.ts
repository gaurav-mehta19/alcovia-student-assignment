import { describe, expect, it } from '@jest/globals';
import { decodeCursor, encodeCursor } from '../src/lib/cursor';
import { AppError } from '../src/lib/errors';

describe('cursor', () => {
  it('round-trips state through encode/decode', () => {
    const state = { startedAt: 1720356600000, id: 'ses_05' };
    expect(decodeCursor(encodeCursor(state))).toEqual(state);
  });

  it('produces a url-safe base64 string with no reserved chars', () => {
    const encoded = encodeCursor({ startedAt: 1720356600000, id: 'ses_05' });
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('rejects malformed base64', () => {
    expect(() => decodeCursor('not-a-cursor!!')).toThrow(AppError);
  });

  it('rejects a decoded payload with the wrong shape', () => {
    const bad = Buffer.from(JSON.stringify({ startedAt: 'nope' }), 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });
});
