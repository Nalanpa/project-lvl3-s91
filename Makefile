install:
	npm install

start:
	npm run babel-node -- 'src/bin/page-loader.js' --output __tests__/tmp https://hexlet.io/courses

publish:
	npm publish

test:
	npm test

lint:
	npm run eslint -- src test

lintall:
	npm run eslint

build:
	rm -rf dist
	npm run build

.PHONY: install start publish lint lintall build test
