# MyHowm REST API for AWS Lambda & API Gateway

This is the REST API for api.myhowm.com

## External Docs
 - [express](https://expressjs.com/) for routing and middleware
 - [AWS Lambda](https://aws.amazon.com/lambda/)
 - [Api Gateway](https://aws.amazon.com/api-gateway/) 
 - [serverless-http](https://github.com/dougmoscrop/serverless-http) to wrap express for AWS Lambda
 - [aws sam](https://aws.amazon.com/serverless/sam/) - aws serverless application model

## API

### Users

| Verb  | Endpoint          | Description               |
|:----- |:----------------- |:------------------------- |
| POST  | /users/register   | register a new user       |
| POST  | /users/login      | login an existing user    |

### Recipes

| Verb      | Endpoint      | Description               |
|:--------- |:------------- |:----------------------    |
| GET       | /recipes      | get list of recipes       |
| POST      | /recipes      | create a recipes          |
| GET       | /recipes/{id} | get a single recipe       |
| PUT       | /recipes/{id} | update a single recipe    |
| DELETE    | /recipes/{id} | delete a single recipe    |

## Local Dev
```bash
# Build and Run local server
$ make dev

# Build Only
$ make build

# Run local server only
$ make run

# tail logs
$ make logs
```

## Deploy
```bash
$ make deploy
```

## Cleanup
```bash
$ aws cloudformation delete-stack --stack-name <stack-name>
```

## TODO
 - add query search to /recipes
 - add cors to responses
 - expand recipe schema to include ingredients and steps
 - add tests
