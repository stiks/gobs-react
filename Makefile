.PHONY: dev fmt test build deploy
PACKAGES=`go list ./...`

dev:
	@yarn start:no-mock

test:
	@yarn test

clean:
	@rm -rf dist/

fmt:
	@npm run prettier

build: clean
	@yarn build

deploy: build
	@gcloud app deploy app.yaml --project gobs --stop-previous-version
