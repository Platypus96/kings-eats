# Kings Eats - Canteen Ordering App

Kings Eats is a modern, real-time food ordering application designed for the King's Canteen at IIIT Allahabad. It provides a seamless experience for students to browse the menu, place orders, and track their status, while offering a comprehensive dashboard for administrators to manage the canteen's operations.

## ✨ Features

-   **Google Authentication**: Secure sign-in restricted to `@iiita.ac.in` email addresses.
-   **Dynamic Menu**: Browse today's special menu with real-time availability and pagination.
-   **Shopping Cart**: Easily add and manage items in a persistent shopping cart with an automatic 5% discount on the total.
-   **Order Placement**: A straightforward checkout process with mandatory hostel selection.
-   **Real-time Order Tracking**: Users can view the status of their orders (`Pending`, `Approved`, `Completed`) on their personal order page.
-   **Live Notifications**: Receive instant notifications, with phone vibration, when an order is approved, including the estimated completion time.
-   **Admin Dashboard**: A dedicated dashboard for canteen administrators to:
    -   Manage all incoming orders in real-time.
    -   Approve or decline orders.
    -   Manage the daily menu with search and pagination, including adding, editing, and setting item availability.

## 🚀 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore Realtime Database)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **AI (Future-Ready)**: [Genkit](https://firebase.google.com/docs/genkit)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A Firebase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your Firebase project configuration. You can find these details in your Firebase project settings.

    ```bash
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## ☁️ Deployment

This application is ready to be deployed on platforms like Vercel or Firebase App Hosting.

**Important**: When you deploy, remember to add your production URL (e.g., `your-app-name.vercel.app`) to the list of **Authorized Domains** in your Firebase project's Authentication settings to ensure Google Sign-In works correctly.
