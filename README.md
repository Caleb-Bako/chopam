# 🚀 ChopAm (Full-Stack Monorepo)

A full-stack, real-time food ordering and delivery tracking application. This repository houses both the responsive Next.js client engine and the type-safe Express backend, demonstrating a complete integration of database operations, sandbox payment flows, and event-driven WebSocket communication.

---

## 🛠️ Technologies
* **Frontend:** Next.js (App Router), Tailwind CSS
* **Backend Runtime:** Node.js, Express, TypeScript
* **Database Layer:** MongoDB Atlas (via Mongoose)
* **Real-Time Engine:** Socket.io (WebSockets)
* **Payment Infrastructure:** Paystack API

---

## ✨ Features
You can seamlessly place food orders and track them in real-time to get:
* **Interactive Cart Experience:** Dynamic client-side basket management with live price calculations.
* **Secure Server-Side Totals:** Automated total verification on the backend to guarantee pricing integrity.
* **Sandbox Payment Gateway:** Secure transaction initialization and redirection handling via the Paystack ecosystem.
* **Instant Webhook Reconciliation:** Background server-to-server confirmation loops that process payments reliably.
* **Live WebSocket Tracking:** Dedicated customer room subscriptions providing instant status updates without page reloads.

---

## ⚙️ Process
Why I built this is to tackle a real problem faced in localized logistics—the friction and lack of transparency between making a food order online, ensuring payments are successfully caught, and tracking production status. Most standard apps either use slow page polling or force customers to call the store to check on their meal. I wanted to build a decoupled, event-driven system where the backend, payment gateway, and frontend chat with each other instantly.

To bring this to reality, I first built a robust Node.js/Express MVC engine using TypeScript and Mongoose to securely manage menu schemas and order logs. I focused heavily on ensuring the frontend doesn't dictate price details; the server handles the financial truth directly from the database.

The next step was integrating the Paystack API layer. When a user submits an order, the system registers it as pending, computes the price in Kobo, and initializes a checkout session. Once the user pays inside the sandbox, Paystack passes a secure background Webhook payload directly back to our server. 

Finally, I introduced Socket.io into the architecture. The moment the server receives the successful payment webhook, it updates MongoDB and instantly broadcasts a status update down a dedicated tracking room. The user sees their milestone tracker transition from "Pending" to "Preparing" in real-time.

---

## 🧠 What I Learnt
* **Data Layer Separation:** Ensuring the backend maintains absolute control over mathematical calculations (like pricing and cart totals) is critical for enterprise application security.
* **Event-Driven Webhooks:** Learning how server-to-server cryptographic handshakes operate changed how I view background data synchronization.
* **State Lifecycles over Sockets:** Initializing stable WebSocket connections, isolating data down dynamic room chains, and properly destroying listeners on component unmount is essential for responsive UIs.
* **The Importance of Middleware Matching:** Tiny details in path strings (like a missing leading slash in Express middleware routing) can trigger cascading HTML fallback responses that disrupt the client JSON parser.
* **Type-Safety with Database Wrappers:** Working with `.lean()` in Mongoose query structures is highly efficient for removing heavy prototype mechanisms when raw data processing is needed in TypeScript.

---

## 🚀 How Can It Be Improved
* **Kitchen/Admin Panel UI:** Build a specialized admin management console that tracks incoming orders via WebSockets so operators can step status nodes forward manually.
* **Cryptographic Webhook Verification:** Add header signature verification (`X-Paystack-Signature`) using HMAC SHA512 to ensure incoming webhook calls originate strictly from Paystack.
* **Robust Auth Guards:** Integrate NextAuth.js or JWT workflows so customers can access a persistent order history portfolio screen.
* **Automated Dispatch Integration:** Connect localized delivery routing maps to dynamically calculate rider arrival times.

---

## 💻 How to Run & Test Locally

Ensure you have Node.js and npm installed on your machine.

### 1. Backend Setup
```bash
# Navigate to your backend directory from the project root
cd server

# Install dependencies
npm install

# Create a .env file and add your configuration strings:
# MONGO_URI=your_mongodb_connection_string
# PAYSTACK_SECRET_KEY=your_paystack_test_secret_key

# Start the TypeScript development server
npm run dev
```

### 2. Client Setup
```bash
# Open a new terminal instance and navigate to your frontend directory
cd client

# Install frontend dependencies
npm install

# Start the Next.js client application
npm run dev
```

Once both servers are running, open your browser to http://localhost:3000, add items to your basket, and walk through the real-time checkout pipeline! 🚀

🤝 Let's Connect
Curious about the architectural patterns under the hood, Mongoose schema controllers, or Socket.io configurations? Reach out—let's build!