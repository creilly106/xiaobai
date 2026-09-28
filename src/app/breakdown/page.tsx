import { BreakdownTool } from './_components/breakdown-tool';

export const metadata = { title: 'Break it down' };

export default function BreakdownPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Break it down</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste any Chinese — a message, a menu, a paragraph — to read it word by word: pinyin,
        meanings, and which words you already know. Tap a word for more. For a quick full
        translation, your phone&apos;s translate app is the way.
      </p>
      <div className="mt-5">
        <BreakdownTool />
      </div>
    </div>
  );
}
