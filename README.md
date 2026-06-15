# ShopEZ

ShopEZ is a full-stack e-commerce web application built with React, Node.js, Express, and MongoDB. The project includes user authentication, product browsing, cart management, wishlist features, product reviews, order placement, and admin product management.

## Features

- User registration and login
- Product listing
- Product details page
- Shopping cart
- Wishlist
- Product reviews
- User profile
- Order placement
- Admin product management
- Image upload support

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Bootstrap
- React Icons
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcryptjs

## Project Structure

```text
ShopEZ/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
├── .gitignore
├── run-shopez.bat
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/ramya-mucherla/VIP-C2-ShopEZ.git
```

Go to the project folder:

```bash
cd VIP-C2-ShopEZ
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```text
backend/.env
```

Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Run the Project

Start the backend server:

```bash
cd backend
npm start
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will usually run on:

```text
http://localhost:5173
```

The backend will usually run on:

```text
http://localhost:5000
```
