# Pantry-to-Plate

Pantry-to-Plate is a full-stack application that helps users manage their pantry inventory, discover recipes based on available ingredients, and create shopping lists.

## Features

- **User Authentication**: Secure registration, login, and account management
- **Pantry Management**: Add, update, and track pantry items with expiration dates
- **Recipe Discovery**: Find recipes based on ingredients you already have
- **Shopping List**: Create and manage shopping lists, add recipe ingredients directly

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend (Planned)
- React
- TypeScript
- Redux for state management
- Material-UI for components

## Project Structure

```
pantry-to-plate/
├── packages/
│   ├── server/         # Backend API
│   │   ├── src/
│   │   │   ├── config/       # Configuration files
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── models/       # Mongoose models
│   │   │   ├── routes/       # API routes
│   │   │   ├── services/     # Business logic
│   │   │   ├── utils/        # Utility functions
│   │   │   └── index.ts      # Entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client/         # Frontend (to be implemented)
├── .env                # Environment variables
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pantry-to-plate.git
   cd pantry-to-plate
   ```

2. Install dependencies:
   ```
   cd packages/server
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `PATCH /api/auth/update-password` - Update password

### User
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update user profile
- `PATCH /api/users/me/preferences` - Update user preferences
- `DELETE /api/users/me` - Delete user account

### Pantry
- `GET /api/pantry` - Get all pantry items
- `POST /api/pantry` - Add pantry item
- `GET /api/pantry/:id` - Get pantry item
- `PATCH /api/pantry/:id` - Update pantry item
- `DELETE /api/pantry/:id` - Delete pantry item
- `GET /api/pantry/category/:category` - Get pantry items by category
- `GET /api/pantry/expiring/soon` - Get expiring pantry items
- `POST /api/pantry/batch` - Add multiple pantry items

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/:id` - Get recipe
- `PATCH /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/by-ingredients` - Get recipes by ingredients
- `GET /api/recipes/favorites` - Get favorite recipes
- `PATCH /api/recipes/:id/favorite` - Toggle favorite status

### Shopping List
- `GET /api/shopping-list` - Get shopping list
- `POST /api/shopping-list` - Add item to shopping list
- `PATCH /api/shopping-list/:id` - Update shopping list item
- `DELETE /api/shopping-list/:id` - Remove item from shopping list
- `POST /api/shopping-list/batch` - Add multiple items to shopping list
- `DELETE /api/shopping-list/clear` - Clear shopping list
- `PATCH /api/shopping-list/:id/toggle` - Toggle item checked status
- `POST /api/shopping-list/recipe/:recipeId` - Add recipe ingredients to shopping list

## License

This project is licensed under the MIT License. 