export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export interface SessionConfig {
  microphones: CartItem[];
  preamps: CartItem[];
  interface: CartItem[];
  takes: CartItem[];
  delivery: CartItem[];
  extras: CartItem[];
}

export interface CartState {
  items: CartItem[];
  total: number;
  basePrice: number;
}

export interface Microphone {
  id: string;
  name: string;
  price: number;
  included: boolean;
  descriptionKey: string;
  targetKey: string;
  image?: string;
  vintage?: boolean;
  subtitleKey?: string;
}

export interface MicrophoneCategory {
  id: string;
  titleKey: string;
  microphones: Microphone[];
}

export interface OrderForm {
  fullName: string;
  phone: string;
  countryCode: string;
  email: string;
  needsInvoice: boolean;
  address?: string;
  taxId?: string;
  audioFiles: {
    trackWithoutDrums?: File;
    drumsOnlyTrack?: File;
    noDrumsDemo: boolean;
  };
  audioSettings: {
    bitDepth: '16' | '24' | '32';
    sampleRate: '44.1' | '48' | '88.2' | '96' | '192';
  };
  instructions: string;
  tempo: string;
  tempoMapFile?: File;
}