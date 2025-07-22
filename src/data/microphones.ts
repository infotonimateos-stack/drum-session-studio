import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para floor tom',
    target: 'Floor Tom',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'akg414-oh1',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    image: '/lovable-uploads/20c9fdfa-17f5-4876-9016-cbfb6ce4c107.png'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    image: '/lovable-uploads/20c9fdfa-17f5-4876-9016-cbfb6ce4c107.png'
  }
];

export const upgradeMicrophones: Microphone[] = [
  {
    id: 'beta91-kick',
    name: 'Shure Beta 91',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'd112-kick',
    name: 'AKG D112',
    price: 3.99,
    included: false,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/32616ea5-218a-4043-8ca0-3bf369ef8f55.png'
  },
  {
    id: 'd6-kick',
    name: 'Audix D6',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/06149d1c-e982-40b5-b71c-ee8e791d8327.png'
  },
  {
    id: 'subkick-kick',
    name: 'Solomon SubKick',
    price: 5.99,
    included: false,
    description: 'Subwoofer para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'u47fet-kick',
    name: 'Neumann U47 FET',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'akg414-snare',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top',
    image: '/lovable-uploads/130f3ae4-e2e6-4ff5-971f-6b8da515263e.png'
  },
  {
    id: 'sen441-snare',
    name: 'Sennheiser 441',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 4.99,
    included: false,
    description: 'Micrófono de ribbon para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/2f72b48e-2149-413c-8cbd-bdcd2001a8a6.png'
  },
  {
    id: 'coles4038-oh',
    name: 'Coles 4038 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos ribbon como overheads',
    target: 'Overheads',
    image: '/lovable-uploads/4d9889da-030f-4db9-876d-8b9ff0902139.png'
  },
  {
    id: 'u87-room',
    name: 'Neumann U87 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos de condensador como room',
    target: 'Room',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride',
    image: '/lovable-uploads/microphone-generic.png'
  },
  {
    id: 'akg414-mono',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador overhead mono',
    target: 'Overhead Mono',
    image: '/lovable-uploads/0b66f613-e481-4e34-902e-c7889bb03769.png'
  },
  {
    id: 'c12-room',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage room mono',
    target: 'Room Mono',
    image: '/lovable-uploads/c3aae572-234c-41c9-a967-2d00f027d2b3.png'
  }
];