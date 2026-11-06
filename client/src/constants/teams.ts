export interface TeamVariant {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  patternType: 'stripes' | 'split' | 'diagonal' | 'solid' | 'stars';
}

export interface LCKTeam {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  logoText: string;
  badgeEmoji: string;
  defaultNumber: number;
  starCount?: number;
  variants: Record<string, TeamVariant>;
}

export const LCK_TEAMS: Record<string, LCKTeam> = {
  t1: {
    id: 't1',
    name: 'T1 Esports',
    shortName: 'T1',
    tagline: 'Together as 1 - 5x World Champions 🏆',
    logoText: 'T1',
    badgeEmoji: '⭐',
    defaultNumber: 99,
    starCount: 5,
    variants: {
      home: {
        id: 'home',
        name: 'Classic Black & Red',
        primaryColor: '#121214',
        secondaryColor: '#E4002B',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        patternType: 'stripes',
      },
      away: {
        id: 'away',
        name: 'Away Pure White',
        primaryColor: '#FFFFFF',
        secondaryColor: '#E4002B',
        accentColor: '#111111',
        textColor: '#111111',
        patternType: 'split',
      },
      worlds: {
        id: 'worlds',
        name: '5-Stars Golden Worlds',
        primaryColor: '#0a0a0c',
        secondaryColor: '#e0b042',
        accentColor: '#e4002b',
        textColor: '#ffd700',
        patternType: 'stars',
      },
    },
  },
  geng: {
    id: 'geng',
    name: 'Gen.G Esports',
    shortName: 'GEN',
    tagline: 'Tiger Nation - LCK Reigning Power',
    logoText: 'GEN.G',
    badgeEmoji: '🐯',
    defaultNumber: 3,
    variants: {
      home: {
        id: 'home',
        name: 'Tiger Gold & Black',
        primaryColor: '#141416',
        secondaryColor: '#AA8A59',
        accentColor: '#E0B867',
        textColor: '#FFFFFF',
        patternType: 'diagonal',
      },
      away: {
        id: 'away',
        name: 'Glory White',
        primaryColor: '#F5F5F7',
        secondaryColor: '#AA8A59',
        accentColor: '#18181A',
        textColor: '#18181A',
        patternType: 'split',
      },
    },
  },
  hle: {
    id: 'hle',
    name: 'Hanwha Life Esports',
    shortName: 'HLE',
    tagline: 'Super Team Orange Energy',
    logoText: 'HLE',
    badgeEmoji: '🍊',
    defaultNumber: 25,
    variants: {
      home: {
        id: 'home',
        name: 'Hanwha Bright Orange',
        primaryColor: '#F37321',
        secondaryColor: '#222226',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        patternType: 'stripes',
      },
      away: {
        id: 'away',
        name: 'Stealth Black',
        primaryColor: '#161719',
        secondaryColor: '#F37321',
        accentColor: '#FFFFFF',
        textColor: '#F37321',
        patternType: 'diagonal',
      },
    },
  },
  dk: {
    id: 'dk',
    name: 'Dplus KIA',
    shortName: 'DK',
    tagline: 'ShowMaker & The Wave of Excellence',
    logoText: 'DK',
    badgeEmoji: '🌊',
    defaultNumber: 10,
    variants: {
      home: {
        id: 'home',
        name: 'Cyber Mint & Charcoal',
        primaryColor: '#17191C',
        secondaryColor: '#00E880',
        accentColor: '#00B0FF',
        textColor: '#FFFFFF',
        patternType: 'split',
      },
      away: {
        id: 'away',
        name: 'Pure Mint Breeze',
        primaryColor: '#FFFFFF',
        secondaryColor: '#00E880',
        accentColor: '#17191C',
        textColor: '#17191C',
        patternType: 'stripes',
      },
    },
  },
  kt: {
    id: 'kt',
    name: 'KT Rolster',
    shortName: 'KT',
    tagline: 'Rolster Telecom Rollercoaster',
    logoText: 'KT',
    badgeEmoji: '🎢',
    defaultNumber: 7,
    variants: {
      home: {
        id: 'home',
        name: 'Hot Crimson Red',
        primaryColor: '#E60000',
        secondaryColor: '#000000',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        patternType: 'stripes',
      },
      away: {
        id: 'away',
        name: 'Telecom Clean White',
        primaryColor: '#FAFAFA',
        secondaryColor: '#E60000',
        accentColor: '#111111',
        textColor: '#111111',
        patternType: 'split',
      },
    },
  },
  drx: {
    id: 'drx',
    name: 'DRX',
    shortName: 'DRX',
    tagline: 'The Deft Deftly Miracle & Dragon Spirit',
    logoText: 'DRX',
    badgeEmoji: '🐉',
    defaultNumber: 1,
    variants: {
      home: {
        id: 'home',
        name: 'Dragon Deep Blue',
        primaryColor: '#0C2340',
        secondaryColor: '#0070EB',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        patternType: 'diagonal',
      },
      away: {
        id: 'away',
        name: 'Cloud White',
        primaryColor: '#FFFFFF',
        secondaryColor: '#0070EB',
        accentColor: '#0C2340',
        textColor: '#0C2340',
        patternType: 'stripes',
      },
    },
  },
  ns: {
    id: 'ns',
    name: 'Nongshim RedForce',
    shortName: 'NS',
    tagline: 'Spicy Shin Ramyun Red Power',
    logoText: 'NS',
    badgeEmoji: '🍜',
    defaultNumber: 77,
    variants: {
      home: {
        id: 'home',
        name: 'Spicy Red & Black',
        primaryColor: '#B81D24',
        secondaryColor: '#1A1A1A',
        accentColor: '#F5A623',
        textColor: '#FFFFFF',
        patternType: 'stripes',
      },
    },
  },
  bro: {
    id: 'bro',
    name: 'OK BRION',
    shortName: 'BRO',
    tagline: 'Lord Morgan & Green Blade',
    logoText: 'BRO',
    badgeEmoji: '👑',
    defaultNumber: 69,
    variants: {
      home: {
        id: 'home',
        name: 'Lord Morgan Emerald Green',
        primaryColor: '#005A36',
        secondaryColor: '#002B19',
        accentColor: '#CDDE00',
        textColor: '#CDDE00',
        patternType: 'stripes',
      },
    },
  },
};
