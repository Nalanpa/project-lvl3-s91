import urlFormat from '../src/lib/url_formater';

const url = 'https://ru.hexlet.io/courses';
const expectedFile = 'ru-hexlet-io-courses.html';
const expectedFolder = 'ru-hexlet-io-courses_files';

const url2 = 'http://www.example.com';
const expectedUrl2 = 'www-example-com.html';

const link1 = '/assets/icons/default/favicon.ico';
const expectedFullLink1 = 'https://ru.hexlet.io/assets/icons/default/favicon.ico';

const link2 = 'https://en.hexlet.io/lessons.rss';
const expectedLocalLink1 = 'ru-hexlet-io-courses_files/assets-icons-default-favicon.ico';


test('Test names', () => {
  expect(urlFormat('nameWOExtention', url)).toBe('ru-hexlet-io-courses');
  expect(urlFormat('page', url)).toBe(expectedFile);
  expect(urlFormat('page', url2)).toBe(expectedUrl2);
  expect(urlFormat('resourcesDir', url)).toBe(expectedFolder);
  expect(urlFormat('fullLink', url, link1)).toBe(expectedFullLink1);
  expect(urlFormat('fullLink', url, link2)).toBe(link2);
  expect(urlFormat('localLink', expectedFolder, link1)).toBe(expectedLocalLink1);
  expect(urlFormat('wrong', url)).toBe('Unknown type of URL formatter');
});
