# Bible Mobile App

A React Native mobile app built with Expo and TypeScript for reading and studying the Bible.

## Features

- **Verse of the Day**: Daily inspirational verses with generated prayers
- **Bible Reading**: Browse books, chapters, and verses with intuitive navigation
- **Personal Study Tools**:
  - Highlight verses with different colors
  - Add personal notes to verses
  - Bookmark favorite verses
  - View reading history
- **Search**: Find verses by keywords
- **Offline Support**: Fully functional without internet connection

## Tech Stack

- **Framework**: Expo (managed workflow) + React Native
- **Language**: TypeScript
- **Database**: SQLite with `expo-sqlite`
- **Storage**: `@react-native-async-storage/async-storage`
- **Navigation**: `@react-navigation/native` (stack + bottom tabs)
- **UI**: React Native components with custom styling

## Project Structure

```
src/
├── db/
│   └── bible.ts              # SQLite database helper
├── screens/
│   ├── HomeScreen.tsx        # Verse of the Day, prayer
│   ├── BibleScreen.tsx       # Book → Chapter → Verse
│   ├── AssistantScreen.tsx   # Dummy AI interface
│   ├── UtilityScreen.tsx     # Bookmarks, history, tracking
│   ├── BookListScreen.tsx    # List of Bible books
│   ├── ChapterListScreen.tsx # List of chapters in a book
│   └── VerseDetailScreen.tsx # Individual verse details
├── components/
│   ├── VerseItem.tsx         # Renders a verse with tap actions
│   ├── NoteModal.tsx         # Add/edit notes
│   └── HighlightTag.tsx      # Highlight UI
├── storage/
│   └── localStore.ts         # AsyncStorage helpers
├── navigation/
│   └── AppNavigator.tsx      # Bottom tabs + stack
├── utils/
│   └── verseUtils.ts         # Verse of the Day, formatters
└── App.tsx                   # Entry point
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bible-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Usage

### Home Screen
- View the daily verse of the day
- Read the generated prayer
- Access quick navigation to other features

### Bible Reading
1. Tap "Bible" in the bottom navigation
2. Select a book from the Old or New Testament
3. Choose a chapter
4. Read verses and tap for options (highlight, note, bookmark)

### Personal Study
- **Highlights**: Tap any verse and select "Highlight"
- **Notes**: Add personal notes to verses
- **Bookmarks**: Save favorite verses for quick access
- **History**: View recently read verses

### Utilities
Access your personal study materials:
- View all bookmarks
- Browse reading history
- Manage notes and highlights

## Database

The app uses SQLite for storing Bible text. Currently includes sample data for:
- Genesis (chapters 1-3)
- Exodus (chapters 1-2)
- Leviticus (chapters 1-2)
- Matthew (chapters 1-2)
- Mark (chapters 1-2)
- Luke (chapters 1-2)
- John (chapters 1-3)

## Future Enhancements

- Full KJV Bible database
- Advanced search with filters
- AI-powered verse explanations
- Reading plans and devotionals
- Social sharing features
- Dark mode support
- Font size customization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- King James Version (KJV) Bible text (public domain)
- Expo team for the excellent development platform
- React Navigation for navigation solutions
