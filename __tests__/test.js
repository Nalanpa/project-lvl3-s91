import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
// import axios from '../src/lib/axios';
import pageLoad from '../src';
import generateName from '../src/lib/file_name_generator';


const host = 'http://www.example.com';
const testData = 'Some output';
const absentPageError = 'Page is absent';

describe('test page loader', () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);
    nock(host)
      .get('/')
      .reply(200, testData);
    nock(host)
      .get('/absent_page')
      .reply(404, absentPageError);
  });

  it('No errors', (done) => {
    const url = `${host}`;
    const expectedMessage = 'Ok';
    const fileName = generateName(url);
    const filePath = path.resolve(tempDir, fileName);

    return pageLoad(url, tempDir)
      .then((message) => {
        expect(message).toBe(expectedMessage);
      })
      .then(() => {
        expect(fs.readFileSync(filePath, 'utf8')).toBe(testData);
      })
      .then(done)
      .catch(done.fail);
  });

  it('Error 404', async () => {
    const url = `${host}/absent_page`;
    const expectedMessage = `ERROR: File isn't found by url ${url}`;
    try {
      await pageLoad(url, tempDir);
    } catch (error) {
      expect(error).toBe(expectedMessage);
    }
  });
});
