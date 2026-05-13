# Sunset Finance 🌅

Sunset Finance is a modern, offline-first personal finance application built with React Native and Expo. It helps users track their expenses, manage budgets, and reach their savings goals with a beautiful, intuitive interface.

## ✨ Features

- **Transaction Management**: Add, edit, and delete transactions with categories and dates.
- **Budgeting**: Set monthly budgets for different categories and track your spending against them.
- **Savings Goals**: Create and track progress towards specific savings milestones.
- **Visual Insights**: Interactive charts and graphs to visualize your spending patterns.
- **Offline First**: All data is stored locally using SQLite for maximum privacy and performance.
- **Android Widget**: A "Quick Add" home screen widget for rapid expense entry.
- **Beautiful UI**: Clean, responsive design using React Native Paper and custom themes.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device or an emulator (Android/iOS)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ramya-Shah/expense-app-mobile.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Open the app:
   - Scan the QR code with your Expo Go app (Android/iOS).
   - Press `a` for Android emulator.
   - Press `i` for iOS simulator.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Language**: TypeScript
- **Database**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Styling**: [React Native Paper](https://react-native-paper.com/)
- **Charts**: [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
- **State Management**: React Context API
- **Navigation**: [React Navigation](https://reactnavigation.org/)

## 📱 Project Structure

```text
src/
├── components/   # Reusable UI components
├── context/      # State management using Context API
├── database/     # SQLite configuration and helper functions
├── navigation/   # Root and Tab navigators
├── screens/      # Main application screens
├── theme/        # Color palettes and global styles
└── widget/       # Android home screen widget logic
```

## 📄 License

This project is private and intended for personal use.
