# C&S Hymn Book (Iwe Orin Mimo Cherubim & Seraphim)

A modern, fast, cross-platform mobile and web application for the **Cherubim & Seraphim (C&S) Christian Hymn Book**, built with **React Native** and **Expo**.

Re-engineered from the ground up from the original Android APK (`com.hymnals.sourcecodings.cshymns`), featuring all **980 hymns across 58 liturgical categories**, complete with original Yoruba diacritics, tune/meter references, scripture citations, choruses (*Egbe*), and liturgical texts.

---

## ✨ Features

- **📖 Complete Hymnal Collection (980 entries)**:
  - **Orin Akúnlẹkọ** (Kneeling Hymns i – xlv)
  - **Full Hymnal (K&S 1 – K&S 865)**
  - **Orin Isọji ati Idaraya Emi** (Revival Hymns 1 – 49)
  - **Orin Dafidi** (Psalms 24, 32, 51, 84, 99, 116, 128, 130, 133)
  - **Adura Oluwa** (The Lord's Prayer)
  - **Igbagbọ & Katikismu** (Apostles' & Nicene Creed, Orders of Holy Communion)
- **🔍 Instant Multi-Mode Search**:
  - Search by hymn number (e.g., `474`, `100`, `K&S 20`, `Saamu 24`)
  - Accent-insensitive search in Yoruba (e.g., searching `Ope` matches `Ọpẹ`)
  - Full-text search across all stanza lyrics, tunes/meters, and biblical references
- **🔢 Quick Dial Keypad**:
  - Fast numeric dial pad for instantaneous jump to any hymn announced during church service.
- **🎨 3 Liturgical Reading Themes**:
  - **Sacred Light**: Crisp, clean daytime worship.
  - **Night Navy (Dark Mode)**: Eye-friendly dark navy for evening vigils and overnight services.
  - **Sepia Parchment**: Warm paper tone for prolonged hymn singing.
- **🔤 Dynamic Typography**:
  - Adjustable font size (A- / A+) with live zoom preview.
- **❤️ Favorites & Worship Setlists**:
  - Bookmark favorite hymns with offline persistence.
  - Build custom collections for Sunday Divine Service, Harvest, Vigils, and Special Programs.
- **📤 Share & Copy**:
  - One-tap copying and sharing of formatted hymn lyrics with title, scripture, stanzas, and chorus.
- **📱 4 Clean Tab Navigation Views**:
  - **Hymns**: Full directory of 980 hymns with inline live search, category filter pills, and quick `#` dial pad.
  - **Categories**: 58 visual liturgical category cards.
  - **Liturgy**: Dedicated sections for Akunleko, Isoji, Psalms, Lord's Prayer & Creeds.
  - **Favorites**: Saved hymns and customized Sunday Divine Service setlists.
- **🌐 Cross-Platform**:
  - Runs natively on **Android**, **iOS**, and **Web** with responsive layouts for phones and tablets.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
cd C:\Users\saintsbuilder\Documents\Projects\cshymnbook
npm install
```

### Running the App

```bash
# Start the Expo interactive menu
npm start

# Run on Web directly in your browser
npm run web

# Run on Android (via emulator or Expo Go on physical device)
npm run android

# Run on iOS (via simulator or Expo Go on physical device)
npm run ios
```

---

## 📁 Project Structure

```
cshymnbook/
├── assets/
│   ├── data/
│   │   └── cshymns.json          # Complete extracted dataset (980 hymns, 58 categories)
│   ├── icon.png                  # App launcher icon
│   └── adaptive-icon.png
├── src/
│   ├── types/
│   │   └── hymn.ts               # TypeScript data models
│   ├── constants/
│   │   └── theme.ts              # Light, Dark, and Sepia themes
│   ├── services/
│   │   ├── hymnService.ts        # Search & data querying engine
│   │   └── storageService.ts     # Persistent storage (Favorites, Themes, Setlists)
│   ├── components/
│   │   ├── Header.tsx            # Modern custom top bar
│   │   ├── HymnCard.tsx          # Hymn list item card
│   │   ├── CategoryCard.tsx      # Liturgical category card
│   │   └── QuickNumberPad.tsx    # Instant numeric keypad
│   └── screens/
│       ├── HymnListScreen.tsx    # Main hymn directory with instant filter
│       ├── CategoryListScreen.tsx# 58 Liturgical categories
│       ├── CategoryDetailScreen.tsx# Hymns in a category
│       ├── HymnDetailScreen.tsx  # Hymn reader with zoom, themes, and navigation
│       ├── SearchScreen.tsx      # Advanced search with suggestions
│       ├── FavoritesScreen.tsx   # Favorites & Service setlists
│       └── SpecialLiturgyScreen.tsx# Akunleko, Isoji, Psalms & Creeds
├── App.tsx                       # Root application container & tab router
├── app.json                      # Expo app configuration
└── package.json
```

---

## 📜 Reverse Engineering Background

The original mobile application (`seraph+hymn_1.0_APKPure.apk` / `com.hymnals.sourcecodings.cshymns`) was inspected using static Dalvik bytecode analysis:
- The app had no external SQLite database or JSON asset files.
- Each hymn was compiled directly into an individual Java class implementing methods:
  - `KSi_getNumber()`: Stanza numbers
  - `KSi_getContent()`: Stanza lyrics
  - `KSi_getChorus()`: Chorus text or "Amin"
- A master `DisplayDetails` class maintained four arrays of 913 items for hymn numbers, titles, meters, and scriptures.
- A secondary switch statement in `HymnSearchIndex` (14,611 Dalvik instructions) mapped indices 0–912 to the hymn classes.
- Additional packages contained 49 Isoji hymns, 9 Psalms, the Lord's Prayer, and 8 Creed/Catechism texts.
- All 980 entries were extracted and preserved with pristine Yoruba diacritics.

---

## 🛡️ Legal, Privacy Policy & Terms of Use

C&S Hymn Book is built with a deep commitment to user privacy, offline reliability, and preservation of sacred church tradition:

- **100% Offline by Design**: Operates entirely without network requirements. Zero telemetry, zero analytics, zero data harvesting.
- **Zero Advertising**: Completely ad-free to maintain a solemn, reverent atmosphere during worship.
- **COPPA & GDPR Compliant**: Safe for congregants, children, and families of all ages.
- **Package Name**: `com.fajostech.cshymnbook`

### Policy Documents & Live Links

- **Privacy Policy**: [PRIVACY_POLICY.md](PRIVACY_POLICY.md) | Web URL: [https://fajos.github.io/cshymnbook/privacy-policy.html](https://fajos.github.io/cshymnbook/privacy-policy.html)
- **Terms of Use**: [TERMS_OF_USE.md](TERMS_OF_USE.md) | Web URL: [https://fajos.github.io/cshymnbook/terms-of-use.html](https://fajos.github.io/cshymnbook/terms-of-use.html)
- **Official Documentation Portal**: [https://fajos.github.io/cshymnbook/](https://fajos.github.io/cshymnbook/)

---

## ⚖️ License & Heritage

Liturgical texts, prayers, and sacred hymns belong to the ecclesiastical heritage of the **Eternal Sacred Order of the Cherubim & Seraphim Church worldwide**. This software application and UI are maintained by **Fajostech / Femi Adeyemi** for spiritual worship, educational study, and devotions.
