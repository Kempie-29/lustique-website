/** en-ZA currency formatting: space thousands, no decimals, "R" prefix. */

export function formatZar(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  const grouped = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${amount < 0 ? "−" : ""}R${grouped}`;
}

/** Weddings read "from R…" because length and party size move the total. */
export function formatTotal(amount: number, isWeddingLike: boolean): string {
  return isWeddingLike ? `from ${formatZar(amount)}` : formatZar(amount);
}

const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

export function numberWord(n: number): string {
  return WORDS[n] ?? String(n);
}

export function pluralise(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}