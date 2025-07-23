
import { Microphone } from '@/types/cart';
import { MicrophoneIconType } from '@/components/icons/MicrophoneIcons';

export const baseMicrophones: Microphone[] = [
  {
    id: 'sm57-snare',
    name: 'Shure SM 57',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para caja',
    target: 'Snare Top',
    iconType: 'sm57' as MicrophoneIconType
  },
  {
    id: 'beta52-kick',
    name: 'Shure Beta 52A',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para bombo',
    target: 'Bombo',
    iconType: 'beta52' as MicrophoneIconType
  },
  {
    id: 'km184-hihat',
    name: 'Neumann KM184',
    price: 0,
    included: true,
    description: 'Micrófono de condensador para hi-hat',
    target: 'Hi-Hat',
    iconType: 'km184' as MicrophoneIconType
  },
  {
    id: 'sen421-tom1',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 1',
    target: 'Tom 1',
    iconType: 'sen421' as MicrophoneIconType
  },
  {
    id: 'sen421-tom2',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 2',
    target: 'Tom 2',
    iconType: 'sen421' as MicrophoneIconType
  },
  {
    id: 'sen421-floor',
    name: 'Sennheiser 421',
    price: 0,
    included: true,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    iconType: 'sen421' as MicrophoneIconType
  },
  {
    id: 'akg414-oh1',
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead izquierdo',
    target: 'Overhead L',
    iconType: 'c414' as MicrophoneIconType
  },
  {
    id: 'akg414-oh2',
    name: 'AKG C414',
    price: 0,
    included: true,
    description: 'Micrófono de condensador overhead derecho',
    target: 'Overhead R',
    iconType: 'c414' as MicrophoneIconType
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
    iconType: 'u87' as MicrophoneIconType
  },
  {
    id: 'audix-d6',
    name: 'Audix D6',
    price: 29.90,
    included: false,
    description: 'Micrófono dinámico especializado para bombo',
    target: 'Bombo',
    iconType: 'd6' as MicrophoneIconType
  },
  {
    id: 'shure-boundary',
    name: 'Shure Boundary Mic',
    price: 45.90,
    included: false,
    description: 'Micrófono de superficie para grabación ambiental',
    target: 'Subkick',
    iconType: 'boundary' as MicrophoneIconType
  },
  {
    id: 'shotgun-mic',
    name: 'Sennheiser 441',
    price: 69.90,
    included: false,
    description: 'Micrófono dinámico para caja bottom',
    target: 'Snare Bottom',
    iconType: 'sen441' as MicrophoneIconType
  },
  {
    id: 'akg414-snare',
    name: 'AKG C414 XLS',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para caja top',
    target: 'Snare Top',
    iconType: 'c414' as MicrophoneIconType
  },
  {
    id: 'sen441-snare',
    name: 'Sennheiser 441',
    price: 4.99,
    included: false,
    description: 'Micrófono dinámico para tom 3',
    target: 'Tom 3',
    iconType: 'sen441' as MicrophoneIconType
  },
  {
    id: 'm160-hihat',
    name: 'Beyerdynamic M160',
    price: 4.99,
    included: false,
    description: 'Micrófono de ribbon para hi-hat',
    target: 'Hi-Hat',
    iconType: 'm160' as MicrophoneIconType
  },
  {
    id: 'coles4038-oh',
    name: 'Coles 4038 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos ribbon como overheads',
    target: 'Overheads',
    iconType: 'coles4038' as MicrophoneIconType
  },
  {
    id: 'u87-room',
    name: 'Neumann U87 Stereo Set',
    price: 5.99,
    included: false,
    description: 'Par de micrófonos de condensador como room',
    target: 'Room',
    iconType: 'u87' as MicrophoneIconType
  },
  {
    id: 'km184-ride',
    name: 'Neumann KM184',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador para ride',
    target: 'Ride',
    iconType: 'km184' as MicrophoneIconType
  },
  {
    id: 'akg414-mono',
    name: 'AKG C414 XLII',
    price: 3.99,
    included: false,
    description: 'Micrófono de condensador overhead mono',
    target: 'Overhead Mono',
    iconType: 'c414' as MicrophoneIconType
  },
  {
    id: 'c12-room',
    name: 'Telefunken C12',
    price: 6.99,
    included: false,
    description: 'Micrófono de condensador vintage room mono',
    target: 'Room Mono',
    iconType: 'c12' as MicrophoneIconType
  }
];
