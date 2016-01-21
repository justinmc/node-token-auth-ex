# Node Token Based Authentication Example

This project is a simple example of using token based authentication in a robust way.

## Run it
    mongod
    npm start

## Try it out!

### Sign Up
    curl http://localhost:3000/v1/signup -X POST --data 'email=user@example.com&password=ilovecode'

### Login
    curl http://localhost:3000/v1/login -X POST --data 'email=user@example.com&password=ilovecode'

### Access a protected endpoint
    curl http://localhost:3000/v1/protected --header "Authorization: Bearer <token>"
