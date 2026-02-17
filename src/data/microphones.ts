
import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.sm57Desc',
    targetKey: 'micData.snareTop',
    image: '/lovable-uploads/a68edfb6-4a0d-4868-a372-ab01320da016.png'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52A',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.beta52Desc',
    targetKey: 'micData.kick',
    image: '/lovable-uploads/ca2e274f-b7d9-43bc-becb-7c13d65def45.png'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.km184HihatDesc',
    targetKey: 'micData.hihat',
    image: '/lovable-uploads/c71ecd5d-bac0-4a3e-a9c6-3b4c7577248b.png'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.sen421Tom1Desc',
    targetKey: 'micData.tom1',
    image: '/lovable-uploads/fe5dd1af-916b-40b6-a0ef-839268dcefe9.png'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.sen421Tom2Desc',
    targetKey: 'micData.tom2',
    image: '/lovable-uploads/fe5dd1af-916b-40b6-a0ef-839268dcefe9.png'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 602',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.sen602Desc',
    targetKey: 'micData.tom3',
    image: '/lovable-uploads/fe5dd1af-916b-40b6-a0ef-839268dcefe9.png'
  },
  {
    id: 'akg414-overheads',
    name: 'Par AKG 414 LTD Overheads',
    price: 5.99,
    included: false,
    descriptionKey: 'micData.akg414OhPairDesc',
    targetKey: 'micData.overheads',
    image: '/lovable-uploads/akg-c414-ltd-pair.png'
  },
  {
    id: 'sen441-snare-bottom',
    name: 'Sennheiser 441',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.sen441Desc',
    targetKey: 'micData.snareBottom',
    image: '/lovable-uploads/6cd449d1-5e50-4516-a635-9997ed25974a.png'
  }
];

export const upgradeMicrophones: Microphone[] = [
  // BOMBO upgrades
  {
    id: 'beta91-kick',
    name: 'Shure Beta 91',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.beta91Desc',
    targetKey: 'micData.kickIn',
    image: '/lovable-uploads/3b12e8f7-dfec-4a1e-8d63-b6b57d32d345.png'
  },
  {
    id: 'subkick-kick',
    name: 'Solomon SubKick',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.subkickDesc',
    targetKey: 'micData.kick',
    image: '/lovable-uploads/a7c203e3-9444-4ecc-811a-6abb0a890cda.png'
  },
  {
    id: 'u47fet-kick',
    name: 'Neumann U47 FET',
    price: 4.99,
    included: false,
    descriptionKey: 'micData.u47fetDesc',
    targetKey: 'micData.kickOut',
    image: '/lovable-uploads/cc3c1cd6-c682-46c1-bc65-1683a99bf106.png'
  },
  {
    id: 'audix-d6',
    name: 'Audix D6',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.audixD6Desc',
    targetKey: 'micData.kickOut',
    image: '/lovable-uploads/28ff47cf-fb28-405a-b5ae-f8351abb1a14.png'
  },
  // SNARE TOP upgrades
  {
    id: 'akg414-snare',
    name: 'AKG C414',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.akg414SnareDesc',
    targetKey: 'micData.snareTop',
    image: '/lovable-uploads/130f3ae4-e2e6-4ff5-971f-6b8da515263e.png'
  },
  // HIHAT upgrades
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.m160Desc',
    targetKey: 'micData.hihatRibbon',
    image: '/lovable-uploads/2f8c9e9a-db5c-497d-bc87-3d2b7e78fa5d.png'
  },
  // RIDE upgrades
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 2.99,
    included: false,
    descriptionKey: 'micData.km184RideDesc',
    targetKey: 'micData.ride',
    image: '/lovable-uploads/4264fd03-c9ae-4fbb-865a-5c9470aeb91e.png'
  },
  // OVERHEADS upgrades
  {
    id: 'coles4038-oh',
    name: 'Coles 4038',
    price: 4.99,
    included: false,
    descriptionKey: 'micData.coles4038Desc',
    targetKey: 'micData.overheadsRibbon',
    image: '/lovable-uploads/226d949c-ce5f-44cb-8d99-c34e5e50c02c.png'
  },
  // OVERHEAD single upgrades
  {
    id: 'c12-overhead',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    descriptionKey: 'micData.c12Desc',
    targetKey: 'micData.roomMono',
    image: '/lovable-uploads/89d7fda0-70d4-4957-add9-d89e796317e2.png'
  },
  // ROOM upgrades
  {
    id: 'u87-room',
    name: 'Neumann U87 Stereo Set',
    price: 6.99,
    included: false,
    descriptionKey: 'micData.u87Desc',
    targetKey: 'micData.room',
    image: '/lovable-uploads/00a0018b-61ad-4b06-9b25-644b23a116df.png'
  }
];
