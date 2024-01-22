# Jobly - Back-end API in Node.js/Express and PostgreSQL

## Description:
- Jobly is a fullstack application with the back-end structure provided in this repository. To view the front-end please see the react-jobly repository pinned to my profile.
- To see a demo of the application visit: https://www.loom.com/share/560f21a16f2e4df7ad0395f38a459d0a
- The Jobly backend is built in Node.js and Express, serving as a pure API application.
- It handles values from query strings or a JSON body and returns JSON responses.
- Implements authentication and authorization functions using JWT tokens.
- This API allows filtering of jobs and companies based on the search criteria received from the front-end.

Future features include:
- Achieving 98% test coverage with additional tests.
- Adding technologies for jobs by introducing a table in the database that can be linked to many jobs.
- Incorporating technologies for users, similar to the addition of technologies for jobs.
- Implementing a feature where a random password is generated for users added by admins via the POST/users route. The system generates a random password, and users can change it after authentication.

## Instructions:
1. Ensure PostgreSQL and Node is installed. Fork this repository.
2. Install the dependencies by running `npm install` in your command line.
3. Run the following command to set up the database
4. Start the server by running `node server.js` in the command line.
5. Run tests using `jest -i`. Ensure Node.js is installed on your machine.





