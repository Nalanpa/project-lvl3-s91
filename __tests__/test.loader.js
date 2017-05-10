import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoad from '../src';
import generateName from '../src/lib/url_formater';


const host = 'http://www.example.com';
const testData = 'Some output...!';

describe('test page loader', () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);
    nock(host)
      .get('/')
      .reply(200, testData);
  });


  it('No errors', (done) => {
    const url = `${host}`;
    const fileName = generateName('page', url);
    const filePath = path.resolve(tempDir, fileName);
    const expectedMessage = `OK: Data was downloaded from ${url} to ${filePath}\n`;

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
});
