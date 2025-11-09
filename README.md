# 🛒 SkyShopWise E Commerce  
**AI enhanced e commerce platform built with Next.js, TypeScript, MongoDB, and OpenAI**

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-000000?logo=nextauth&logoColor=white)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

---

## 🧩 Overview  

**SkyShopWise E Commerce** is a full stack online shopping platform that combines a modern storefront with AI powered shopping assistance.  
Customers can browse products, manage carts and wishlists, track orders, and get personalised suggestions through an AI shopping assistant and recommendation widgets.

This application is built as a Master project and focuses on real world patterns for authentication, product catalog management, and AI assisted user experiences.

---

## 🌐 Live Preview  

You can try the app here:

- **Production:** https://sky-shop-wise-ecom.vercel.app  

> Note: The live preview requires environment variables for database, authentication, and AI to be configured in Vercel.

---

## 📸 Interface Preview  

![Home Page](/public/Chatbot.png)  

---

## ⚡ Core Features  

- **Modern Storefront Experience**  
  - Product listing with images, prices, descriptions, and categories  
  - Product detail pages with key information and clear calls to action  
  - Search and filtering experiences for finding products quickly  

- **User Accounts and Authentication**  
  - Sign up and sign in with secure session handling  
  - Authentication powered by NextAuth.js with server side session checks  
  - Protected pages for orders, profile, and account data  

- **Shopping Cart and Wishlist**  
  - Add to cart from product list or detail pages  
  - Update quantity, remove items, and clear cart  
  - Wishlist or favourites for saving products to revisit later  

- **Order Flow**  
  - Basic checkout flow for placing orders  
  - Order history page so users can review their past purchases  
  - Stored user profile and address information for a smoother repeat checkout  

- **AI Powered Shopping Support**  
  - AI assistant that can help users discover products and answer questions in natural language  
  - Smart suggestions based on user context such as viewed items or categories  
  - Room to expand toward more advanced personalised recommendations  

- **Responsive and Accessible UI**  
  - Layout designed for desktop and laptop experiences  
  - Built with Tailwind CSS utility classes for consistent spacing and typography  
  - Error, empty, and loading states designed for a robust UX  

---

## 🧠 Technology Stack  

### **Frontend**
- **Next.js App Router** as the main framework  
- **React 18 + TypeScript** for strongly typed UI components  
- **Tailwind CSS** for styling and layout  
- **Client and server components** for optimised rendering  
- **Next.js route handlers** for API endpoints within the same codebase  

### **Backend and Data**
- **MongoDB** as the primary database for users, products, and orders  
- **Mongoose or a similar ODM** for schema modelling and queries  
- **NextAuth.js** for authentication and session management  
- **Server side validation** for incoming requests  

### **AI and Integrations**
- **OpenAI API** for the AI shopping assistant and recommendations  
- Structured prompts and responses designed for customer friendly answers  

### **Infrastructure**
- **Vercel** for hosting the Next.js application  
- **Environment variables** for database URI, NextAuth secrets, providers, and AI keys  

---

## 🚀 Getting Started  

### **1. Clone the Repository**

```bash
git clone https://github.com/SkyJirayuDev/SkyShopWiseEcom.git
cd SkyShopWiseEcom
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Configure Environment Variables**

Create a `.env.local` file in the project root and configure the required values.  
Example keys you are likely to need:

```env
# app url
NEXT_PUBLIC_APP_URL=http://localhost:3000

# database
MONGODB_URI=your_mongodb_connection_string

# nextauth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# oauth providers if configured
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# openai
OPENAI_API_KEY=your_openai_api_key
```

Adjust the variable names based on the actual configuration in this repo.

### **4. Run the Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser to view the app.

---

## 📡 Application Modules  

> The exact structure may be organised by route groups and folders, but conceptually the app consists of these modules.

| Module        | Description |
|--------------|-------------|
| **Auth**     | Handles user registration, login, logout, and session management through NextAuth.js |
| **Products** | Product catalogue, listing, detail pages, and search or filter logic |
| **Cart**     | Manage user cart items, quantities, and price calculation |
| **Wishlist** | Store and manage favourite products for each user |
| **Orders**   | Create and list orders, show order history for authenticated users |
| **AI Assistant** | Routes and handlers that call OpenAI API for chat based help and suggestions |

---

## 🏗️ Architecture Highlights  

- **Full stack Next.js application**  
  - UI, API routes, and server logic live in one codebase  
  - Uses the App Router pattern and server components for performance  

- **Session Aware UI**  
  - Authenticated views for account specific pages  
  - Conditional rendering of nav items and actions based on session state  

- **Database Driven Domain Model**  
  - Collections for users, products, orders, and potentially carts or wishlists  
  - Clear separation between domain models and UI components  

- **AI as a First Class Feature**  
  - The AI assistant is integrated into the shopping experience instead of being an isolated tool  
  - Easy to extend with new prompts, product explanation templates, and recommendation logic  

---

## 🎯 Learning Outcomes  

Through building **SkyShopWise E Commerce**, I focused on:

- Designing a realistic e commerce experience with modern web technologies  
- Integrating authentication and session handling into a Next.js app  
- Modelling products, carts, and orders in a document database  
- Using OpenAI to assist users while shopping and to experiment with personalised UX  
- Deploying and configuring a full stack application on Vercel with environment based settings  

---

## 👨‍💻 About the Developer  

Developed by **Sky Jirayu Saisuwan (@SkyJirayuDev)**  

- 🌐 [LinkedIn](https://www.linkedin.com/in/skyjirayu)  
- 💻 [GitHub](https://github.com/SkyJirayuDev)  

This project is part of my Master level work and also a portfolio example of a modern AI enhanced e commerce application.

---

## 🪪 License  

This repository is currently shared for learning and portfolio purposes.  
If you want to use SkyShopWise E Commerce in a commercial product or a new research project, please contact me on LinkedIn or by email to discuss licensing and collaboration.
