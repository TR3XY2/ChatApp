# Real-time Chat Application with Sentiment Analysis

## 🚀 Live Demo

Frontend: https://witty-glacier-0a0c95903.7.azurestaticapps.net/
Backend: https://chatapp-backend-1.azurewebsites.net/

---

## 📌 Features

* Real-time chat using Azure SignalR
* Messages stored in Azure SQL Database
* Sentiment analysis using Azure AI Language
* Messages are labeled as:

  * Positive
  * Negative
  * Neutral

---

## 🛠 Tech Stack

### Backend

* ASP.NET Core (.NET 8)
* Azure SignalR Service
* Azure SQL Database
* Azure AI Language (Text Analytics)

### Frontend

* React (Vite)
* SignalR client

---

## ⚙️ How it works

1. User sends message
2. Backend processes message
3. Sentiment is analyzed using Azure AI
4. Message is saved to database
5. Message is broadcast via SignalR
6. All users receive it in real-time

---

## 🔧 Setup

### Backend

Set environment variables:

* `DefaultConnection`
* `AzureAI__Endpoint`
* `AzureAI__Key`

Run:

```
dotnet run
```

---

### Frontend

Set:

```
VITE_BACKEND_BASE_URL=https://chatapp-backend-1.azurewebsites.net
```

Run:

```
npm install
npm run dev
```

---

## 📦 Deployment

* Backend: Azure Web App
* Frontend: Azure Static Web Apps

---

## 📎 Notes

* Uses Azure services for scalability
* Clean architecture (Application / Infrastructure / API)
* Real-time communication via WebSockets

---
