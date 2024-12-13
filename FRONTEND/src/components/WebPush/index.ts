import { useEffect } from 'react';

import { urlBase64ToUint8Array } from '@/utils/helpers';

import { useRequest } from '../App';

export const useWebPush = () => {
  const { request } = useRequest();

  const getSubscriptionBodyToken = async () => {
    try {
      if ('serviceWorker' in window.navigator) {
        const register = await navigator.serviceWorker.register('/webpushworker.js', {
          scope: '/',
        });
        // Registering the Web Push Subscription
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          //public vapid key
          applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY as string),
        });
        return subscription;
      } else {
        return null;
      }
    } catch (error) {
      console.log('klg-25', error);
      return null;
    }
  };
  const send = async (payload: string) => {
    if ('serviceWorker' in window.navigator) {
      try {
        const register = await navigator.serviceWorker.register('/webpushworker.js', {
          scope: '/',
        });

        // Registering the Web Push Subscription
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          //public vapid key
          applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY as string),
        });

        const subscriptionBody = {
          subscription,
          payload,
        };
        await request('WEB_PUSH_SEND_MESSAGE', subscriptionBody);
      } catch (error) {
        console.log('klg-23', error);
      }
    }
  };
  async function registerPeriodicNewsCheck() {
    try {
      if ('serviceWorker' in window.navigator) {
        await navigator.serviceWorker.register('/webpushworker.js', {
          scope: '/',
        });
        const registration = (await navigator.serviceWorker.ready) as any;
        // Check if periodicSync is supported
        if ('periodicSync' in registration) {
          console.log('klg-35', registration);
          const status = (await navigator.permissions.query({ name: <any>'periodic-background-sync' })) as any;

          if (status && status.state === 'granted') {
            try {
              await registration.periodicSync.register('get-latest-news', {
                minInterval: 5 * 1000,
              });
              console.log('Periodic background sync registered!');
            } catch (error) {
              console.error(`Periodic background sync failed:\n${error}`);
            }
          }
        } else {
          console.log('Periodic Sync is not in Registration');
        }
      } else {
        console.log('Service worker not found ');
      }
    } catch (err) {
      console.log('klg-38', err);
      console.log('Periodic Sync could not be registered!');
    }
  }

  useEffect(() => {
    registerPeriodicNewsCheck().then(() => {
      navigator.serviceWorker.ready.then((registration: any) => {
        registration.periodicSync.getTags().then((tags: any) => {
          if (tags.includes('get-latest-news')) console.log('Messages sync already requested for periodically');
        });
      });
    });
  }, []);

  return { send, getSubscriptionBodyToken };
};
