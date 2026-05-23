import { ContributorSocials } from '@interfaces/github.interface';

export const REAL_NAMES = new Map<string, string>([
  ['helias', 'Stefano Borzì'],
  ['wornairz', 'Alessandro Catalano'],
  ['pierpaolo791', 'Pierpaolo Pecoraio'],
  ['', 'Simone Scionti'],
  ['', 'Alessio Piazza'],
  ['', 'Diego Sinitò'],
  ['guberlo', 'Salvo Asero'],
  ['mkokeshi', 'Giuseppe Ferro'],
  ['herbrant', 'Davide Carnemolla'],
  ['makapx', 'Martina Parlavecchio'],
  ['boozec', 'Santo Cariotti'],
  ['chiarazuccaro', 'Chiara Zuccaro'],
]);

export const CONTRIBUTOR_SOCIALS = new Map<string, ContributorSocials>([
  [
    'helias',
    {
      telegram: 'https://t.me/Helias',
      email: 'stefanoborzi32@gmail.com',
      linkedin: 'https://linkedin.com/in/stefanoborzi/',
    },
  ],
  [
    'wornairz',
    {
      telegram: 'https://t.me/Wornairz',
      email: 'alessandrocatalano999@gmail.com',
      linkedin: 'https://www.linkedin.com/in/wornairz/',
    },
  ],
  [
    'pierpaolo791',
    {
      telegram: 'https://t.me/Pierpaolo791',
      email: 'pierpaolo.pecoraio@gmail.com',
      linkedin: 'https://www.linkedin.com/in/pierpaolo-pecoraio/',
    },
  ],
  [
    'guberlo',
    {
      telegram: 'https://t.me/SalAsero',
      email: 'SalAsero24@gmail.com',
      linkedin: 'https://www.linkedin.com/in/salvo-asero-2a19a620a/',
    },
  ],
  // [
  //   'filippomarletta',
  //   {
  //     linkedin: 'https://www.linkedin.com/in/filippo-marletta-a17973298/',
  //   },
  // ],
  [
    'chiarazuccaro',
    {
      email: 'chiara.zuccaro.dev@gmail.com',
      linkedin: 'https://www.linkedin.com/in/chiara-zuccaro/',
    },
  ],
]);
