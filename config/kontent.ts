// Kontent.ai Configuration
import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

export const kontentConfig = {
  environmentId: process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID || '',
  deliveryApiKey: process.env.NEXT_PUBLIC_KONTENT_DELIVERY_API_KEY || '',
  previewApiKey: process.env.NEXT_PUBLIC_KONTENT_PREVIEW_API_KEY || '',
};

// Kontent.ai client configuration
export const getKontentClient = () => {
  const config: Record<string, any> = {
    environmentId: kontentConfig.environmentId,
  };

  // Use preview API key for preview mode
  if (kontentConfig.previewApiKey) {
    config.previewApiKey = kontentConfig.previewApiKey;
    config.usePreviewMode = true;
  } else if (kontentConfig.deliveryApiKey) {
    // Fallback to delivery API key if preview is not available
    config.apiKey = kontentConfig.deliveryApiKey;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createDeliveryClient(config as any);
};