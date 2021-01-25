dev: build run
build:
	sam build
run:
	sam local start-api
logs:
	sam logs -n MyHowmApiFunction --tail
test:
	npm test
deploy:
	sam build
	sam deploy --guided
update:
	sam build
	sam deploy
