import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import pageLoad from '../src';


const host = 'http://www.example.com';
const testData = 'Some output...!';
const absentPageError = 'Page is absent';

describe('Test errors', () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);
    nock(host)
      .get('/')
      .reply(200, testData);
    nock(host)
      .get('/absent_page')
      .reply(404, absentPageError)
      .get('/server-not-available')
      .reply(500)
      .get('/wrong-asset')
      .reply(404, '<script src="/path/wrong-asset.js"></script>');
  });

  it('Yandex', async () => {
    const url = 'http://yandex.ru';
    // const expectedMessage = "File isn't found by url";
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error).toBe(1);
    }
  });

  it('Error 404', async () => {
    const url = `${host}/absent_page`;
    // const expectedMessage = "File isn't found by url";
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error).toBe(1);
    }
  });

  it('Error 500', async () => {
    const url = `${host}/server-not-available`;
    const expectedMessage = 'Server is unavailable by url';
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error).toBe(1);
    }
  });

  it('Wrong directory', async () => {
    const url = `${host}/`;
    const dir = 'wrong_directory';
    // const expectedMessage = 'ERROR: ENOENT: No such file or directory';
    // const expectedMessage = 'Path not found:';
    try {
      await pageLoad(url, dir);
    } catch (error) {
      expect(error).toBe(1);
    }
  });

  it('Connection refused by server', async () => {
    const url = 'wrong_url';
    // const expectedMessage = 'refused by server';
    try {
      await pageLoad(url);
    } catch (error) {
      expect(error).toBe(1);
    }
  });
});
