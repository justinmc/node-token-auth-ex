# Node Token Based Authentication Example

This project is a simple example of using token based authentication in a robust way.

## Run it
    mongod
    npm start

## Try it out!

### Sign Up
    $ curl http://localhost:3000/v1/signup -X POST --data 'email=user@example.com&password=ilovecode'
    {"user":{"email":"userz@example.com","created":"2016-01-21T06:12:12.480Z"},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjU2YTA3OGJkNjUyOTcyNjQwNjZjMjA2OCI.3pJ0yyn5yzM-2VcWINmNo78VioagJ8E6dGPRPPttImc"}

### Login
    $ curl http://localhost:3000/v1/login -X POST --data 'email=user@example.com&password=ilovecode'
    {"user":{"email":"user@example.com","created":"2016-01-20T06:19:07.296Z"},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjU2YTA3OTFiNjUyOTcyNjQwNjZjMjA2OSI.z4z8qlNP9R6hTBDzHL6Zi3yq9XPcQwJTkMgzXJ8nuSU"}

### Access a protected endpoint
    $ curl http://localhost:3000/v1/protected --header "Authorization: Bearer <token>"
    {"message":"you must be successfully authenticated if you received this"}
