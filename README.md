Sure, here is the developer documentation for your project:

---

# Developer Documentation

## Project Overview
This project is a Node.js-based backend system built with TypeScript. It includes services for managing collections, orders, products, and users. The project follows a modular architecture to enhance maintainability and scalability.

## Prerequisites
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- TypeScript
- A database (MongoDB, PostgreSQL, etc.)

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
    - Copy `.env.example` to `.env` and fill in the required values.
      ```sh
      cp .env.example .env
      ```

4. **Compile TypeScript:**
   ```sh
   npm run build
   ```

5. **Start the server:**
   ```sh
   npm start
   ```

## Project Structure

```
node_project/
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── package.json
├── package-lock.json
├── server.ts
├── tsconfig.json
├── .idea/
├── services/
│   ├── collection/
│   │   ├── collectionController.ts
│   │   ├── collectionModel.ts
│   │   ├── collectionRouter.ts
│   │   └── collectionTypes.ts
│   ├── order/
│   │   ├── orderController.ts
│   │   ├── orderModel.ts
│   │   ├── orderRouter.ts
│   │   └── orderTypes.ts
│   ├── product/
│   │   ├── productController.ts
│   │   ├── productModel.ts
│   │   ├── productRouter.ts
│   │   └── productTypes.ts
│   └── user/
│       ├── userController.ts
│       ├── userModel.ts
│       ├── userRouter.ts
│       └── userTypes.ts
└── src/
    ├── config.ts
    ├── dbConnection.ts
    └── middlewares/
        ├── authMiddleware.ts
        ├── globalErrorHandler.ts
        └── isAdmin.ts
```

### Key Files and Directories

- **.env**: Environment variables.
- **.env.example**: Example environment variables file.
- **.eslintrc.json**: ESLint configuration for code quality.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **.prettierrc**: Prettier configuration for code formatting.
- **package.json**: Contains project metadata and dependencies.
- **package-lock.json**: Ensures consistent installation of dependencies.
- **server.ts**: Entry point for the server.
- **tsconfig.json**: TypeScript configuration file.
- **.idea/**: Configuration files for the IDE (IntelliJ IDEA, WebStorm, etc.).

### Services Directory

- **services/collection/**:
    - `collectionController.ts`: Handles HTTP requests related to collections.
    - `collectionModel.ts`: Defines the schema and database operations for collections.
    - `collectionRouter.ts`: Routes HTTP requests to the appropriate controller methods.
    - `collectionTypes.ts`: Defines TypeScript types for collections.

- **services/order/**:
    - `orderController.ts`
    - `orderModel.ts`
    - `orderRouter.ts`
    - `orderTypes.ts`

- **services/product/**:
    - `productController.ts`
    - `productModel.ts`
    - `productRouter.ts`
    - `productTypes.ts`

- **services/user/**:
    - `userController.ts`
    - `userModel.ts`
    - `userRouter.ts`
    - `userTypes.ts`

### src Directory

- **config.ts**: Configuration settings for the application.
- **dbConnection.ts**: Database connection setup.
- **middlewares/**:
    - `authMiddleware.ts`: Handles user authentication.
    - `globalErrorHandler.ts`: Captures and processes errors globally.
    - `isAdmin.ts`: Checks if the user has admin privileges.

## Development

### Running the Development Server
To start the development server with live-reloading:
```sh
npm run dev
```

### Building the Project
To compile TypeScript files into JavaScript:
```sh
npm run build
```

To format code with Prettier:
```sh
npm run format
```

## API Endpoints

### Authentication
- **POST /api/v1/auth/login**: User login.
- **POST /api/v1/auth/register**: User registration.

### Collections
- **GET /api/v1/collections**: Retrieve all collections.
- **POST /api/v1/collections**: Create a new collection.
- **PUT /api/v1/collections/:id**: Update a collection.
- **DELETE /api/v1/collections/:id**: Delete a collection.

### Orders
- **GET /api/v1/orders**: Retrieve all orders.
- **POST /api/v1/orders**: Create a new order.
- **PUT /api/v1/orders/:id**: Update an order.
- **DELETE /api/v1/orders/:id**: Delete an order.

### Products
- **GET /api/v1/products**: Retrieve all products.
- **POST /api/v1/products**: Create a new product.
- **PUT /api/v1/products/:id**: Update a product.
- **DELETE /api/v1/products/:id**: Delete a product.

### Users
- **GET /api/v1/users**: Retrieve all users.
- **POST /api/v1/users**: Create a new user.
- **PUT /api/v1/users/:id**: Update a user.
- **DELETE /api/v1/users/:id**: Delete a user.

## Testing

### Running Tests
To run tests:
```sh
npm test
```

## Deployment
For deployment, ensure that all environment variables are properly set and the project is built. Deploy the compiled files in the `dist` directory to your server.

## Contributing
To contribute to this project:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or support, please contact:
- **Project Manager** `and` **System Proponent**: Ukay Khing Marma (ukaykhing25@gmail.com)
