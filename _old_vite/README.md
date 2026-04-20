# Cinema Focus - High-End Audio & Home Cinema

A premium web application for a high-end audio and home cinema installation business. Built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**.

## Features

### 🎨 Frontend
- **Modern, Premium UI**: Designed with a luxury aesthetic using Tailwind CSS and Lucide React.
- **Dynamic Content**:
    - **Hero Section**: Fully customizable title, subtitle, CTA, and background image.
    - **Projects Gallery**: Dynamic portfolio grid fetched from Firestore.
    - **Footer**: Dynamic contact info, social links, and working hours.
    - **Products & Categories**: Browsable catalog with filtering.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

### 🛠 Admin Panel (`/admin`)
A comprehensive dashboard to manage the entire website without touching code.
- **Projects Management**: Add, view, and delete portfolio projects (with image uploads).
- **Site Control**:
    - **Hero Editor**: Update the main landing banner details.
    - **Philosophy Section**: Edit the "About Us" text.
    - **Trust Badges**: Customize the 4 key service highlights (icons & text).
    - **Footer & Contact**: Manage address, multiple phone numbers, working hours, and social media links.
    - **Database Ops**: Seed the database with sample data.
- **Messages**: View inquiries sent via the Contact form.
- **Analytics**: View real-time page visit statistics.
- **User Management**: Manage admin access.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Backend / Database**: Firebase Firestore
- **Storage**: Firebase Storage (for images)
- **Deployment**: Ready for Vercel / Netlify / Firebase Hosting

## Setup Instructions

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Rules Configuration (Crucial)
For the Admin Panel and frontend to work correctly, you must set the following rules in your **Firebase Console**.

#### Firestore Database Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} { allow read: if true; allow write: if request.auth != null; }
    match /categories/{category} { allow read: if true; allow write: if request.auth != null; }
    match /hero/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /site_content/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /messages/{message} { allow create: if true; allow read, delete, update: if request.auth != null; }
    match /stats/{stat} { allow create, update: if true; allow read: if request.auth != null; }
    match /admins/{admin} { allow read, write: if request.auth != null; }
    match /projects/{project} { allow read: if true; allow write: if request.auth != null; }
    match /{document=**} { allow read, write: if false; }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Run Locally
```bash
npm run dev
```

## Admin Access
Navigate to `/admin` to log in. In this demo version, authentication logic handles the "admin" state. Ensure you have an `admins` collection in Firestore with your user details if using strict role-based auth.
