/**
 * Zalgo text effect for spooky message display
 *
 * @remarks
 * Adds random combining diacritical marks above and below text to create
 * a corrupted, haunted appearance. Inspired by the legendary Stack Overflow
 * answer and adapted from tchouky/The Great Rambler implementations.
 *
 * The effect works by adding Unicode combining characters that stack on top
 * of or below regular letters, creating a distorted, supernatural look.
 */

/**
 * Unicode combining marks that appear above characters
 * @internal
 */
const ZALGO_UP = [
  '\u030d',
  '\u030e',
  '\u0304',
  '\u0305',
  '\u033f',
  '\u0311',
  '\u0306',
  '\u0310',
  '\u0352',
  '\u0357',
  '\u0351',
  '\u0307',
  '\u0308',
  '\u030a',
  '\u0342',
  '\u0343',
  '\u0344',
  '\u034a',
  '\u034b',
  '\u034c',
  '\u0303',
  '\u0302',
  '\u030c',
  '\u0350',
  '\u0300',
  '\u0301',
  '\u030b',
  '\u030f',
  '\u0312',
  '\u0313',
  '\u0314',
  '\u033d',
  '\u0309',
  '\u0363',
  '\u0364',
  '\u0365',
  '\u0366',
  '\u0367',
  '\u0368',
  '\u0369',
  '\u036a',
  '\u036b',
  '\u036c',
  '\u036d',
  '\u036e',
  '\u036f',
  '\u033e',
  '\u035b',
  '\u0346',
  '\u031a',
];

/**
 * Unicode combining marks that appear below characters
 * @internal
 */
const ZALGO_DOWN = [
  '\u0316',
  '\u0317',
  '\u0318',
  '\u0319',
  '\u031c',
  '\u031d',
  '\u031e',
  '\u031f',
  '\u0320',
  '\u0324',
  '\u0325',
  '\u0326',
  '\u0329',
  '\u032a',
  '\u032b',
  '\u032c',
  '\u032d',
  '\u032e',
  '\u032f',
  '\u0330',
  '\u0331',
  '\u0332',
  '\u0333',
  '\u0339',
  '\u033a',
  '\u033b',
  '\u033c',
  '\u0345',
  '\u0347',
  '\u0348',
  '\u0349',
  '\u034d',
  '\u034e',
  '\u0353',
  '\u0354',
  '\u0355',
  '\u0356',
  '\u0359',
  '\u035a',
  '\u0323',
];

/**
 * Unicode combining marks that appear in the middle of characters
 * @internal
 */
const ZALGO_MID = [
  '\u0315',
  '\u031b',
  '\u0340',
  '\u0341',
  '\u0358',
  '\u0321',
  '\u0322',
  '\u0327',
  '\u0328',
  '\u0334',
  '\u0335',
  '\u0336',
  '\u034f',
  '\u035c',
  '\u035d',
  '\u035e',
  '\u035f',
  '\u0360',
  '\u0362',
  '\u0338',
  '\u0337',
  '\u0361',
  '\u0489',
];

/**
 * Maximum diacritical marks multiplier
 * Controls the upper bound of zalgo intensity
 * @internal
 */
// Maximum diacritical marks to add per character
const MAX_MARKS_MULTIPLIER = 5;

/**
 * Generate zalgo text with specified intensity
 *
 * @param text - Input text to transform
 * @param intensity - How many marks to add per character (0-1, default 0.5)
 * @returns Zalgofied text with combining diacritical marks
 *
 * @remarks
 * The intensity parameter controls how "corrupted" the text appears:
 * - 0.0: Minimal distortion (1-2 marks per character)
 * - 0.5: Medium distortion (2-3 marks per character) - DEFAULT
 * - 1.0: Maximum distortion (5-6 marks per character)
 *
 * Spaces are preserved without modification.
 *
 * @example
 * ```ts
 * zalgoify("BEWARE", 0.5)
 * // Returns something like: "B̴̢̛E̴̡̨W̵̢̛A̷̧̛R̸̨̛E̵̡̛"
 * ```
 */
export function zalgoify(text: string, intensity: number = 0.5): string {
  const maxMarks = Math.floor(intensity * MAX_MARKS_MULTIPLIER) + 1;

  return text
    .split('')
    .map((char) => {
      if (char === ' ') return char;

      let result = char;
      const numUp = Math.floor(Math.random() * maxMarks);
      const numMid = Math.floor(Math.random() * maxMarks);
      const numDown = Math.floor(Math.random() * maxMarks);

      for (let i = 0; i < numUp; i++) {
        result += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
      }

      for (let i = 0; i < numMid; i++) {
        result += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
      }

      for (let i = 0; i < numDown; i++) {
        result += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
      }

      return result;
    })
    .join('');
}

/**
 * Generate lighter zalgo effect for subtle spookiness
 *
 * @param text - Input text to transform
 * @returns Text with light zalgo distortion (intensity 0.3)
 *
 * @remarks
 * Useful for messages that should be eerie but still easily readable.
 */
export function zalgoifyLight(text: string): string {
  return zalgoify(text, 0.3);
}

/**
 * Generate heavier zalgo effect for maximum spookiness
 *
 * @param text - Input text to transform
 * @returns Text with heavy zalgo distortion (intensity 0.8)
 *
 * @remarks
 * Useful for dramatic or climactic spirit messages that should appear
 * heavily corrupted and supernatural.
 */
export function zalgoifyHeavy(text: string): string {
  return zalgoify(text, 0.8);
}
