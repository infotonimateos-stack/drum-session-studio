import { useState, useCallback } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

export const useBackgroundRemoval = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<Map<string, string>>(new Map());

  const processImage = useCallback(async (imageUrl: string): Promise<string> => {
    // Check if already processed
    if (processedImages.has(imageUrl)) {
      return processedImages.get(imageUrl)!;
    }

    setIsProcessing(true);
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Load image element
      const imageElement = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create object URL for the processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      
      // Cache the result
      setProcessedImages(prev => new Map(prev).set(imageUrl, processedUrl));
      
      return processedUrl;
    } catch (error) {
      console.error('Failed to process image:', error);
      return imageUrl; // Return original on error
    } finally {
      setIsProcessing(false);
    }
  }, [processedImages]);

  return {
    processImage,
    isProcessing,
    processedImages
  };
};