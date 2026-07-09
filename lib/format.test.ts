import { describe, expect, it } from '@jest/globals';
import { formatClock, formatDuration, formatRelative, parseApiDate } from './format';

describe('parseApiDate', () => {
  it('accepts epoch ms from the list endpoint', () => {
    expect(parseApiDate(1720356600000).getTime()).toBe(1720356600000);
  });

  it('accepts ISO strings from the detail endpoint', () => {
    expect(parseApiDate('2026-07-07T09:00:00.000Z').toISOString()).toBe('2026-07-07T09:00:00.000Z');
  });
});

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes', () => {
    expect(formatDuration(1500000)).toBe('25 min');
    expect(formatDuration(900000)).toBe('15 min');
  });

  it('formats hour-plus durations', () => {
    expect(formatDuration(3600000)).toBe('1h');
    expect(formatDuration(5400000)).toBe('1h 30m');
  });
});

describe('formatClock', () => {
  it('zero-pads seconds', () => {
    expect(formatClock(90)).toBe('1:30');
    expect(formatClock(5)).toBe('0:05');
    expect(formatClock(0)).toBe('0:00');
  });
});

describe('formatRelative', () => {
  const now = new Date('2026-07-09T12:00:00');

  it('labels same-day as Today', () => {
    expect(formatRelative(new Date('2026-07-09T09:30:00').getTime(), now)).toMatch(/^Today,/);
  });

  it('labels the prior day as Yesterday', () => {
    expect(formatRelative(new Date('2026-07-08T16:00:00').getTime(), now)).toMatch(/^Yesterday,/);
  });

  it('labels earlier in the week by weekday name', () => {
    expect(formatRelative(new Date('2026-07-06T18:00:00').getTime(), now)).toMatch(/^Mon,/);
  });
});
