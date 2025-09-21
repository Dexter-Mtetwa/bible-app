import { Verse } from '../db/bible';

export const formatVerseReference = (verse: Verse): string => {
  return `${verse.book_name} ${verse.chapter}:${verse.verse}`;
};

export const formatVerseText = (verse: Verse): string => {
  return `${verse.verse} ${verse.text}`;
};

export const generatePrayer = (verse: Verse): string => {
  const prayers = [
    "Lord, help me to understand and apply this truth in my daily life.",
    "Father, may this verse guide my thoughts and actions today.",
    "God, thank you for this reminder of your love and wisdom.",
    "Heavenly Father, help me to live according to your word.",
    "Lord, may this scripture strengthen my faith and trust in you.",
    "Father, guide me to share this truth with others who need it.",
    "God, help me to meditate on this verse throughout the day.",
    "Lord, may this word be a lamp to my feet and a light to my path.",
  ];

  // Use verse ID to get a consistent prayer for the same verse
  const index = verse.id % prayers.length;
  return prayers[index];
};

export const getVerseOfTheDay = async (): Promise<{ verse: Verse; prayer: string }> => {
  // This would typically get a verse based on the current date
  // For now, we'll use a random verse
  const { bibleDB } = await import('../db/bible');
  const verse = await bibleDB.getVerseOfTheDay();
  const prayer = generatePrayer(verse);
  
  return { verse, prayer };
};

export const getTestamentName = (testament: 'old' | 'new'): string => {
  return testament === 'old' ? 'Old Testament' : 'New Testament';
};

export const getBookAbbreviation = (bookName: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Genesis': 'Gen',
    'Exodus': 'Exo',
    'Leviticus': 'Lev',
    'Numbers': 'Num',
    'Deuteronomy': 'Deut',
    'Joshua': 'Josh',
    'Judges': 'Judg',
    'Ruth': 'Ruth',
    '1 Samuel': '1 Sam',
    '2 Samuel': '2 Sam',
    '1 Kings': '1 Kgs',
    '2 Kings': '2 Kgs',
    '1 Chronicles': '1 Chron',
    '2 Chronicles': '2 Chron',
    'Ezra': 'Ezra',
    'Nehemiah': 'Neh',
    'Esther': 'Esth',
    'Job': 'Job',
    'Psalms': 'Ps',
    'Proverbs': 'Prov',
    'Ecclesiastes': 'Eccl',
    'Song of Solomon': 'Song',
    'Isaiah': 'Isa',
    'Jeremiah': 'Jer',
    'Lamentations': 'Lam',
    'Ezekiel': 'Ezek',
    'Daniel': 'Dan',
    'Hosea': 'Hos',
    'Joel': 'Joel',
    'Amos': 'Amos',
    'Obadiah': 'Obad',
    'Jonah': 'Jonah',
    'Micah': 'Mic',
    'Nahum': 'Nah',
    'Habakkuk': 'Hab',
    'Zephaniah': 'Zeph',
    'Haggai': 'Hag',
    'Zechariah': 'Zech',
    'Malachi': 'Mal',
    'Matthew': 'Matt',
    'Mark': 'Mark',
    'Luke': 'Luke',
    'John': 'John',
    'Acts': 'Acts',
    'Romans': 'Rom',
    '1 Corinthians': '1 Cor',
    '2 Corinthians': '2 Cor',
    'Galatians': 'Gal',
    'Ephesians': 'Eph',
    'Philippians': 'Phil',
    'Colossians': 'Col',
    '1 Thessalonians': '1 Thess',
    '2 Thessalonians': '2 Thess',
    '1 Timothy': '1 Tim',
    '2 Timothy': '2 Tim',
    'Titus': 'Titus',
    'Philemon': 'Phlm',
    'Hebrews': 'Heb',
    'James': 'James',
    '1 Peter': '1 Pet',
    '2 Peter': '2 Pet',
    '1 John': '1 John',
    '2 John': '2 John',
    '3 John': '3 John',
    'Jude': 'Jude',
    'Revelation': 'Rev',
  };

  return abbreviations[bookName] || bookName;
};
