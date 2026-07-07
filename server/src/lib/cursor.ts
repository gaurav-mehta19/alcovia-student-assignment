import { badRequest } from './errors';

export interface CursorState {
  startedAt: number;
  id: string;
}

export function encodeCursor(state: CursorState): string {
  return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
}

export function decodeCursor(raw: string): CursorState {
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.startedAt !== 'number' ||
      typeof parsed.id !== 'string'
    ) {
      throw new Error('shape');
    }
    return { startedAt: parsed.startedAt, id: parsed.id };
  } catch {
    throw badRequest('Invalid cursor');
  }
}
