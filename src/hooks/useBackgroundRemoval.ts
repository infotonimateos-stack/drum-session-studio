import { useState, useCallback } from 'react';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemoval';

export const useBackgroundRemoval = () => {
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const processImage = useCallback(async (imageUrl: string, microphoneId: string) => {
    if (processedImages[microphoneId] || processing[microphoneId]) {
      return processedImages[microphoneId];
    }

    setProcessing(prev => ({ ...prev, [microphoneId]: true }));

    try {
      const img = await loadImageFromUrl(imageUrl);
      const blob = await removeBackground(img);
      const processedUrl = URL.createObjectURL(blob);
      
      setProcessedImages(prev => ({ ...prev, [microphoneId]: processedUrl }));
      setProcessing(prev => ({ ...prev, [microphoneId]: false }));
      
      return processedUrl;
    } catch (error) {
      console.error('Failed to process image:', error);
      setProcessing(prev => ({ ...prev, [microphoneId]: false }));
      return imageUrl; // Return original if processing fails
    }
  }, [processedImages, processing]);

  return {
    processImage,
    processedImages,
    processing
  };
};