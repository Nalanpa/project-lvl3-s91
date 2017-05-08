import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
// import axios from '../src/lib/axios';
import pageLoad from '../src';


const host = 'http://www.example.com';
const pageName = 'page.html';
const testData = 'Some output';
const absentPageError = 'Page is absent';

describe('test page loader', () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);
    nock(host)
      .get('/test')
      .reply(200, testData);
    nock(host)
      .get('/absent_page')
      .reply(404, absentPageError);
  });

  it('message test', () => {
    const expected = `Url: ${host}, output: ${tempDir}`;
    expect.assertions(1);
    return pageLoad(host, tempDir).then((message) => {
      expect(message).toBe(expected);
    });
  });
});
