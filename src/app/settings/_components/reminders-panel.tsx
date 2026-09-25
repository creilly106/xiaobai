'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { removePushSubscription, savePushSubscription, sendTestReminder } from '@/lib/actions/push';
import { vapidKeyBytes } from '@/lib/push-config';

type State =
  | 'loading'
  | 'unsupported'
  /** iPhone/iPad in Safari: notifications only work from the home-screen app. */
  | 'needs-install'
  | 'blocked'
  | 'off'
  | 'on';

async function currentRegistration() {
  return navigator.serviceWorker.register('/sw.js');
}

export function RemindersPanel() {
  const [state, setState] = useState<State>('loading');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('Notification' in window)
      ) {
        setState(ios && !standalone ? 'needs-install' : 'unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setState('blocked');
        return;
      }
      const reg = await currentRegistration();
      setState((await reg.pushManager.getSubscription()) ? 'on' : 'off');
    })().catch(() => setState('unsupported'));
  }, []);

  function turnOn() {
    startTransition(async () => {
      try {
        if ((await Notification.requestPermission()) !== 'granted') {
          setState('blocked');
          return;
        }
        const reg = await currentRegistration();
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKeyBytes(),
          }));
        await savePushSubscription(sub.toJSON(), Intl.DateTimeFormat().resolvedOptions().timeZone);
        setState('on');
        toast.success('Daily reminders are on.');
      } catch {
        toast.error('Couldn’t turn on reminders on this device.');
      }
    });
  }

  function turnOff() {
    startTransition(async () => {
      const reg = await currentRegistration();
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setState('off');
    });
  }

  function test() {
    startTransition(async () => {
      const result = await sendTestReminder();
      if ('error' in result && result.error)
        toast.error(`Not set up on the server yet: ${result.error}.`);
      else if (result.sent > 0) toast.success('Sent — it should arrive in a few seconds.');
      else toast.info('No reminder was sent.');
    });
  }

  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted-foreground">
        A notification each evening (around 7 pm China time) if you haven’t studied yet that day,
        saying how many cards are waiting and what your next lesson is.
      </p>
      {state === 'loading' && <p className="text-muted-foreground">Checking this device…</p>}
      {state === 'unsupported' && <p>This browser can’t show notifications from websites.</p>}
      {state === 'needs-install' && (
        <p>
          On iPhone, reminders only work from the home-screen app. In Safari tap{' '}
          <strong>Share → Add to Home Screen</strong>, open Xiaobai from there, and come back to
          this page.
        </p>
      )}
      {state === 'blocked' && (
        <p>
          Notifications are blocked for Xiaobai. Allow them in your phone’s settings (iPhone:
          Settings → Notifications → Xiaobai), then reload this page.
        </p>
      )}
      {state === 'off' && (
        <Button type="button" onClick={turnOn} disabled={pending}>
          Turn on daily reminders
        </Button>
      )}
      {state === 'on' && (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={test} disabled={pending}>
            Send a test
          </Button>
          <Button type="button" variant="ghost" onClick={turnOff} disabled={pending}>
            Turn off on this device
          </Button>
        </div>
      )}
    </div>
  );
}
