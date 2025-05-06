# Movie App

This project is a simple React and Node.js application that communicates with a MongoDB database. It displays a list of movies and allows users to click on a movie to view its details and associated comments.

## Project Structure

```
movie-app
├── client
│   ├── src
│   │   ├── components
│   │   │   ├── MovieList.js
│   │   │   └── MovieDetail.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── server
│   ├── routes
│   │   └── movies.js
│   ├── models
│   │   └── Movie.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the server directory and install dependencies:

   ```
   cd movie-app/server
   npm install
   ```

3. Set up your MongoDB connection string in the `.env` file in the server directory.

4. Navigate to the client directory and install dependencies:

   ```
   cd ../client
   npm install
   ```

5. Set up your API base URL in the `.env` file in the client directory.

### Running the Application

1. Start the server:

   ```
   cd server
   node server.js
   ```

2. Start the client:

   ```
   cd ../client
   npm start
   ```

3. Open your browser and go to `http://localhost:3000` to view the application.

## Features

- Displays a list of movies fetched from the MongoDB database.
- Allows users to click on a movie to view its details and associated comments.

## License

This project is licensed under the MIT License.