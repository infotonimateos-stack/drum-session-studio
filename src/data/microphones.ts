import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    image: '/lovable-uploads/sm57-new.jpg'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/beta52-new.jpg'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/km184-new.jpg'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'akg414-oh1',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    image: '/lovable-uploads/akg414-new.jpg'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    image: '/lovable-uploads/akg414-new.jpg'
  }
];

export const upgradeMicrophones: Microphone[] = [
  {
    id: 'neumann-u87',
    name: 'Neumann U87',
    price: 89.90,
    included: false,
    description: 'Micrófono de condensador premium para voces principales',
    target: 'Room',
    image: '/lovable-uploads/u87-new.jpg'
  },
  {
    id: 'shure-beta91a',
    name: 'Shure Beta 91A',
    price: 39.90,
    included: false,
    description: 'Micrófono específicamente diseñado para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/beta91a-new.jpg'
  },
  {
    id: 'shure-boundary',
    name: 'Shure Boundary Mic',
    price: 45.90,
    included: false,
    description: 'Micrófono de superficie para grabación ambiental',
    target: 'Subkick',
    image: '/lovable-uploads/beta91a-new.jpg'
  },
  {
    id: 'shotgun-mic',
    name: 'Sennheiser 441',
    price: 69.90,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'akg414-snare',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top',
    image: '/lovable-uploads/akg414-new.jpg'
  },
  {
    id: 'sen441-snare',
    name: 'Sennheiser 441',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 4.99,
    included: false,
    description: 'Micrófono de ribbon para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/sen421-new.jpg'
  },
  {
    id: 'coles4038-oh',
    name: 'Coles 4038 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos ribbon como overheads',
    target: 'Overheads',
    image: '/lovable-uploads/coles4038-new.jpg'
  },
  {
    id: 'u87-room',
    name: 'Neumann U87 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos de condensador como room',
    target: 'Room',
    image: '/lovable-uploads/u87-new.jpg'
  },
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride',
    image: '/lovable-uploads/km184-new.jpg'
  },
  {
    id: 'akg414-mono',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador overhead mono',
    target: 'Overhead Mono',
    image: '/lovable-uploads/akg414-new.jpg'
  },
  {
    id: 'c12-room',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage room mono',
    target: 'Room Mono',
    image: '/lovable-uploads/u87-new.jpg'
  }
];