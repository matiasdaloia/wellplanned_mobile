# Wellplanned Mobile App

Wellplanned is a mobile application designed to help users follow personalized nutrition plans provided by their nutritionists. The app offers a user-friendly interface to upload diet plans, track progress, and receive meal recommendations.

## Features

- Upload diet plans in PDF format
- Personalized meal recommendations
- Track progress and achievements
- User-friendly onboarding process
- Professional guidance at your fingertips

## Installation Instructions

To run the Wellplanned mobile app locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/matiasdaloia/wellplanned_mobile.git
   cd wellplanned_mobile
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following environment variables:
   ```sh
   EXPO_PUBLIC_API_URL=https://your_supabase_url
   EXPO_PUBLIC_API_KEY=your_supabase_api_key
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the app:**
   ```sh
   npm start
   ```

Note: For this to work, you need to have `wellplanned_api` running locally.

## Overview of the App

The Wellplanned mobile app is designed to provide users with a seamless experience in following their personalized nutrition plans. The app includes features such as uploading diet plans, receiving meal recommendations, and tracking progress. The onboarding process is designed to be user-friendly, ensuring that users can easily get started with their personalized plans.

## How to Run the App Locally

To run the app locally, follow the installation instructions provided above. Make sure to set up the environment variables correctly and install all the necessary dependencies. Once everything is set up, you can start the app using the `npm start` command. The app will be available on your local development server, and you can access it using the Expo Go app on your mobile device or an emulator.
