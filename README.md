# AWS Lambda/API Gateway Express-http REST API

This is a REST API for [AWS Lambda](https://aws.amazon.com/lambda/) and [Api Gateway](https://aws.amazon.com/api-gateway/) 

## External Docs
 - [express](https://expressjs.com/) for routing and middleware
 - [serverless-http](https://github.com/dougmoscrop/serverless-http) to wrap express for AWS Lambda
 - [aws sam](https://aws.amazon.com/serverless/sam/) - aws serverless application model

## API

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
$ curl http://localhost:3000/recipes
$ curl http://localhost:3000/recipes/{id}

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
 - add cache
