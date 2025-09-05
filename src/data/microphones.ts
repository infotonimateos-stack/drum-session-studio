
import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    image: '/lovable-uploads/a68edfb6-4a0d-4868-a372-ab01320da016.png'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52A',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/ca2e274f-b7d9-43bc-becb-7c13d65def45.png'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/c71ecd5d-bac0-4a3e-a9c6-3b4c7577248b.png'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1',
    image: '/lovable-uploads/fe5dd1af-916b-40b6-a0ef-839268dcefe9.png'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2',
    image: '/lovable-uploads/fe5dd1af-916b-40b6-a0ef-839268dcefe9.png'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 602',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    image: '/lovable-uploads/be0bd794-2388-4066-837e-67f300cc20cf.png'
  },
  {
    id: 'akg414-oh1',
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    image: '/lovable-uploads/1bdd2634-dd4f-4938-b946-912b2291448e.png'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    image: '/lovable-uploads/1bdd2634-dd4f-4938-b946-912b2291448e.png'
  }
];

export const upgradeMicrophones: Microphone[] = [
  // BOMBO upgrades
  {
    id: 'beta91-kick',
    name: 'Shure Beta 91',
    price: 2.99,
    included: false,
    description: 'Ataque y definición, sin perder los graves',
    target: 'Bombo In',
    image: '/lovable-uploads/3b12e8f7-dfec-4a1e-8d63-b6b57d32d345.png'
  },
  {
    id: 'subkick-kick',
    name: 'Solomon SubKick',
    price: 2.99,
    included: false,
    description: 'Subgraves naturales y con pegada',
    target: 'Bombo',
    image: '/lovable-uploads/a7c203e3-9444-4ecc-811a-6abb0a890cda.png'
  },
  {
    id: 'u47fet-kick',
    name: 'Neumann U47 FET',
    price: 4.99,
    included: false,
    description: 'El bombo suena mejor con una leyenda delante',
    target: 'Bombo Out',
    image: '/lovable-uploads/cc3c1cd6-c682-46c1-bc65-1683a99bf106.png'
  },
  {
    id: 'audix-d6',
    name: 'Audix D6',
    price: 2.99,
    included: false,
    description: 'Punch moderno con carácter yankee',
    target: 'Bombo Out',
    image: '/lovable-uploads/28ff47cf-fb28-405a-b5ae-f8351abb1a14.png'
  },
  // SNARE TOP upgrades
  {
    id: 'akg414-snare',
    name: 'AKG C414',
    price: 2.99,
    included: false,
    description: 'Claridad, naturalidad y pegada',
    target: 'Snare Top',
    image: '/lovable-uploads/130f3ae4-e2e6-4ff5-971f-6b8da515263e.png'
  },
  // SNARE BOTTOM upgrades
  {
    id: 'sen441-snare-bottom',
    name: 'Sennheiser 441',
    price: 2.99,
    included: false,
    description: 'El clásico que capta cada susurro del bordón',
    target: 'Snare Bottom',
    image: '/lovable-uploads/fca524ef-3281-4a16-91f2-2ce2fefe7d2b.png'
  },
  // HIHAT upgrades
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 2.99,
    included: false,
    description: 'El ribbon que doma los agudos',
    target: 'Hi-Hat Ribbon',
    image: '/lovable-uploads/2f8c9e9a-db5c-497d-bc87-3d2b7e78fa5d.png'
  },
  // RIDE upgrades
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 2.99,
    included: false,
    description: 'Ride con brillo y definición impecable',
    target: 'Ride',
    image: '/lovable-uploads/4264fd03-c9ae-4fbb-865a-5c9470aeb91e.png'
  },
  // OVERHEADS upgrades
  {
    id: 'coles4038-oh',
    name: 'Coles 4038',
    price: 4.99,
    included: false,
    description: 'Textura vintage, profundidad y ese toque UK',
    target: 'Overheads Ribbon',
    image: '/lovable-uploads/336b755e-679f-4c19-9325-3c4f0e952191.png'
  },
  // OVERHEAD single upgrades
  {
    id: 'c12-overhead',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'El room de los grandes discos',
    target: 'Room Mono',
    image: '/lovable-uploads/c3aae572-234c-41c9-a967-2d00f027d2b3.png'
  },
  // ROOM upgrades
  {
    id: 'u87-room',
    name: 'Neumann U87 Stereo Set',
    price: 6.99,
    included: false,
    description: 'La leyenda mundial del room estéreo',
    target: 'Room',
    image: '/lovable-uploads/018df378-819a-48fb-9962-28969e162a4f.png'
  }
];
