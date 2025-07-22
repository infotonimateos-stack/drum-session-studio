import { Microphone } from '@/types/cart';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top'
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo'
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat'
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1'
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2'
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para floor tom',
    target: 'Floor Tom'
  },
  {
    id: 'akg414-oh1',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L'
  },
  {
    id: 'akg414-oh2',
    name: 'AKG 414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R'
  }
];

export const upgradeMicrophones: Microphone[] = [
  {
    id: 'beta91-kick',
    name: 'Shure Beta 91',
    price: 2.99,
    included: false,
    description: 'Micrófono de condensador para bombo',
    target: 'Bombo'
  },
  {
    id: 'd112-kick',
    name: 'AKG D112',
    price: 3.99,
    included: false,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo'
  },
  {
    id: 'd6-kick',
    name: 'Audix D6',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo'
  },
  {
    id: 'subkick-kick',
    name: 'Solomon SubKick',
    price: 5.99,
    included: false,
    description: 'Subwoofer para bombo',
    target: 'Bombo'
  },
  {
    id: 'u47fet-kick',
    name: 'Neumann U47 FET',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage para bombo',
    target: 'Bombo'
  },
  {
    id: 'akg414-snare',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top'
  },
  {
    id: 'sen441-snare',
    name: 'Sennheiser 441',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom'
  },
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 4.99,
    included: false,
    description: 'Micrófono de ribbon para hi-hat',
    target: 'Hi-Hat'
  },
  {
    id: 'coles4038-oh',
    name: 'Par Coles 4038',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos ribbon como overheads',
    target: 'Overheads'
  },
  {
    id: 'u87-room',
    name: 'Par Neumann U87',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos de condensador como room',
    target: 'Room'
  },
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride'
  },
  {
    id: 'akg414-mono',
    name: 'AKG 414',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador overhead mono',
    target: 'Overhead Mono'
  },
  {
    id: 'c12-room',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage room mono',
    target: 'Room Mono'
  }
];