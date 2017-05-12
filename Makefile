install:
	npm install

start:
	npm run babel-node -- 'src/bin/page-loader.js' --output ./tmp https://hexlet.io/courses

start-error:
	npm run babel-node -- 'src/bin/page-loader.js' --output ./tmp https://hexlet.io/coursesd

publish:
	npm publish

test:
	npm test

test-watch:
	npm run test-watch

lint:
	npm run eslint -- src test

lintall:
	npm run eslint

build:
	rm -rf dist
	npm run build

.PHONY: install start publish lint lintall build test test-watch
