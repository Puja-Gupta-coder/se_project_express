# WTWR (What to Wear?) — Back End

WTWR is a full-stack clothing application backend that stores users and clothing items, handles authentication, validates incoming requests, and protects private routes with JWT-based authorization.

## Repositories

- Backend repository: (https://github.com/Puja-Gupta-coder/se_project_express)
- Frontend repository : https://github.com/Puja-Gupta-coder/Se_react_project

## Project functionality

- User signup and signin with email/password authentication
- JWT-based session management for protected routes
- Clothing item creation, listing, liking, unliking, and ownership-based deletion
- MongoDB storage with Mongoose schemas
- Centralized error handling and request/error logging
- Input validation using Celebrate and Joi

## Technologies and techniques used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Celebrate + Joi validation
- Winston + Express-Winston logging
- CORS for browser access
- ESLint with Airbnb base configuration

## Local development

- Start the server: `npm run start`
- Start in development mode with hot reload: `npm run dev`
- Run lint checks: `npm run lint`

## Frontend

Clone the frontend repository and follow its README to install dependencies and start the client locally.

## Local API URL

- http://localhost:3001

## Frontend repository

- [https://github.com/Puja-Gupta-coder/Se_react_project](https://github.com/Puja-Gupta-coder/Se_react_project)

## Deployed server

- [https://learning.privatedns.org/](https://learning.privatedns.org/)

## Pitch audio

- [Google Drive pitch audio](https://drive.google.com/file/d/1ERjIB5NgNLiV9zE3t5xf44Uk5WpgV8ap/view?usp=sharing)

## Notes

- Request logs are written to `request.log`
- Error logs are written to `error.log`
