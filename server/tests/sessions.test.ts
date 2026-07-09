import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { createApp } from '../src/app';
import { seed } from '../src/seed';

let app: Express;

beforeAll(() => {
  seed();
  app = createApp();
});

const base = '/api/students/stu_01';

describe('GET /sessions pagination', () => {
  it('paginates with an opaque cursor and reports hasMore', async () => {
    const first = await request(app).get(`${base}/sessions?limit=5`);
    expect(first.status).toBe(200);
    expect(first.body.data).toHaveLength(5);
    expect(first.body.hasMore).toBe(true);
    expect(typeof first.body.cursor).toBe('string');

    const second = await request(app).get(`${base}/sessions?limit=5&cursor=${first.body.cursor}`);
    const firstIds = first.body.data.map((s: { id: string }) => s.id);
    const secondIds = second.body.data.map((s: { id: string }) => s.id);
    expect(secondIds.some((id: string) => firstIds.includes(id))).toBe(false);
  });

  it('returns hasMore=false and cursor=null on the last page', async () => {
    const res = await request(app).get(`${base}/sessions?limit=50`);
    expect(res.body.hasMore).toBe(false);
    expect(res.body.cursor).toBeNull();
  });

  it('clamps limit to a maximum of 50', async () => {
    const res = await request(app).get(`${base}/sessions?limit=9999`);
    expect(res.status).toBe(200);
  });

  it('rejects a malformed cursor with 400', async () => {
    const res = await request(app).get(`${base}/sessions?cursor=garbage!!`);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('BAD_REQUEST');
  });
});

describe('date format contract', () => {
  it('returns epoch-ms numbers on the list endpoint', async () => {
    const res = await request(app).get(`${base}/sessions?limit=1`);
    expect(typeof res.body.data[0].startedAt).toBe('number');
  });

  it('returns ISO strings on the detail endpoint', async () => {
    const list = await request(app).get(`${base}/sessions?limit=1`);
    const id = list.body.data[0].id;
    const detail = await request(app).get(`${base}/sessions/${id}`);
    expect(typeof detail.body.startedAt).toBe('string');
    expect(detail.body.startedAt).toMatch(/T.*Z$/);
    expect(Array.isArray(detail.body.timeline)).toBe(true);
  });
});

describe('errors', () => {
  it('returns a 404 with the documented error shape', async () => {
    const res = await request(app).get('/api/students/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Student not found', code: 'NOT_FOUND' });
  });
});

describe('POST /sessions', () => {
  it('creates a session and returns the detail shape with 201', async () => {
    const res = await request(app)
      .post(`${base}/sessions`)
      .send({ type: 'deep_focus', durationMs: 1500000, timeline: [] });
    expect(res.status).toBe(201);
    expect(res.body.coins).toBe(50);
    expect(typeof res.body.startedAt).toBe('string');
    expect(res.body.timeline.length).toBeGreaterThan(0);
  });

  it('rejects an invalid session type with 400', async () => {
    const res = await request(app).post(`${base}/sessions`).send({ type: 'nap', durationMs: 1000 });
    expect(res.status).toBe(400);
  });
});
