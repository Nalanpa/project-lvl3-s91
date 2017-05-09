import fs from 'mz/fs';
import parseLinks from '../src/lib/links_parser';
import parseFullLinks from '../src/lib/resources_loader';


const pageURL = 'https://ru.hexlet.io/courses';
const dataFile = '__tests__/__fixtures__/hexlet-io-courses.html';
const linksFile = '__tests__/__fixtures__/links.txt';
const fullLinksFile = '__tests__/__fixtures__/full_links.txt';
const data = fs.readFileSync(dataFile, 'utf8');
const links = fs.readFileSync(linksFile, 'utf8');
const fullLinks = fs.readFileSync(fullLinksFile, 'utf8');

test('Parse links', () => {
  const actual = parseLinks(data).join('\n');
  expect(`${actual}\n`).toBe(links);
});

test('Parse full links', () => {
  const actual = parseFullLinks(data, pageURL).join('\n');
  expect(`${actual}\n`).toBe(fullLinks);
});
