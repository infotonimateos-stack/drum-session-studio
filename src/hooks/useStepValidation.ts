import { CartState } from '@/types/cart';
import { baseMicrophones, upgradeMicrophones } from '@/data/microphones';

// All microphone IDs
const ALL_MIC_IDS = [...baseMicrophones, ...upgradeMicrophones].map(m => m.id);

// Microphone IDs grouped by category
const KICK_MIC_IDS = ['beta52-kick', 'beta91-kick', 'subkick-kick', 'u47fet-kick', 'audix-d6'];
const SNARE_TOP_MIC_IDS = ['sm57-snare', 'akg414-snare'];
const HIHAT_MIC_IDS = ['km184-hihat', 'm160-hihat'];
const OVERHEAD_MIC_IDS = ['akg414-overheads', 'coles4038-oh', 'c12-overhead'];

// Drum kit IDs
export const DRUM_KIT_IDS = ['kit-modern', 'kit-new-vintage', 'kit-jazz', 'kit-pure-vintage'];

// Exclusive group IDs per step
export const PREAMP_IDS = ['preamps-motu', 'preamps-pro'];
export const INTERFACE_IDS = ['interface-motu', 'interface-dad'];
export const DURATION_IDS = ['duracion-estandar', 'tiempo-adicional'];
export const DELIVERY_IDS = ['delivery-standard', 'delivery-5days', 'delivery-2days'];

/** Returns the count of microphones currently in the cart */
export const countSelectedMicrophones = (cartState: CartState): number => {
  return cartState.items.filter(item => ALL_MIC_IDS.includes(item.id)).length;
};

/** Returns true if MOTU is blocked due to more than 8 mics selected */
export const isMotuBlockedByMicCount = (cartState: CartState): boolean => {
  return countSelectedMicrophones(cartState) > 8;
};

/** Returns true if legendary preamps (preamps-pro) are selected */
export const hasLegendaryPreamps = (cartState: CartState): boolean => {
  return cartState.items.some(item => item.id === 'preamps-pro');
};

/** Returns true if MOTU interface is selected */
export const hasMotuInterface = (cartState: CartState): boolean => {
  return cartState.items.some(item => item.id === 'interface-motu');
};

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export const validateStep = (
  stepIndex: number,
  cartState: CartState,
  t: (key: string) => string
): ValidationResult => {
  const itemIds = cartState.items.map(i => i.id);

  const hasAny = (ids: string[]) => ids.some(id => itemIds.includes(id));

  switch (stepIndex) {
    case 0: {
      // Drum Kit: must have one selected
      if (!hasAny(DRUM_KIT_IDS)) {
        return { valid: false, error: t('validation.drumKit') };
      }
      return { valid: true, error: null };
    }
    case 1: {
      // Microphones: must have kick, snare top, hihat, overhead
      const hasKick = hasAny(KICK_MIC_IDS);
      const hasSnareTop = hasAny(SNARE_TOP_MIC_IDS);
      const hasHihat = hasAny(HIHAT_MIC_IDS);
      const hasOverhead = hasAny(OVERHEAD_MIC_IDS);
      if (!hasKick || !hasSnareTop || !hasHihat || !hasOverhead) {
        return { valid: false, error: t('validation.microphones') };
      }
      return { valid: true, error: null };
    }
    case 2: {
      // Preamps: must have one
      if (!hasAny(PREAMP_IDS)) {
        return { valid: false, error: t('validation.preamps') };
      }
      return { valid: true, error: null };
    }
    case 3: {
      // Interface: must have one
      if (!hasAny(INTERFACE_IDS)) {
        return { valid: false, error: t('validation.interface') };
      }
      return { valid: true, error: null };
    }
    case 4: {
      // Production: must have a duration
      if (!hasAny(DURATION_IDS)) {
        return { valid: false, error: t('validation.production') };
      }
      return { valid: true, error: null };
    }
    case 6: {
      // Takes: must have at least one take selected
      const takeIds = ['take-toni-interpretation', 'take-exact-copy'];
      if (!hasAny(takeIds)) {
        return { valid: false, error: t('validation.takes') };
      }
      return { valid: true, error: null };
    }
    case 7: {
      // Delivery: must have one selected
      if (!hasAny(DELIVERY_IDS)) {
        return { valid: false, error: t('validation.delivery') };
      }
      return { valid: true, error: null };
    }
    default:
      return { valid: true, error: null };
  }
};
