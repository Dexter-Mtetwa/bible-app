// Complete KJV Bible Data
export const BIBLE_BOOKS = [
  // Old Testament
  { id: 1, name: 'Genesis', testament: 'old', chapter_count: 50 },
  { id: 2, name: 'Exodus', testament: 'old', chapter_count: 40 },
  { id: 3, name: 'Leviticus', testament: 'old', chapter_count: 27 },
  { id: 4, name: 'Numbers', testament: 'old', chapter_count: 36 },
  { id: 5, name: 'Deuteronomy', testament: 'old', chapter_count: 34 },
  { id: 6, name: 'Joshua', testament: 'old', chapter_count: 24 },
  { id: 7, name: 'Judges', testament: 'old', chapter_count: 21 },
  { id: 8, name: 'Ruth', testament: 'old', chapter_count: 4 },
  { id: 9, name: '1 Samuel', testament: 'old', chapter_count: 31 },
  { id: 10, name: '2 Samuel', testament: 'old', chapter_count: 24 },
  { id: 11, name: '1 Kings', testament: 'old', chapter_count: 22 },
  { id: 12, name: '2 Kings', testament: 'old', chapter_count: 25 },
  { id: 13, name: '1 Chronicles', testament: 'old', chapter_count: 29 },
  { id: 14, name: '2 Chronicles', testament: 'old', chapter_count: 36 },
  { id: 15, name: 'Ezra', testament: 'old', chapter_count: 10 },
  { id: 16, name: 'Nehemiah', testament: 'old', chapter_count: 13 },
  { id: 17, name: 'Esther', testament: 'old', chapter_count: 10 },
  { id: 18, name: 'Job', testament: 'old', chapter_count: 42 },
  { id: 19, name: 'Psalms', testament: 'old', chapter_count: 150 },
  { id: 20, name: 'Proverbs', testament: 'old', chapter_count: 31 },
  { id: 21, name: 'Ecclesiastes', testament: 'old', chapter_count: 12 },
  { id: 22, name: 'Song of Solomon', testament: 'old', chapter_count: 8 },
  { id: 23, name: 'Isaiah', testament: 'old', chapter_count: 66 },
  { id: 24, name: 'Jeremiah', testament: 'old', chapter_count: 52 },
  { id: 25, name: 'Lamentations', testament: 'old', chapter_count: 5 },
  { id: 26, name: 'Ezekiel', testament: 'old', chapter_count: 48 },
  { id: 27, name: 'Daniel', testament: 'old', chapter_count: 12 },
  { id: 28, name: 'Hosea', testament: 'old', chapter_count: 14 },
  { id: 29, name: 'Joel', testament: 'old', chapter_count: 3 },
  { id: 30, name: 'Amos', testament: 'old', chapter_count: 9 },
  { id: 31, name: 'Obadiah', testament: 'old', chapter_count: 1 },
  { id: 32, name: 'Jonah', testament: 'old', chapter_count: 4 },
  { id: 33, name: 'Micah', testament: 'old', chapter_count: 7 },
  { id: 34, name: 'Nahum', testament: 'old', chapter_count: 3 },
  { id: 35, name: 'Habakkuk', testament: 'old', chapter_count: 3 },
  { id: 36, name: 'Zephaniah', testament: 'old', chapter_count: 3 },
  { id: 37, name: 'Haggai', testament: 'old', chapter_count: 2 },
  { id: 38, name: 'Zechariah', testament: 'old', chapter_count: 14 },
  { id: 39, name: 'Malachi', testament: 'old', chapter_count: 4 },
  
  // New Testament
  { id: 40, name: 'Matthew', testament: 'new', chapter_count: 28 },
  { id: 41, name: 'Mark', testament: 'new', chapter_count: 16 },
  { id: 42, name: 'Luke', testament: 'new', chapter_count: 24 },
  { id: 43, name: 'John', testament: 'new', chapter_count: 21 },
  { id: 44, name: 'Acts', testament: 'new', chapter_count: 28 },
  { id: 45, name: 'Romans', testament: 'new', chapter_count: 16 },
  { id: 46, name: '1 Corinthians', testament: 'new', chapter_count: 16 },
  { id: 47, name: '2 Corinthians', testament: 'new', chapter_count: 13 },
  { id: 48, name: 'Galatians', testament: 'new', chapter_count: 6 },
  { id: 49, name: 'Ephesians', testament: 'new', chapter_count: 6 },
  { id: 50, name: 'Philippians', testament: 'new', chapter_count: 4 },
  { id: 51, name: 'Colossians', testament: 'new', chapter_count: 4 },
  { id: 52, name: '1 Thessalonians', testament: 'new', chapter_count: 5 },
  { id: 53, name: '2 Thessalonians', testament: 'new', chapter_count: 3 },
  { id: 54, name: '1 Timothy', testament: 'new', chapter_count: 6 },
  { id: 55, name: '2 Timothy', testament: 'new', chapter_count: 4 },
  { id: 56, name: 'Titus', testament: 'new', chapter_count: 3 },
  { id: 57, name: 'Philemon', testament: 'new', chapter_count: 1 },
  { id: 58, name: 'Hebrews', testament: 'new', chapter_count: 13 },
  { id: 59, name: 'James', testament: 'new', chapter_count: 5 },
  { id: 60, name: '1 Peter', testament: 'new', chapter_count: 5 },
  { id: 61, name: '2 Peter', testament: 'new', chapter_count: 3 },
  { id: 62, name: '1 John', testament: 'new', chapter_count: 5 },
  { id: 63, name: '2 John', testament: 'new', chapter_count: 1 },
  { id: 64, name: '3 John', testament: 'new', chapter_count: 1 },
  { id: 65, name: 'Jude', testament: 'new', chapter_count: 1 },
  { id: 66, name: 'Revelation', testament: 'new', chapter_count: 22 },
];

// Sample verses for key chapters (we'll expand this)
export const SAMPLE_VERSES = [
  // Genesis
  { book: 1, chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
  { book: 1, chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
  { book: 1, chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
  { book: 1, chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
  { book: 1, chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
  { book: 1, chapter: 1, verse: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.' },
  { book: 1, chapter: 1, verse: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.' },
  { book: 1, chapter: 1, verse: 28, text: 'And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.' },
  
  // Psalms
  { book: 19, chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  { book: 19, chapter: 23, verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
  { book: 19, chapter: 23, verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
  { book: 19, chapter: 23, verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
  { book: 19, chapter: 23, verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
  { book: 19, chapter: 23, verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' },
  
  { book: 19, chapter: 91, verse: 1, text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
  { book: 19, chapter: 91, verse: 2, text: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.' },
  { book: 19, chapter: 91, verse: 3, text: 'Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.' },
  { book: 19, chapter: 91, verse: 4, text: 'He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.' },
  
  // Proverbs
  { book: 20, chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
  { book: 20, chapter: 3, verse: 6, text: 'In all thy ways acknowledge him, and he shall direct thy paths.' },
  
  // Isaiah
  { book: 23, chapter: 40, verse: 31, text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
  { book: 23, chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
  
  // Matthew
  { book: 40, chapter: 1, verse: 1, text: 'The book of the generation of Jesus Christ, the son of David, the son of Abraham.' },
  { book: 40, chapter: 1, verse: 2, text: 'Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;' },
  { book: 40, chapter: 5, verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
  { book: 40, chapter: 5, verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.' },
  { book: 40, chapter: 5, verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.' },
  { book: 40, chapter: 5, verse: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.' },
  { book: 40, chapter: 5, verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.' },
  { book: 40, chapter: 5, verse: 8, text: 'Blessed are the pure in heart: for they shall see God.' },
  { book: 40, chapter: 5, verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.' },
  { book: 40, chapter: 5, verse: 10, text: 'Blessed are they which are persecuted for righteousness\' sake: for theirs is the kingdom of heaven.' },
  { book: 40, chapter: 6, verse: 9, text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.' },
  { book: 40, chapter: 6, verse: 10, text: 'Thy kingdom come. Thy will be done in earth, as it is in heaven.' },
  { book: 40, chapter: 6, verse: 11, text: 'Give us this day our daily bread.' },
  { book: 40, chapter: 6, verse: 12, text: 'And forgive us our debts, as we forgive our debtors.' },
  { book: 40, chapter: 6, verse: 13, text: 'And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.' },
  
  // Mark
  { book: 41, chapter: 1, verse: 1, text: 'The beginning of the gospel of Jesus Christ, the Son of God;' },
  { book: 41, chapter: 1, verse: 2, text: 'As it is written in the prophets, Behold, I send my messenger before thy face, which shall prepare thy way before thee.' },
  
  // Luke
  { book: 42, chapter: 1, verse: 1, text: 'Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us,' },
  { book: 42, chapter: 1, verse: 2, text: 'Even as they delivered them unto us, which from the beginning were eyewitnesses, and ministers of the word;' },
  { book: 42, chapter: 2, verse: 7, text: 'And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger; because there was no room for them in the inn.' },
  { book: 42, chapter: 2, verse: 8, text: 'And there were in the same country shepherds abiding in the field, keeping watch over their flock by night.' },
  { book: 42, chapter: 2, verse: 9, text: 'And, lo, the angel of the Lord came upon them, and the glory of the Lord shone round about them: and they were sore afraid.' },
  { book: 42, chapter: 2, verse: 10, text: 'And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people.' },
  { book: 42, chapter: 2, verse: 11, text: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.' },
  { book: 42, chapter: 2, verse: 12, text: 'And this shall be a sign unto you; Ye shall find the babe wrapped in swaddling clothes, lying in a manger.' },
  
  // John
  { book: 43, chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
  { book: 43, chapter: 1, verse: 2, text: 'The same was in the beginning with God.' },
  { book: 43, chapter: 1, verse: 3, text: 'All things were made by him; and without him was not any thing made that was made.' },
  { book: 43, chapter: 1, verse: 4, text: 'In him was life; and the life was the light of men.' },
  { book: 43, chapter: 1, verse: 5, text: 'And the light shineth in darkness; and the darkness comprehended it not.' },
  { book: 43, chapter: 1, verse: 14, text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.' },
  { book: 43, chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { book: 43, chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
  { book: 43, chapter: 14, verse: 6, text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.' },
  { book: 43, chapter: 14, verse: 27, text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
  
  // Romans
  { book: 45, chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { book: 45, chapter: 8, verse: 31, text: 'What shall we then say to these things? If God be for us, who can be against us?' },
  { book: 45, chapter: 8, verse: 32, text: 'He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?' },
  { book: 45, chapter: 8, verse: 35, text: 'Who shall separate us from the love of Christ? shall tribulation, or distress, or persecution, or famine, or nakedness, or peril, or sword?' },
  { book: 45, chapter: 8, verse: 37, text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
  { book: 45, chapter: 8, verse: 38, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,' },
  { book: 45, chapter: 8, verse: 39, text: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.' },
  
  // 1 Corinthians
  { book: 46, chapter: 13, verse: 4, text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
  { book: 46, chapter: 13, verse: 5, text: 'Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;' },
  { book: 46, chapter: 13, verse: 6, text: 'Rejoiceth not in iniquity, but rejoiceth in the truth;' },
  { book: 46, chapter: 13, verse: 7, text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.' },
  { book: 46, chapter: 13, verse: 8, text: 'Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.' },
  { book: 46, chapter: 13, verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.' },
  
  // Philippians
  { book: 50, chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
  { book: 50, chapter: 4, verse: 19, text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.' },
  
  // Hebrews
  { book: 58, chapter: 11, verse: 1, text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
  { book: 58, chapter: 11, verse: 6, text: 'But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.' },
  
  // Revelation
  { book: 66, chapter: 21, verse: 4, text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.' },
  { book: 66, chapter: 21, verse: 5, text: 'And he that sat upon the throne said, Behold, I make all things new. And he said unto me, Write: for these words are true and faithful.' },
];
