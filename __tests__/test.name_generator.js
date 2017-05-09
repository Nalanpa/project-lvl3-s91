import generateName from '../src/lib/name_generator';

const url = 'http://ru.hexlet.io/courses';
const expectedFile = 'ru-hexlet-io-courses.html';
const expectedFolder = 'ru-hexlet-io-courses_files';


test('HTML file', () => {
  const actual = generateName(url, 'page');
  expect(actual).toBe(expectedFile);
});

test('Folder', () => {
  const actual = generateName(url, 'dir');
  expect(actual).toBe(expectedFolder);
});
