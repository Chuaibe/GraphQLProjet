# 📱 Social Network GraphQL API

Welcome to the Social Network GraphQL API project! This application allows users to sign up, log in, create posts, comment on posts, and like posts. Built with Apollo Server, Prisma, and TypeScript, this project serves as a backend API for a social networking platform.

## 🚀 Features

- **User Authentication**: Sign up and log in with JWT-based authentication.
- **CRUD Operations for Posts**: Create, read, update, and delete posts.
- **Comments and Likes**: Comment on posts and like posts.
- **GraphQL API**: Utilizes Apollo Server for handling GraphQL queries and mutations.
- **Prisma ORM**: Manages database interactions.

## 📝 Tech Stack

- **Backend**: Apollo Server, Prisma, TypeScript, GraphQL
- **Authentication**: JSON Web Tokens (JWT)


## 🛠️ Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Chuaibe/GraphQLProjet/
   cd social-network-graphql-
   cd BackEnd
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:

   Update a `.env.example` *(do not forget to remove the '.example')* file in the root directory and add the following variables:
   ```env
   JWT_SECRET="your_jwt_secret"
   ```

4. **Generate Prisma Client**:

   ```bash
   npm run prisma generate
   ```

5. **Run Prisma Migrate**:

   ```bash
   npm run prisma migrate dev --name init
   ```

   6. **Start the server**:

      ```bash
      npm run start
      # or
      yarn start
      ```

      The server should now be running at `http://localhost:4444`.

## 📋 Usage

### GraphQL Playground

You can access the GraphQL Playground by navigating to `http://localhost:4444` in your browser. This allows you to interact with the GraphQL API and test queries and mutations.

### Example Queries and Mutations

#### Sign Up

```graphql
mutation {
  signup(email: "user@example.com", name: "John Doe", password: "password123") {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Log In

```graphql
mutation {
  login(email: "user@example.com", password: "password123") {
    token
    user {
      id
      email
      name
    }
  }
}
```

#### Create Post

```graphql
mutation {
  createPost(title: "My First Post", content: "This is the content of my first post.") {
    id
    title
    content
    author {
      id
      name
    }
  }
}
```
