import { FindCharacter } from './_components/find-character';

export const metadata = { title: 'Find a character' };

export default function FindPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Find a character</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Seen a character you can&apos;t read? Draw it, or pick the parts you recognise.
      </p>
      <div className="mt-5">
        <FindCharacter />
      </div>
    </div>
  );
}
