# Skill Exchange Community

> A collaborative platform for users to exchange skills, connect, chat, and grow together.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview
Skill Exchange Community is a web application that enables users to:
- Offer and request skill exchanges
  ![WhatsApp Image 2026-01-22 at 1 30 32 PM](https://github.com/user-attachments/assets/1cb722f5-5d26-4559-8405-d82b2d703c7a)

- Chat with other users
  ![WhatsApp Image 2026-01-22 at 1 30 03 PM](https://github.com/user-attachments/assets/8f86b4c1-ca0a-4fec-8e02-26bc68e31c79)

- Track progress and certifications
- Manage profiles and session history

## Features
- **Authentication**: Signup, login, OTP verification
- **Skill Exchange**: Find, request, and manage skill swaps
- **Chat**: Real-time chat between users
- **Dashboard**: Track badges, progress, and session history
- **Certifications**: Manage and display certificates
- **Profile Management**: Edit profile, view user reviews
- **Responsive UI**: Modern, mobile-friendly design

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Bootstrap
- **State Management**: React Context API
- **Routing**: React Router
- **APIs**: Axios for HTTP requests
- **Real-time**: STOMP over WebSockets, SockJS

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/aakashsharma003/SkillExchangeFE.git
cd SkillExchangeFE
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

### Building for Production
```bash
npm run build
# or
yarn build
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Project Structure
```
src/
  api/            # API calls (auth, chat, skills, user, etc.)
  assets/         # Images, icons, and static assets
  components/     # Reusable UI and feature components
  context/        # React Context providers (auth, config)
  lib/            # Utility functions
  routes/         # App routes and route guards
  services/       # Service layer (future use)
  types/          # TypeScript types
  users/          # User-related pages/components
  utils/          # Utility helpers
  views/          # Main app views/pages
  index.css       # Global styles
  App.tsx         # App root component
  main.tsx        # App entry point
```

## Usage
- **Sign up** or **log in** to your account
- **Browse** or **search** for skills to exchange
- **Send/receive** skill exchange requests
- **Chat** with other users in real-time
- **Track** your progress, badges, and certifications
- **Edit** your profile and manage your session history

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License
This project is licensed under the MIT License.
