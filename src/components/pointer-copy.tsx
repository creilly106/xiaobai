/**
 * Instructions that depend on the device: "Tap" on a phone, "Click" or
 * "Hover" with a mouse. Pure CSS, so it's right on the first paint.
 */
export function PointerCopy({ touch, mouse }: { touch: string; mouse: string }) {
  return (
    <>
      <span className="pointer-coarse:hidden">{mouse}</span>
      <span className="hidden pointer-coarse:inline">{touch}</span>
    </>
  );
}
