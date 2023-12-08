# User_Service

## Getting started

Our service is intended for the use of general public to book appointments with the dentists. <br>
Therefore, we can say that general public is one of the critical stakeholders regarding this project. <br>
This service has been created with the intention for the general public to not only create their accounts but also to save their preferrences whene using the service. <br>

## Technology used

Instead of the traditional CRUD methods from the HTTP, we have decided to use MQTT to communicate between the systems. <br>

TODO:

- Explain about why we have decided to use MQTT instead of HTTP.
- Explain the advantages of using HTTP.
- Explain the potential limitations.

## The controllers

Creating accounts, modifying them, logging in, updating accounts, ... ... ... <br>
These functionallities all need to have controllers that manages them. <br>
Therefore, we have created the controllers for the users with several methods(endpoints). <br>

### CreateUser Method

TODO:

- Explain the createUser method.

### Login Method

TODO:

- Explain the login method.

### GetUser Method

TODO:

- Explain the getUser method.

### DeleteUser Method

TODO:

- Explain the deleteUser method.

### UpdateUser Method

TODO:

- Explain the updateUser method.

### DeleteAllUser Method

TODO:

- Explain the deleteAllUser method.

## Routes

TODO:

- Explain the routes written in the app.ts file.

## Test

Through the gitlab ci/cd pipeline system, our project is automatically tested whenever a new commit is pushed to the remote repository. <br>
Our group has decided to use jest as the features for the unit testing. <br>

### CI pipeline

Our pipeline uses node version 18 as the image because that's what our project is using. <br>
It is consisted of two stages which are the "build stage" and the "test stage". <br>

#### Build Stage

Just like the normal pipelines, we just install the npm dependencies to the gitlab shared runner.

#### Test Stage

We currently have only the unit tests. The script npm tun test:ci is used to test the whole project. <br>
In the future, integration test stage may be implemented as well.

### Tests for Create User

#### Should throw "Input missing data, All data required" when more then one mandatory data is missing.

To avoid extremely long test time, we have decided to only test the case where the user forgot to provide the password information. <br>
When one of the mandatory data is missing, our system throws a message exception that says "Input missing data, All data required". <br>
Therefore, we test if the messageExceptionError is caught as an instance of MessageException and if the message of it is the same as expected. <br>

### Tests for Delete User

#### Should throw "Invalid id" when given a wrong userID.

We test to figure out whether the system throws the error "Invalid id" when the given id is not registered in our database. <br>
We expect to receive a MessageException with the error code 400 and message "Invalid id" <br>

### Tests for Login User

#### Should throw "Invalid data type" when the provided password type is not a string.

We test to figure our whether the system throws the error "Invalid data type" when the given password is in a non-string format. <br>
We expect to receive a MessageException "Invalid Data type" when provided a password in a format such as Number. <br>

#### Should throw "All input is required" when either email or SSN is not provided.

We test to figure out whether the system throws the error "All input is required" when the SSN or Email is not provided. <br>
We expect to receive a MessageException "All input is required". <br>

### Tests for Get User

#### Should throw "Invalid user ID" when the provided a user id that does not exist in our DB.

We test to figure out whether the system throws the error "Invalid user ID" when the given id is not registered in our database. <br>
We expect to receive a MessageException with the error code 400 and message "Invalid user ID". <br>

#### Should return the user if found in our DB.

We test to figure out whether the system returns the user information when a correct user id is provided. <br>
We expect the result of the method getUser to be the same as the mockUser. <br>

### Tests for Password Hash

#### Should check if the password has been hashed before being saved to our DB.

We test to figure out whether the hash function has been called with the provided password and whether it has been called only once. <br>

## Contributions

#### Users-Controller & User Schema

Ahmed Ebrahim Ahmed Al Gabri(WRITE YOUR EMAIL) has created all of the methods for the users-controller and userSchema.

#### Jest Tests & CI Pipeline

David Boram Hong(guscholcda@student.gu.se) has created all of the tests and CI pipeline.
