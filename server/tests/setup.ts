import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

process.env.DB_PATH = join(mkdtempSync(join(tmpdir(), 'alcovia-test-')), 'test.db');
