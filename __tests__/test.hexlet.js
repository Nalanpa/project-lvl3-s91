import path from 'path';
import pageLoad from '../src';
import generateName from '../src/lib/url_formater';


const host = 'https://hexlet.io/courses';

describe('Test Hexlet page', () => {
  const tempDir = '/Users/nalanpa/Work/tmp';

  it('No errors', (done) => {
    const url = `${host}`;
    const fileName = generateName('page', url);
    const filePath = path.resolve(tempDir, fileName);
    const expectedMessage = `OK: Data was downloaded from ${url} to ${filePath}\n`;

    return pageLoad(url, tempDir)
      .then((message) => {
        expect(message).toBe(expectedMessage);
      })
      .then(done)
      .catch(done.fail);
  });
});
