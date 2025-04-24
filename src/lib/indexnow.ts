/**
 * IndexNow utility functions for notifying search engines about content changes
 */

// IndexNow API endpoints
const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://api.indexnow.org/indexnow',
  'https://www.yandex.com/indexnow',
];

/**
 * Notify search engines about URL changes via IndexNow
 * @param urls Array of URLs to notify (can be relative or absolute)
 * @param keyLocation Optional custom location of the verification key file
 * @returns Promise<boolean> True if at least one notification was successful
 */
export async function notifyIndexNow(urls: string[], keyLocation?: string): Promise<boolean> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.INDEXNOW_API_KEY;
    
    if (!apiKey) {
      console.error('IndexNow API key not found in environment variables');
      return false;
    }
    
    // Get the site URL from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
    
    // Ensure URLs are absolute
    const absoluteUrls = urls.map(url => 
      url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`
    );
    
    // Prepare the request body
    const body = {
      host: new URL(siteUrl).hostname,
      key: apiKey,
      keyLocation: keyLocation || `${siteUrl}/${apiKey}.txt`,
      urlList: absoluteUrls,
    };
    
    console.log(`[IndexNow] Notifying search engines about ${absoluteUrls.length} URLs`);
    
    // Send requests to all IndexNow endpoints
    const results = await Promise.all(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          
          const responseText = await response.text();
          
          return {
            endpoint,
            success: response.ok,
            status: response.status,
            response: responseText,
          };
        } catch (error) {
          console.error(`[IndexNow] Error notifying ${endpoint}:`, error);
          return {
            endpoint,
            success: false,
            error: error.message,
          };
        }
      })
    );
    
    // Log the results
    const successCount = results.filter(result => result.success).length;
    console.log(`[IndexNow] Successfully notified ${successCount}/${INDEXNOW_ENDPOINTS.length} search engines`);
    
    // Return true if at least one notification was successful
    return results.some(result => result.success);
  } catch (error) {
    console.error('[IndexNow] Error in notifyIndexNow:', error);
    return false;
  }
}

/**
 * Notify search engines about a single URL change via IndexNow
 * @param url URL to notify (can be relative or absolute)
 * @returns Promise<boolean> True if at least one notification was successful
 */
export async function notifyIndexNowSingle(url: string): Promise<boolean> {
  return notifyIndexNow([url]);
}

/**
 * Schedule an IndexNow notification to run in the background
 * This is useful for operations where you don't want to wait for the notification to complete
 * @param urls Array of URLs to notify
 */
export function scheduleIndexNowNotification(urls: string[]): void {
  // Use setTimeout to run the notification in the background
  setTimeout(async () => {
    try {
      await notifyIndexNow(urls);
    } catch (error) {
      console.error('[IndexNow] Error in scheduled notification:', error);
    }
  }, 0);
}

/**
 * Schedule an IndexNow notification for a single URL to run in the background
 * @param url URL to notify
 */
export function scheduleIndexNowNotificationSingle(url: string): void {
  scheduleIndexNowNotification([url]);
}
