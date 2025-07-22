import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    image: '/lovable-uploads/4370868c-4d04-4df3-8984-34e4fa748a7a.png'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/e42e5f78-b8a0-4756-99ec-b7eb07e055ea.png'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/f6c4ceb5-6a42-45d5-bd11-8ba6c4d41f32.png'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1',
    image: '/lovable-uploads/f493529f-6183-4040-82f1-5ccf827d1b2b.png'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2',
    image: '/lovable-uploads/f493529f-6183-4040-82f1-5ccf827d1b2b.png'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    image: '/lovable-uploads/5b4e514d-0c50-42a1-834a-3b4c1d7ab825.png'
  },
  {
    id: 'akg414-oh1',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    image: '/lovable-uploads/931c6239-27dd-4843-ac2e-393dbdc5717b.png'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    image: '/lovable-uploads/931c6239-27dd-4843-ac2e-393dbdc5717b.png'
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
    image: '/lovable-uploads/018df378-819a-48fb-9962-28969e162a4f.png'
  },
  {
    id: 'shure-beta91a',
    name: 'Shure Beta 91A',
    price: 39.90,
    included: false,
    description: 'Micrófono específicamente diseñado para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/46e97fb2-1e58-4f21-b83d-86c1a0f0fa05.png'
  },
  {
    id: 'shure-boundary',
    name: 'Shure Boundary Mic',
    price: 45.90,
    included: false,
    description: 'Micrófono de superficie para grabación ambiental',
    target: 'Ambiente',
    image: '/lovable-uploads/903f1003-c2ac-486f-970e-14aeef1bdc43.png'
  },
  {
    id: 'shotgun-mic',
    name: 'Sennheiser 441',
    price: 69.90,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom',
    image: '/lovable-uploads/fca524ef-3281-4a16-91f2-2ce2fefe7d2b.png'
  },
  {
    id: 'akg414-snare',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top',
    image: '/lovable-uploads/931c6239-27dd-4843-ac2e-393dbdc5717b.png'
  },
  {
    id: 'sen441-snare',
    name: 'Sennheiser 441',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    image: '/lovable-uploads/f493529f-6183-4040-82f1-5ccf827d1b2b.png'
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
    image: '/lovable-uploads/5876e5ea-6c22-4ce6-8662-8515bd82e156.png'
  },
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride',
    image: '/lovable-uploads/b1c6189b-bde4-4a7a-9e84-a26126c05561.png'
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