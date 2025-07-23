
import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    image: '/lovable-uploads/f16d8869-816a-4340-8e57-19f78e433d93.png'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52A',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/4370868c-4d04-4df3-8984-34e4fa748a7a.png'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/931c6239-27dd-4843-ac2e-393dbdc5717b.png'
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
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    image: '/lovable-uploads/06149d1c-e982-40b5-b71c-ee8e791d8327.png'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    image: '/lovable-uploads/06149d1c-e982-40b5-b71c-ee8e791d8327.png'
  }
];

export const upgradeMicrophones: Microphone[] = [
  // BOMBO upgrades
  {
    id: 'beta91-kick',
    name: 'Shure Beta 91',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/4370868c-4d04-4df3-8984-34e4fa748a7a.png'
  },
  {
    id: 'subkick-kick',
    name: 'Solomicron SubKick',
    price: 2.99,
    included: false,
    description: 'Micrófono subkick para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/903f1003-c2ac-486f-970e-14aeef1bdc43.png'
  },
  {
    id: 'u47fet-kick',
    name: 'Neumann U47 FET',
    price: 4.99,
    included: false,
    description: 'Micrófono de condensador vintage para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/018df378-819a-48fb-9962-28969e162a4f.png'
  },
  {
    id: 'audix-d6',
    name: 'Audix D6',
    price: 2.99,
    included: false,
    description: 'Micrófono dinámico especializado para bombo',
    target: 'Bombo',
    image: '/lovable-uploads/abfcc59b-cba1-498b-8351-2d0d16ba1c97.png'
  },
  {
    id: 'beta91-kick-in',
    name: 'Shure Beta 91A',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador interno para bombo',
    target: 'Bombo In',
    image: '/lovable-uploads/4370868c-4d04-4df3-8984-34e4fa748a7a.png'
  },
  // SNARE TOP upgrades
  {
    id: 'akg414-snare',
    name: 'AKG C414',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top',
    image: '/lovable-uploads/130f3ae4-e2e6-4ff5-971f-6b8da515263e.png'
  },
  // SNARE BOTTOM upgrades
  {
    id: 'sen441-snare-bottom',
    name: 'Sennheiser 441',
    price: 2.99,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom',
    image: '/lovable-uploads/fca524ef-3281-4a16-91f2-2ce2fefe7d2b.png'
  },
  // HIHAT upgrades
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 2.99,
    included: false,
    description: 'Micrófono de ribbon para hi-hat',
    target: 'Hi-Hat',
    image: '/lovable-uploads/20c9fdfa-17f5-4876-9016-cbfb6ce4c107.png'
  },
  // RIDE upgrades
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride',
    image: '/lovable-uploads/931c6239-27dd-4843-ac2e-393dbdc5717b.png'
  },
  // OVERHEADS upgrades
  {
    id: 'coles4038-oh',
    name: 'Coles 4038',
    price: 4.99,
    included: false,
    description: 'Micrófonos ribbon como overheads',
    target: 'Overheads',
    image: '/lovable-uploads/336b755e-679f-4c19-9325-3c4f0e952191.png'
  },
  // OVERHEAD single upgrades
  {
    id: 'c12-overhead',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage overhead mono',
    target: 'Overhead Mono',
    image: '/lovable-uploads/c3aae572-234c-41c9-a967-2d00f027d2b3.png'
  },
  // ROOM upgrades
  {
    id: 'u87-room',
    name: 'Neumann U87',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador para room',
    target: 'Room',
    image: '/lovable-uploads/018df378-819a-48fb-9962-28969e162a4f.png'
  }
];
