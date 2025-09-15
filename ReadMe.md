# User Management & Virtual Account Service

This project is a Node.js/Express.js application that provides user authentication, profile management, and virtual account creation.  
It also supports webhook processing for external integrations.  
The app is containerized with Docker and uses MongoDB as its database.

---

## Features

- **User Registration** – Create a new user account.
- **Login & JWT Authentication** – Secure login with JSON Web Tokens.
- **Profile Management** – Update and retrieve user profile details.
- **Virtual Account Creation** – Generate virtual accounts for users.
- **Webhook Handling** – Process events from external services.
- **Dockerized Setup** – Run both the app and MongoDB in containers.

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Containerization:** Docker & Docker Compose  

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (if running outside Docker)  
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)  

### Environment Variables
Create a `.env` file in the root directory with the following variables (see `.env.example` for placeholders):

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/myapp
JWT_SECRET=your_jwt_secret
```
**Note:** Do not commit your real secrets to Git.

### Running with Docker
```bash
# Build and start containers
docker-compose up --build
```

The app should now be running on `http://localhost:5000`.

---

## API Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request**
```json
{
  "firstName": "ope",
  "lastName": "shade",
  "password": "ope123",
  "email": "op20@gmail.com"
}
```

**Response**
```json
{
  "message": "User registered successfully",
  "userId": "68c7dd0ab5eb78aefe66ded8"
}
```

### 2. Login
**POST** `/api/auth/login`

**Request**
```json
{
  "password": "ope123",
  "email": "ope@gmail.com"
}
```

**Response**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Get User Profile
**GET** `/api/user/profile`

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Response**
```json
{
  "virtualAccountNumber": "",
  "firstName": "damola",
  "lastName": "shade",
  "email": "damola@gmail.com",
  "createdAt": "2025-09-14T13:03:51.960Z",
  "updatedAt": "2025-09-14T13:42:09.911Z",
  "id": "68c6bd3712d96f9a97af7442"
}
```

### 4. Update User Profile
**PUT** `/api/user/profile`

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Request**
```json
{
  "firstName": "ope",
  "lastName": "shade",
  "password": "ope123",
  "email": "op20@gmail.com"
}
```

**Response**
```json
{
  "virtualAccountNumber": "",
  "firstName": "damola",
  "lastName": "shade",
  "email": "damola@gmail.com",
  "createdAt": "2025-09-14T13:03:51.960Z",
  "updatedAt": "2025-09-14T13:42:09.911Z",
  "id": "68c6bd3712d96f9a97af7442"
}
```

### 5. Create Virtual Account
**POST** `/api/banking/virtual-account`

**Headers**
```
Authorization: Bearer <jwt-token>
```

**Response**
```json
{
  "message": "Virtual account created successfully",
  "virtualAccountNumber": "1234567890"
}
```

---

## Safe Haven Integration

This project integrates with **Safe Haven MFB** APIs for virtual account creation and payments.  
To set this up, follow these steps:

### 1. Create a Corporate Account
- If you don’t already have one, create a **Corporate Account** with Safe Haven.

### 2. Create an App
- From the Safe Haven dashboard, go to **Settings → Create App**.
- After creation, you’ll be given a **Client ID**.

### 3. Generate a Public Key
- On the app page, locate the **x5460 Public Key** section.
- You’ll see a command to run in your terminal to generate the key.  
  Example (replace with actual command from Safe Haven docs):
  ```bash
  openssl genrsa -out private.pem 2048
  openssl rsa -in private.pem -pubout -out public.pem
  ```

### 4. Configure Environment Variables
Add the following Safe Haven configuration variables to your `.env` file:

```env
SAVE_HAVEN_BASE_URL=https://api.sandbox.safehavenmfb.com
CLIENT_ID=your_client_id_here
GRANT_TYPE=client_credentials
CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
COMPANY_URL=https://your-company-url.ngrok-free.app
EXPIRY=2025-09-21T12:00:00Z
SETTLEMENT_ACCOUNT_NUMBER=your_settlement_account_number
SETTLEMENT_BANK_CODE=999240
AMOUNT_CONTROL=Fixed
CALL_BACK_URL=https://your-company-url.ngrok-free.app
ACCOUNT_VALIDITY=900
```

**Notes:**
- `GRANT_TYPE` and `CLIENT_ASSERTION_TYPE` usually use the defaults above, but check Safe Haven docs for other options.  
- `EXPIRY` is when your client assertion token should expire.  
- `AMOUNT_CONTROL` defines how transactions are handled (`Fixed`, or see docs for alternatives).  
- `ACCOUNT_VALIDITY` sets how long the virtual account is valid (in seconds).  
- For sandbox testing, use the default **Settlement Bank Code**: `999240`.

### 5. JWT Secrets
For local authentication, generate **JWT secrets** for access and refresh tokens:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice and copy the outputs into your `.env` file:

```env
ACCESS_TOKEN_SECRET=your_generated_secret
REFRESH_TOKEN_SECRET=your_generated_secret
```

---

## Development

```bash
# Install dependencies
npm install

# Run locally (without Docker)
npm start
```

### Docker command
```bash
# Install dependencies
npm install

# Run locally (without Docker)
npm start
```

---


---

## License

This project is licensed under the MIT License.
# maxim-backend
