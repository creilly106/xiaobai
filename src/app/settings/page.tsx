import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccentChoice, ThemeChoice, ToneColorsChoice } from '@/components/appearance';
import { ResetReviewsButton } from '@/app/stats/_components/reset-button';
import { getSettings } from '@/lib/queries/settings';
import { getSuspendedCards } from '@/lib/queries/study';
import { StudyPrefForm } from './_components/pref-form';
import { SuspendedList } from './_components/suspended-list';
import { AudioPrefs } from './_components/audio-prefs';
import { BackupPanel } from './_components/backup-panel';
import { listBackupFiles } from '@/lib/backup';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth';
import { gateEnabled } from '@/lib/auth';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [settings, suspended, localBackups] = await Promise.all([
    getSettings(),
    getSuspendedCards(),
    listBackupFiles(),
  ]);
  const initial = {
    dailyNewLimit: settings.dailyNewLimit,
    dailyReviewLimit: settings.dailyReviewLimit,
    retentionTarget: settings.retentionTarget,
    listeningEnabled: settings.listeningEnabled,
    productionEnabled: settings.productionEnabled,
    dailyGoal: settings.dailyGoal,
    newWordsFrom: settings.newWordsFrom,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Learning preferences, appearance, and data management.
      </p>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Study preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyPrefForm initial={initial} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <AudioPrefs />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Mode</div>
              <ThemeChoice />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Accent colour</div>
              <AccentChoice />
            </div>
            <div className="sm:col-span-2">
              <ToneColorsChoice />
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Also available from the palette icon in the header. Saved in this browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Suspended cards{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({suspended.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuspendedList
              cards={suspended.map(({ id, hanzi, pinyin, meaning }) => ({
                id,
                hanzi,
                pinyin,
                meaning,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Backup &amp; restore</CardTitle>
          </CardHeader>
          <CardContent>
            <BackupPanel localBackups={localBackups} />
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-md">
                <div className="text-sm font-medium">Reset review history</div>
                <p className="text-xs text-muted-foreground">
                  Deletes your review log (stats, heatmap, rating counts) and resets your streak.
                  Cards keep their current schedule, so nothing you&apos;ve learned is forgotten.
                </p>
              </div>
              <ResetReviewsButton />
            </div>
          </CardContent>
        </Card>

        {gateEnabled() && (
          <form action={signOut} className="flex justify-end">
            <Button type="submit" variant="outline">
              Sign out on this device
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
