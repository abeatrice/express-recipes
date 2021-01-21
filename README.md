# AWS Lambda/API Gateway Express-http REST API

This is a REST API for [AWS Lambda](https://aws.amazon.com/lambda/) and [Api Gateway](https://aws.amazon.com/api-gateway/) 

## External Docs
 - [express](https://expressjs.com/) for routing and middleware
 - [serverless-http](https://github.com/dougmoscrop/serverless-http) to wrap express for AWS Lambda

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
$ sam build
$ sam local start-api
$ curl http://localhost:3000/recipes
$ curl http://localhost:3000/recipes/{id}
```

## Get Logs
```bash
$ sam logs -n ListRecipesFunction --tail
```

## Deploy
```bash
$ sam build
$ sam deploy --guided
```

## Cleanup
```bash
$ aws cloudformation delete-stack --stack-name <stack-name>
```
