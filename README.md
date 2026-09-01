# WTWR (What to Wear?) — Back End

WTWR is a full-stack clothing application backend that stores users and clothing items, handles authentication, validates incoming requests, and protects private routes with JWT-based authorization.

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

## Local API URL

- http://localhost:3001

## Notes

- Request logs are written to `request.log`
- Error logs are written to `error.log`
