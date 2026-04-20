import type { Post, Member } from '../types';

export const communityPosts: Post[] = [
  {
    id: '1',
    author: 'Аружан Мұрат',
    avatarInitials: 'АМ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATbybL_DeoKAULlkoabOarhB2Qf6lgHfRQZWC0NSXCm4Dc5D98P7xZnJTYy0PWydszKi5BrJX___7iH_wCgm1MGegpcSoa7i9XPbqfj2LQyvg9ymu-0Y3EsuRUqWIHSmWkokA1VjA0avxJKFqwg96TiPOjcWVoxmR-ssYDeQLPqzB9FWLVXpy8_5bdxQ_hnlucx8V-QFMrhbUPKQXDh9hl3TlRHqiDInMRqbFxrlHnsw26aQTHvFhVXioeecxGLzglQq_37C0Cr6iF',
    timeAgo: '2 сағат бұрын',
    category: 'Методика',
    title: 'КСП қалай тез жасауға болады?',
    body: 'Келесі аптада практика басталады, 10-сыныптарға арналған КСП-ны қалай жылдам дайындауға болады? Қандай шаблон қолданасыздар?',
    likes: 24,
    comments: [
      {
        id: 'c1',
        author: 'Дәурен Серікбол',
        avatarInitials: 'ДС',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP_On_82d6mDd9NL6hODqnXP0R3RK1YZk0ChnmYj1VTfhH5A54gfGLoRem47AXUosVNOOJPfKtrnDwnUcW2tZckQ3IRa1PXbYDXBfWVJJc_oyTqBtaMf7OpRECYZctaBR0x2AjDhYdCYKZmd00TdBca9zknPzwwl2GNF5OzTroNB98hZDawwD1oT6szHAfhDXJGR1ZzE5vvLbbXtj6iuGLdwuJ-6Z2HDIb5oEG6fz_S6gglneZKo77RXj2qjms5v5aIOThorYBvU92',
        timeAgo: '1 сағат бұрын',
        body: 'Осы Нейро Ұстаздың КСП генераторын қолданып көрдіңіз бе? Өте жақсы шаблондар береді.',
      },
      {
        id: 'c2',
        author: 'Мәдина Ахметова',
        avatarInitials: 'МА',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwE2q_IR-icFJDnatQwb-FIpCJZhZBYhohUiZmuNosvCg_cvXhaTiSrxw6KTXaL6dFZG_UHRv3xAhsfDe5G6y1hP4YFSSM7v7I-fGuXhAo6AVbnLs4xpJj7kMcjdiGF07qtmv0fEL97HllNPIxW649SHe0hXdcphAhEJ4cw4iPhnPrGWBvhAEPiffZZE3Z-KLuAdVVG3_iN53ptmtDdUpyY-rbGL5lQah7ZQjBGK4r2cnqDNljUqorS3giAJKtNXe9dEL7x_keYBc6',
        timeAgo: '45 мин бұрын',
        body: 'Иә, Нейро Ұстаз өте ыңғайлы. Мектептің форматына тез бейімдеуге болады.',
      },
    ],
  },
  {
    id: '2',
    author: 'Бауыржан Ермек',
    avatarInitials: 'БЕ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs7xDi-nHX_jUkGwslMvt8jHasKu9UtUnq3wyJDQYa7rge-CBnVN3soDogZ_PmUQM0sjHmd5LsEAvsMv4f9gqyniWIZvmmDHoZkqu0rBuskuGQFhIlCeK7X-GhNzo5VlGZHThi_fHaUzwMW7Rc2OgvaF-m3Z7uxFxk6jsCue2ByViFX_NelGSej_Hdj9ELEN9JiTEJwEh-hwofw6LQmpR7WlLS0y1ouEsyP9rSjsWbkOFrfXbrh6Yn7gOgrIDAiz3aWXyVyfXircAx',
    timeAgo: '5 сағат бұрын',
    category: 'Практика',
    title: 'Практикаға қалай дайындалу керек?',
    body: 'Бірінші күні не нәрсеге назар аудару керек? Оқушылармен байланыс орнатудың қандай лайфхактары бар?',
    likes: 15,
    comments: [],
  },
];

export const popularTopics: string[] = [
  '#КСП',
  '#Практика',
  '#Психология',
  '#ЦифрлықҚұралдар',
  '#ИнклюзивтіБілім',
];

export const activeMembers: Member[] = [
  { initials: 'АС', name: 'Айбек Сейіт', posts: 142, color: '#dbeafe' },
  { initials: 'ГН', name: 'Гүлназ Нұрлан', posts: 98, color: '#d1fae5' },
];
