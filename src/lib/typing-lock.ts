// While the on-screen pinyin keyboard is open, it owns the keyboard: letters,
// digits (tones), Space and Enter must not also flip or rate the card. Page
// shortcuts check this before acting.

let holders = 0;

/** Claim the keyboard; call the returned function to release it. */
export function lockTyping(): () => void {
  holders += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
  };
}

export function isTypingLocked(): boolean {
  return holders > 0;
}
