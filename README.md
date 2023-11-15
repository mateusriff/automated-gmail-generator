# Automated Gmail Generator

This program leverages Puppeteer to automatically generate a Gmail account. If sucessful, it will
output the username and password of the newly created account. 

## Run it on your machine

To run this program, clone this repository, do `npm i` to install depedencies and then `node index.mjs` to run it. Of course, you should have [Node.js](https://nodejs.org/en) installed.

## Important disclaimer

Theoretically, it works. It is able to fill all input fields in every single one of the sign in steps. However, Google seems to detect bot activity and stops it from actually creating an account in the end. As of now (11/15/2023) I could not find a workaround for that. I had some fun with the project, though, so I decided to share this anyways.