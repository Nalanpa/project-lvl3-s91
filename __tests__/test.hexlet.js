import fs from 'mz/fs';
import os from 'os';
import pageLoad from '../src';

const host = 'https://hexlet.io/courses';

describe('Test Hexlet page', () => {
  const tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);

  it('No errors', (done) => {
    const url = `${host}`;

    return pageLoad(url, tempDir)
      .then((res) => {
        expect(res).toBe(0);
      })
      .then(done)
      .catch(done.fail);
  });
});
