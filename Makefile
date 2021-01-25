dev: build run
build:
	sam build
test:
	npm test
run:
	sam local start-api
logs:
	sam logs -n MyHowmApiFunction --tail
deploy:
	sam build
	sam deploy --guided
update:
	sam build
	sam deploy
