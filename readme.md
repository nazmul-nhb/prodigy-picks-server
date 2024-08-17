# Prodigy Picks API

## Overview

The Prodigy Picks API is a RESTful service built with Node.js, Express, TypeScript, and MongoDB (ODM: Mongoose) that provides a robust backend for managing products, users, and shopping carts. This API supports user authentication, product management, cart operations, and more.

## Features

- **User Management**: Add registered users data in the DB.
- **Product Management**: Add, retrieve, and filter products.
- **Cart Operations**: Add items to the cart, fetch cart contents, and remove items.

## Installation

### Prerequisites

- Node.js
- MongoDB
- A `.env` file for environment variables

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/nazmul-nhb/prodigy-picks-server
    ```

2. **Navigate to the project directory**:

    ```bash
    cd prodigy-picks-api
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Create a `.env` file** in the root directory of the project and add your environment variables:

    ```env
    MONGO_CONNECTION_STRING=your_mongo_uri
    TOKEN_SECRET=your_secret
    ```

5. **Start the server**:

    ```bash
    npm start
    ```
