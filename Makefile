dev: build run
build:
	sam build
run:
	sam local start-api
logs:
	sam logs -n MyHowmApiFunction --tail
deploy:
	sam build
	sam deploy --guided
