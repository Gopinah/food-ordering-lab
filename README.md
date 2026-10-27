# Chef Cart Admin

A full-stack food ordering web app for managing menu items and customer orders.

## Features
- Display all food menu items
- Add new dishes to the menu
- Edit or update existing menu details
- Delete food items from the catalog
- Create new customer orders
- Update order status from Pending to Preparing, Ready, and Delivered

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Data: in-memory arrays for the demo app

## Run locally
1. Install server dependencies:
   npm install --prefix server
2. Install client dependencies:
   npm install --prefix client
3. Start the backend:
   npm run dev --prefix server
4. Start the frontend:
   npm run dev --prefix client
5. Open the app in the browser at http://localhost:5173

## Production deployment approach
This app is prepared for deployment to a PaaS like Render or Railway using GitHub integration.

### Recommended setup on Render
1. Push the project to a GitHub repository.
2. Sign in to Render and choose New > Web Service.
3. Connect the GitHub repository.
4. Use the following build and start settings:
   - Build Command: npm install --prefix server && npm install --prefix client && npm run build --prefix client
   - Start Command: node server/server.js
5. Save and deploy.

The Express server will serve the built React app from the client/dist folder, so the application works on a hosted platform without localhost issues.

## Project structure
- client/ - React frontend
- server/ - Express API server
- render.yaml - deployment config for Render
