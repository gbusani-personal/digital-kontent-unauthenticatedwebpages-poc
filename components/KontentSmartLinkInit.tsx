'use client';

import KontentSmartLink from '@kontent-ai/smart-link';
import { useEffect } from 'react';

/**
 * KontentSmartLinkInit
 *
 * Initializes the Kontent.ai Smart Link SDK so that elements annotated with
 * data-kontent-item-id and data-kontent-element-codename become clickable edit
 * targets when the page is previewed inside Kontent.ai Web Spotlight or Live
 * Preview.
 *
 * The SDK detects automatically whether the page is running inside the Web
 * Spotlight iframe and enables edit mode accordingly. Outside Web Spotlight the
 * SDK is a no-op unless the ?ksl-enabled query parameter is present.
 */
export default function KontentSmartLinkInit() {
  useEffect(() => {
    const sdk = KontentSmartLink.initialize({
      queryParam: 'ksl-enabled',
      defaultDataAttributes: {
        languageCodename: process.env.NEXT_PUBLIC_KONTENT_LANGUAGE_CODENAME ?? 'default',
        environmentId: process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
      },
    });

    return () => {
      sdk.destroy();
    };
  }, []);

  return null;
}
