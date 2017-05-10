import urlFormat from '../src/lib/url_formater';

const url = 'https://ru.hexlet.io/courses';
const expectedFile = 'ru-hexlet-io-courses.html';
const expectedFolder = 'ru-hexlet-io-courses_files';

const url2 = 'http://www.example.com';
const expectedUrl2 = 'www-example-com.html';

const link1 = '/assets/icons/default/favicon.ico';
const fullLink1 = 'https://ru.hexlet.io/assets/icons/default/favicon.ico';
const expectedResourceFile = 'assets-icons-default-favicon.ico';
const expectedLocalLink1 = 'ru-hexlet-io-courses_files/assets-icons-default-favicon.ico';

const fullLink2 = 'https://ru.hexlet.io/favicon.ico';
const expectedResourceFile2 = 'favicon.ico';
const expectedLocalLink2 = 'ru-hexlet-io-courses_files/favicon.ico';

const link2 = 'https://en.hexlet.io/lessons.rss';

test('Test names', () => {
  expect(urlFormat('nameWOExtention', url)).toBe('ru-hexlet-io-courses');
  expect(urlFormat('page', url)).toBe(expectedFile);
  expect(urlFormat('page', url2)).toBe(expectedUrl2);
  expect(urlFormat('resourcesDir', url)).toBe(expectedFolder);
  expect(urlFormat('resourceFile', fullLink1)).toBe(expectedResourceFile);
  expect(urlFormat('resourceFile', fullLink2)).toBe(expectedResourceFile2);
  expect(urlFormat('fullLink', url, link1)).toBe(fullLink1);
  expect(urlFormat('fullLink', url, link2)).toBe(link2);
  expect(urlFormat('localLink', expectedFolder, link1)).toBe(expectedLocalLink1);
  expect(urlFormat('localLink', expectedFolder, fullLink2)).toBe(expectedLocalLink2);
  expect(urlFormat('wrong', url)).toBe('Unknown type of URL formatter');
});
