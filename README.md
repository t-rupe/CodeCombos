# Microservice API Documentation
This README provides detailed instructions on how to interact with the microservice API that has been implemented as part of this project.

# Overview
This microservice provides an API to fetch user data from Karim's Firebase database. It responds to HTTP GET requests and returns user information based on the provided email.

# How to Request Data
Endpoint
GET codecombos.vercel.app/api/sendusers

# Query Parameters
email: The email address of the user whose information is being requested.
# Example Call
Using fetch in JavaScript to make a request:

javascript
fetch('https://codecombos.vercel.app/api/sendusers?email=user@example.com')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

# How to Receive Data
The microservice responds with JSON-formatted data. Below is an example of the response format:

json
Copy code
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "address": "123 Main St, Anytown, USA"
}

# Response Structure
name: The name of the user.
password: The password of the user. 
email: The email address of the user.
address: The address of the user.
Error Handling
In case of an error (like a user not found), the API responds with an appropriate HTTP status code and an error message. For example:
 "error": "User not found."
