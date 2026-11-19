// NumberNest question bank.
// Math questions are generated with fresh numbers every time. Reading uses a library of
// passages. Each session mixes skills, shuffles the answer choices, and avoids questions
// this device has seen recently. All content is original and made up for practice.
(function () {
  "use strict";

  // ---------- helpers ----------
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const money = (n) => "$" + n.toFixed(2);
  const dec = (n) => String(Math.round(n * 100) / 100);
  let counter = 0;

  // Build four unique choices: the right answer plus plausible mistakes.
  function choices(right, wrongs, fill) {
    const out = [String(right)];
    for (const w of wrongs) {
      const s = String(w);
      if (!out.includes(s) && s !== "NaN" && s !== "undefined") out.push(s);
      if (out.length === 4) break;
    }
    let k = 1;
    while (out.length < 4 && k < 50) {
      const s = String(fill(k++));
      if (!out.includes(s)) out.push(s);
    }
    return out;
  }

  function q(skill, prompt, right, wrongs, fill, hints, nudge, steps, rightFeedback, extra) {
    const list = choices(right, wrongs, fill);
    return Object.assign(
      {
        id: "g" + Date.now().toString(36) + "-" + counter++,
        skill,
        prompt,
        choices: list,
        answerIndex: 0,
        hints,
        nudge,
        steps: steps.map(([title, detail]) => ({ title, detail })),
        rightFeedback,
      },
      extra || {},
    );
  }

  const NAMES = ["Mia", "Leo", "Ava", "Jayden", "Zoe", "Mateo", "Aaliyah", "Noah", "Sofia", "Malik", "Lily", "Diego", "Nia", "Ethan", "Priya", "Marcus"];
  const THINGS = [
    ["stickers", "sticker"], ["marbles", "marble"], ["crayons", "crayon"], ["apples", "apple"],
    ["shells", "shell"], ["cookies", "cookie"], ["blocks", "block"], ["toy cars", "toy car"],
  ];

  // ---------- math generators, by grade ----------
  const MATH = {
    1: [
      function addWithin20() {
        const a = rnd(4, 9), b = rnd(3, 9), s = a + b, n = pick(NAMES), [t] = pick(THINGS);
        return q("Adding within 20", `${n} has ${a} ${t}. ${n} gets ${b} more. How many ${t} does ${n} have now?`, s,
          [s - 1, s + 1, Math.abs(a - b), s + 2], (k) => s + 2 + k,
          [`Start with the bigger number, ${a}, and count up ${b} more on your fingers.`, `Try making 10 first. How many does ${a} need to get to 10? Then add what is left.`],
          `You're close. "Gets more" means we add.`,
          [["Start with what they had", `${n} starts with ${a}.`], ["Add the new ones", `${a} + ${b}. Count up ${b} from ${a}.`], ["Answer", `${a} + ${b} = ${s}.`]],
          `Yes! ${a} + ${b} = ${s}.`);
      },
      function subWithin20() {
        const a = rnd(9, 18), b = rnd(2, a - 3), d = a - b, n = pick(NAMES), [t] = pick(THINGS);
        return q("Subtracting within 20", `${n} had ${a} ${t} and gave ${b} to a friend. How many are left?`, d,
          [a + b, d + 1, d - 1, b], (k) => d + 1 + k,
          [`"Gave away" means some are leaving. Do we add or take away?`, `Start at ${a} and count back ${b}.`],
          `You're close. Giving some away makes the number smaller.`,
          [["Start with the total", `${n} had ${a}.`], ["Take away what was given", `${a} − ${b}. Count back ${b} from ${a}.`], ["Answer", `${a} − ${b} = ${d}.`]],
          `That's it. ${a} − ${b} = ${d} left.`);
      },
      function missingAddend() {
        const a = rnd(3, 9), m = rnd(2, 9), t = a + m;
        return q("Finding the missing number", `${a} + ? = ${t}. What number is missing?`, m,
          [t, m + 1, m - 1, a + t], (k) => m + 1 + k,
          [`Start at ${a}. How many jumps does it take to land on ${t}?`, `You can also think: ${t} − ${a} = ?`],
          `You're close. The missing number is how far it is from ${a} to ${t}.`,
          [["Start at the first number", `Begin at ${a}.`], ["Count up to the total", `Count on from ${a} until you reach ${t}.`], ["Answer", `That takes ${m} jumps, so ${a} + ${m} = ${t}.`]],
          `Yes! ${a} + ${m} = ${t}.`);
      },
      function tensAndOnes() {
        const t = rnd(2, 9), o = rnd(0, 9), n = t * 10 + o;
        return q("Tens and ones", `How many tens and ones are in ${n}?`, `${t} tens and ${o} ones`,
          [`${o} tens and ${t} ones`, `${t + 1} tens and ${o} ones`, `${n} tens and 0 ones`], (k) => `${t} tens and ${(o + k) % 10} ones`,
          [`The first digit tells you the tens.`, `In ${n}, the ${t} is in the tens place. What is in the ones place?`],
          `You're close. Read the digits left to right: tens first, then ones.`,
          [["Find the tens", `The first digit, ${t}, means ${t} tens = ${t * 10}.`], ["Find the ones", `The last digit, ${o}, means ${o} ones.`], ["Put it together", `${t * 10} + ${o} = ${n}.`]],
          `Right! ${n} is ${t} tens and ${o} ones.`);
      },
      function biggestNumber() {
        const base = rnd(2, 8) * 10, nums = shuffle([base + rnd(1, 9), base + rnd(10, 19), base - rnd(1, 9), base + rnd(0, 9)]);
        const big = Math.max(...nums);
        return q("Comparing numbers", `Which number is the biggest: ${nums.join(", ")}?`, big,
          nums.filter((x) => x !== big), (k) => big - 10 - k,
          [`Look at the tens digit first. The one with the most tens is biggest.`, `If two numbers have the same tens, then compare the ones.`],
          `You're close. Compare the tens before you compare the ones.`,
          [["Look at the tens", `Find the number with the biggest tens digit.`], ["Check the ones if needed", `If the tens match, the bigger ones digit wins.`], ["Answer", `${big} is the biggest.`]],
          `Yes! ${big} is the biggest.`);
      },
    ],
    2: [
      function addRegroup() {
        let a, b;
        do { a = rnd(15, 68); b = rnd(15, 99 - a); } while ((a % 10) + (b % 10) < 10);
        const s = a + b;
        return q("Adding two-digit numbers", `What is ${a} + ${b}?`, s, [s - 10, s + 10, s + 1], (k) => s + 2 + k,
          [`Add the ones first: ${a % 10} + ${b % 10}. Is that more than 9?`, `When the ones make 10 or more, carry 1 ten over to the tens.`],
          `You're close. Did you remember to carry the extra ten?`,
          [["Add the ones", `${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Write ${((a % 10) + (b % 10)) % 10} and carry 1 ten.`],
           ["Add the tens", `${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 carried = ${Math.floor(s / 10)} tens.`], ["Answer", `${a} + ${b} = ${s}.`]],
          `Yes! ${a} + ${b} = ${s}.`);
      },
      function subRegroup() {
        let a, b;
        do { a = rnd(41, 99); b = rnd(12, a - 10); } while (b % 10 <= a % 10);
        const d = a - b, noBorrow = Math.abs((a % 10) - (b % 10)) + (Math.floor(a / 10) - Math.floor(b / 10)) * 10;
        return q("Subtracting with borrowing", `What is ${a} − ${b}?`, d, [noBorrow, d + 10, d - 1], (k) => d + 1 + k,
          [`Look at the ones: can you take ${b % 10} from ${a % 10}?`, `You can't, so borrow 1 ten. That turns ${a % 10} ones into ${(a % 10) + 10} ones.`],
          `You're close. When the top ones digit is smaller, you need to borrow a ten.`,
          [["Borrow a ten", `${a % 10} is smaller than ${b % 10}, so trade 1 ten for 10 ones: ${(a % 10) + 10} ones.`],
           ["Subtract the ones", `${(a % 10) + 10} − ${b % 10} = ${d % 10}.`], ["Subtract the tens", `${Math.floor(a / 10) - 1} − ${Math.floor(b / 10)} = ${Math.floor(d / 10)}. So the answer is ${d}.`]],
          `That's right. ${a} − ${b} = ${d}.`);
      },
      function placeValue3() {
        const h = rnd(1, 9), t = rnd(1, 9), o = rnd(0, 9), n = h * 100 + t * 10 + o;
        return q("Place value to 1,000", `In the number ${n}, what is the value of the digit ${t} in the tens place?`, t * 10,
          [t, t * 100, n], (k) => t * 10 + k,
          [`The tens place is the middle digit of a three-digit number.`, `Each ten is worth 10. So ${t} tens is worth...?`],
          `You're close. A digit in the tens place is worth that many tens.`,
          [["Find the place", `In ${n}: ${h} hundreds, ${t} tens, ${o} ones.`], ["Find the value", `${t} tens = ${t} × 10 = ${t * 10}.`], ["Answer", `The ${t} is worth ${t * 10}.`]],
          `Yes! The ${t} is in the tens place, so it is worth ${t * 10}.`);
      },
      function coins() {
        const qu = rnd(0, 3), di = rnd(1, 4), ni = rnd(0, 3), pe = rnd(0, 4), total = qu * 25 + di * 10 + ni * 5 + pe;
        const parts = [qu && `${qu} quarter${qu > 1 ? "s" : ""}`, `${di} dime${di > 1 ? "s" : ""}`, ni && `${ni} nickel${ni > 1 ? "s" : ""}`, pe && `${pe} penn${pe > 1 ? "ies" : "y"}`].filter(Boolean);
        const n = pick(NAMES);
        return q("Counting money", `${n} has ${parts.join(", ")}. How many cents is that?`, `${total}¢`,
          [`${qu + di + ni + pe}¢`, `${total + 5}¢`, `${total - 5}¢`], (k) => `${total + 10 + k}¢`,
          [`Start with the coins worth the most. A quarter is 25¢, a dime is 10¢, a nickel is 5¢, a penny is 1¢.`, `Count the quarters first, then count on by 10s for dimes, 5s for nickels, 1s for pennies.`],
          `You're close. Each coin has a different value, so don't just count the coins.`,
          [["Quarters", `${qu} × 25¢ = ${qu * 25}¢.`], ["Dimes and nickels", `${di} × 10¢ = ${di * 10}¢ and ${ni} × 5¢ = ${ni * 5}¢.`], ["Add it all up", `${qu * 25} + ${di * 10} + ${ni * 5} + ${pe} = ${total}¢.`]],
          `Yes! That's ${total}¢.`);
      },
      function skipCount() {
        const step = pick([2, 5, 10, 100]), start = step * rnd(2, 8), seq = [start, start + step, start + 2 * step], next = start + 3 * step;
        return q("Skip counting", `Count by ${step}s: ${seq.join(", ")}, __. What comes next?`, next,
          [next + 1, next + step, start + 2 * step + 1], (k) => next - k,
          [`How much does the number grow each time?`, `It grows by ${step}. What is ${seq[2]} + ${step}?`],
          `You're close. Keep adding the same amount each time.`,
          [["Find the pattern", `Each number is ${step} more than the one before.`], ["Add one more step", `${seq[2]} + ${step} = ${next}.`], ["Answer", `The next number is ${next}.`]],
          `Yes! ${next} comes next.`);
      },
    ],
    3: [
      function multiplyGroups() {
        const a = rnd(3, 9), b = rnd(3, 9), p = a * b, [t] = pick(THINGS);
        return q("Multiplication as equal groups", `There are ${a} bags with ${b} ${t} in each bag. How many ${t} in all?`, p,
          [a + b, p - b, p + a], (k) => p + k,
          [`Equal groups means we can multiply instead of adding over and over.`, `${a} groups of ${b} is ${a} × ${b}. Can you skip count by ${b}, ${a} times?`],
          `You're close. Count how many groups and how many are in each.`,
          [["Groups and size", `${a} bags, ${b} in each.`], ["Multiply", `${a} × ${b}.`], ["Answer", `${a} × ${b} = ${p}.`]],
          `Yes! ${a} × ${b} = ${p}.`);
      },
      function divideShare() {
        const b = rnd(2, 9), qq = rnd(2, 9), total = b * qq, n = pick(NAMES), [t] = pick(THINGS);
        return q("Division facts", `${n} shares ${total} ${t} equally among ${b} friends. How many does each friend get?`, qq,
          [total - b, qq + 1, qq - 1], (k) => qq + 2 + k,
          [`Sharing equally means dividing: ${total} ÷ ${b}.`, `Think of multiplication: ${b} × ? = ${total}.`],
          `You're close. Each friend gets the same amount, so divide.`,
          [["Write it as division", `${total} ÷ ${b}.`], ["Use a times fact", `${b} × ${qq} = ${total}.`], ["Answer", `Each friend gets ${qq}.`]],
          `That's right. ${total} ÷ ${b} = ${qq}.`);
      },
      function roundHundred() {
        let n;
        do { n = rnd(110, 980); } while (n % 100 === 50 || n % 100 === 0);
        const r = Math.round(n / 100) * 100, other = r === Math.floor(n / 100) * 100 ? r + 100 : r - 100;
        return q("Rounding to the nearest hundred", `Round ${n} to the nearest hundred.`, r,
          [other, Math.round(n / 10) * 10, r + 100 === other ? r - 100 : r + 100], (k) => r + 200 * k,
          [`Which two hundreds is ${n} between?`, `Look at the tens digit. 5 or more rounds up; 4 or less rounds down.`],
          `You're close. The tens digit decides whether to round up or down.`,
          [["Find the two hundreds", `${n} is between ${Math.floor(n / 100) * 100} and ${Math.floor(n / 100) * 100 + 100}.`], ["Check the tens digit", `The tens digit is ${Math.floor(n / 10) % 10}.`], ["Round", `So ${n} rounds to ${r}.`]],
          `Yes! ${n} rounds to ${r}.`);
      },
      function areaRect() {
        const l = rnd(3, 9), w = rnd(2, 8);
        return q("Area of a rectangle", `A rectangle is ${l} units long and ${w} units wide. What is its area?`, `${l * w} square units`,
          [`${2 * (l + w)} square units`, `${l + w} square units`, `${l * w + l} square units`], (k) => `${l * w + k + 1} square units`,
          [`Area means how many squares cover the whole shape.`, `You can count rows: ${w} rows with ${l} squares in each. That's ${w} × ${l}.`],
          `You're close. Area is length times width, not adding the sides.`,
          [["Picture the rows", `${w} rows of ${l} squares.`], ["Multiply", `${l} × ${w} = ${l * w}.`], ["Answer", `The area is ${l * w} square units.`]],
          `Yes! ${l} × ${w} = ${l * w} square units.`);
      },
      function perimeter() {
        const l = rnd(4, 12), w = rnd(2, 9), p = 2 * (l + w);
        return q("Perimeter", `A garden is ${l} feet long and ${w} feet wide. How many feet of fence go all the way around it?`, `${p} feet`,
          [`${l * w} feet`, `${l + w} feet`, `${p + 2} feet`], (k) => `${p - 2 * k} feet`,
          [`"All the way around" means add up all four sides.`, `A rectangle has two long sides (${l}) and two short sides (${w}).`],
          `You're close. Fence goes around the outside, so add every side.`,
          [["List the sides", `${l} + ${w} + ${l} + ${w}.`], ["Add", `${l + l} + ${w + w} = ${p}.`], ["Answer", `${p} feet of fence.`]],
          `That's right. The perimeter is ${p} feet.`);
      },
    ],
    4: [
      function multiDigitTimesOne() {
        const a = rnd(112, 489), b = rnd(3, 8), p = a * b;
        return q("Multiplying multi-digit numbers", `What is ${a} × ${b}?`, p, [p - 100, p + 10, a + b], (k) => p + b * k,
          [`Break ${a} into hundreds, tens and ones, and multiply each part by ${b}.`, `${Math.floor(a / 100) * 100} × ${b}, then ${Math.floor(a / 10) % 10 * 10} × ${b}, then ${a % 10} × ${b}. Add them.`],
          `You're close. Multiply every part of the big number, then add the parts.`,
          [["Hundreds", `${Math.floor(a / 100) * 100} × ${b} = ${Math.floor(a / 100) * 100 * b}.`], ["Tens and ones", `${(Math.floor(a / 10) % 10) * 10} × ${b} = ${(Math.floor(a / 10) % 10) * 10 * b}, and ${a % 10} × ${b} = ${(a % 10) * b}.`], ["Add the parts", `Total: ${p}.`]],
          `Yes! ${a} × ${b} = ${p}.`);
      },
      function equivalentFraction() {
        const d = pick([2, 3, 4, 5, 6]), n = rnd(1, d - 1), k = rnd(2, 5), D = d * k;
        return q("Equivalent fractions", `${n}/${d} is the same as how many ${D}ths?`, `${n * k}/${D}`,
          [`${n + k}/${D}`, `${n}/${D}`, `${D - n * k}/${D}`], (j) => `${n * k + j}/${D}`,
          [`What do you multiply ${d} by to get ${D}?`, `${d} × ${k} = ${D}. Do the same thing to the top number.`],
          `You're close. Whatever you do to the bottom, do to the top.`,
          [["Bottom numbers", `${d} × ${k} = ${D}.`], ["Top number", `${n} × ${k} = ${n * k}.`], ["Answer", `${n}/${d} = ${n * k}/${D}.`]],
          `Exactly. ${n}/${d} = ${n * k}/${D}.`,
          { visuals: [{ label: `${n}/${d}`, numerator: n, denominator: d, tone: "grape" }, { label: `?/${D}`, numerator: 0, denominator: D, tone: "sky" }] });
      },
      function addLikeFractions() {
        const d = rnd(5, 12), a = rnd(1, d - 3), b = rnd(1, d - a - 1), s = a + b;
        return q("Adding fractions with like denominators", `What is ${a}/${d} + ${b}/${d}?`, `${s}/${d}`,
          [`${s}/${2 * d}`, `${a * b}/${d}`, `${s + 1}/${d}`], (k) => `${s}/${d + k}`,
          [`Look at the bottom numbers. Are the pieces the same size?`, `The bottoms match, so keep ${d} and just add the tops.`],
          `You're close. When the denominators match, only the numerators get added.`,
          [["Same-size pieces", `Both fractions are ${d}ths.`], ["Add the tops", `${a} + ${b} = ${s}.`], ["Answer", `${s}/${d}.`]],
          `Yes! ${a}/${d} + ${b}/${d} = ${s}/${d}.`);
      },
      function compareFractions() {
        let d1, d2, n1, n2;
        do { d1 = pick([3, 4, 5, 6, 8]); d2 = pick([3, 4, 5, 6, 8]); n1 = rnd(1, d1 - 1); n2 = rnd(1, d2 - 1); } while (d1 === d2 || n1 * d2 === n2 * d1);
        const D = d1 * d2, a = n1 * d2, b = n2 * d1, big = a > b ? `${n1}/${d1}` : `${n2}/${d2}`, small = a > b ? `${n2}/${d2}` : `${n1}/${d1}`;
        return q("Comparing fractions with unlike denominators", `Which is bigger: ${n1}/${d1} or ${n2}/${d2}?`, big,
          [small, "They are the same", "You can't compare them"], () => "Neither",
          [`Can you turn both fractions into the same kind of pieces first?`, `${D} works as a common denominator. Rewrite both fractions as ${D}ths.`],
          `You're close. Make the bottom numbers match before you compare.`,
          [["Common denominator", `${d1} × ${d2} = ${D}.`], ["Rewrite both", `${n1}/${d1} = ${a}/${D} and ${n2}/${d2} = ${b}/${D}.`], ["Compare the tops", `${Math.max(a, b)} is bigger than ${Math.min(a, b)}, so ${big} is bigger.`]],
          `Yes! ${big} is bigger: ${a}/${D} vs ${b}/${D}.`,
          { visuals: [{ label: `${n1}/${d1}`, numerator: n1, denominator: d1, tone: "grape" }, { label: `${n2}/${d2}`, numerator: n2, denominator: d2, tone: "sky" }] });
      },
      function divideRemainder() {
        const d = rnd(3, 9), qq = rnd(11, 29), r = rnd(1, d - 1), N = d * qq + r;
        return q("Division with remainders", `What is ${N} ÷ ${d}?`, `${qq} R${r}`,
          [`${qq} R${r + 1 < d ? r + 1 : r - 1}`, `${qq + 1} R${r}`, `${qq - 1} R${r}`], (k) => `${qq} R0`,
          [`How many times does ${d} fit into ${N} without going over?`, `${d} × ${qq} = ${d * qq}. How much is left over from ${N}?`],
          `You're close. The remainder must be smaller than ${d}.`,
          [["Biggest fit", `${d} × ${qq} = ${d * qq}, and ${d} × ${qq + 1} = ${d * (qq + 1)} is too big.`], ["Leftover", `${N} − ${d * qq} = ${r}.`], ["Answer", `${N} ÷ ${d} = ${qq} R${r}.`]],
          `That's right. ${N} ÷ ${d} = ${qq} remainder ${r}.`);
      },
    ],
    5: [
      function addDecimals() {
        const a = rnd(105, 899) / 100, b = rnd(105, 899) / 100, s = Math.round((a + b) * 100) / 100;
        return q("Adding decimals", `What is ${a.toFixed(2)} + ${b.toFixed(2)}?`, s.toFixed(2),
          [(s + 0.1).toFixed(2), (s - 1).toFixed(2), (s + 1).toFixed(2)], (k) => (s + 0.01 * k).toFixed(2),
          [`Line up the decimal points before you add.`, `Add the hundredths, then the tenths, then the ones. Carry when a column makes 10 or more.`],
          `You're close. Keep the decimal points lined up.`,
          [["Line them up", `${a.toFixed(2)} over ${b.toFixed(2)}, points in a column.`], ["Add each column", `Hundredths, tenths, then ones, carrying as needed.`], ["Answer", `${s.toFixed(2)}.`]],
          `Yes! ${a.toFixed(2)} + ${b.toFixed(2)} = ${s.toFixed(2)}.`);
      },
      function fractionOfNumber() {
        const d = pick([2, 3, 4, 5, 6, 8]), n = rnd(1, d - 1), k = rnd(2, 9), w = d * k, ans = n * k;
        return q("Fraction of a whole number", `What is ${n}/${d} of ${w}?`, ans, [k, w * n, w - ans], (j) => ans + j,
          [`First find 1/${d} of ${w}. Split ${w} into ${d} equal parts.`, `1/${d} of ${w} is ${k}. Now how much is ${n} of those parts?`],
          `You're close. Divide by the bottom number, then multiply by the top.`,
          [["One part", `${w} ÷ ${d} = ${k}.`], ["Take the parts you need", `${k} × ${n} = ${ans}.`], ["Answer", `${n}/${d} of ${w} is ${ans}.`]],
          `Yes! ${n}/${d} of ${w} is ${ans}.`);
      },
      function volume() {
        const l = rnd(2, 9), w = rnd(2, 6), h = rnd(2, 5), v = l * w * h;
        return q("Volume of a rectangular box", `A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its volume?`, `${v} cubic cm`,
          [`${l + w + h} cubic cm`, `${l * w} cubic cm`, `${2 * (l * w + w * h + l * h)} cubic cm`], (k) => `${v + k * h} cubic cm`,
          [`Volume counts the cubes that fill the box.`, `Find the cubes on the bottom layer (${l} × ${w}), then multiply by how many layers tall it is.`],
          `You're close. Volume uses all three measurements multiplied together.`,
          [["Bottom layer", `${l} × ${w} = ${l * w} cubes.`], ["Stack the layers", `${l * w} × ${h} = ${v}.`], ["Answer", `${v} cubic cm.`]],
          `Yes! ${l} × ${w} × ${h} = ${v} cubic cm.`);
      },
      function orderOfOps() {
        const a = rnd(2, 15), b = rnd(2, 9), c = rnd(2, 9), r = a + b * c;
        return q("Order of operations", `What is ${a} + ${b} × ${c}?`, r, [(a + b) * c, a * b + c, a + b + c], (k) => r + k,
          [`Which comes first: adding or multiplying?`, `Multiply first: ${b} × ${c}. Then add ${a}.`],
          `You're close. Multiplication happens before addition.`,
          [["Multiply first", `${b} × ${c} = ${b * c}.`], ["Then add", `${a} + ${b * c} = ${r}.`], ["Answer", `${r}.`]],
          `That's right. Multiply first, then add: ${r}.`);
      },
      function decimalTimesPower() {
        const x = rnd(12, 999) / 100, p = pick([10, 100]), r = Math.round(x * p * 100) / 100;
        return q("Multiplying decimals by 10 and 100", `What is ${x.toFixed(2)} × ${p}?`, dec(r),
          [dec(Math.round(x * (p === 10 ? 100 : 10) * 100) / 100), dec(Math.round((x / p) * 10000) / 10000), dec(Math.round((x + p) * 100) / 100)], (k) => dec(r + k),
          [`Multiplying by ${p} makes the number ${p} times bigger.`, `Move the decimal point ${p === 10 ? "one place" : "two places"} to the right.`],
          `You're close. Count how many zeros are in ${p}. That's how far the point moves.`,
          [["Count the zeros", `${p} has ${p === 10 ? 1 : 2} zero${p === 10 ? "" : "s"}.`], ["Move the point", `Shift the decimal point ${p === 10 ? 1 : 2} place${p === 10 ? "" : "s"} right.`], ["Answer", `${dec(r)}.`]],
          `Yes! ${x.toFixed(2)} × ${p} = ${dec(r)}.`);
      },
    ],
    6: [
      function equivalentRatio() {
        const a = rnd(2, 9), b = rnd(2, 9), k = rnd(2, 6);
        if (a === b) return equivalentRatio();
        return q("Equivalent ratios", `A recipe uses ${a} cups of flour for every ${b} cups of milk. How much flour for ${b * k} cups of milk?`, `${a * k} cups`,
          [`${a + k} cups`, `${b * k} cups`, `${a * k + a} cups`], (j) => `${a * k - j} cups`,
          [`How many times bigger is ${b * k} than ${b}?`, `The milk was multiplied by ${k}. Do the same to the flour.`],
          `You're close. Both parts of a ratio grow by the same factor.`,
          [["Find the scale factor", `${b} × ${k} = ${b * k}.`], ["Scale the flour", `${a} × ${k} = ${a * k}.`], ["Answer", `${a * k} cups of flour.`]],
          `Yes! ${a}:${b} is the same as ${a * k}:${b * k}.`);
      },
      function percentOf() {
        const p = pick([10, 20, 25, 30, 50, 75]), n = pick([20, 40, 60, 80, 120, 200, 240]), r = (p * n) / 100;
        return q("Percent of a number", `What is ${p}% of ${n}?`, dec(r), [dec(n / p), dec(n - r), dec(r * 2)], (k) => dec(r + 5 * k),
          [`Percent means "out of 100." ${p}% is ${p}/100.`, `Find 10% of ${n} first (${n / 10}), then use it to build ${p}%.`],
          `You're close. ${p}% is a part of ${n}, so it should be smaller than ${n}.`,
          [["Find 10%", `10% of ${n} is ${n / 10}.`], [`Build up to ${p}%`, `${p}% is ${p / 10} groups of 10%: ${p / 10} × ${n / 10}.`], ["Answer", `${p}% of ${n} = ${dec(r)}.`]],
          `Yes! ${p}% of ${n} is ${dec(r)}.`);
      },
      function unitRate() {
        const price = rnd(2, 9) + pick([0, 0.25, 0.5, 0.75]), c = rnd(3, 8), total = price * c, item = pick(["notebooks", "smoothies", "bus passes", "pens"]);
        return q("Unit rate", `${c} ${item} cost ${money(total)}. What is the cost of one?`, money(price),
          [money(total - c), money(price + 1), money(total / (c + 1))], (k) => money(price + 0.5 * k),
          [`Unit rate means the price for just one.`, `Split the total equally: ${money(total)} ÷ ${c}.`],
          `You're close. Divide the total by the number of items.`,
          [["Set up the division", `${money(total)} ÷ ${c}.`], ["Divide", `${total} ÷ ${c} = ${price}.`], ["Answer", `${money(price)} each.`]],
          `That's right. One costs ${money(price)}.`);
      },
      function integers() {
        const a = -rnd(2, 12), b = rnd(1, 15), s = a + b;
        return q("Adding negative numbers", `What is ${a} + ${b}?`, s, [-s, a - b, b - a], (k) => s + k,
          [`Picture a number line. Start at ${a}.`, `Adding ${b} means moving ${b} steps to the right from ${a}.`],
          `You're close. Moving right on the number line makes a number bigger.`,
          [["Start on the number line", `Begin at ${a}.`], ["Move right", `Jump ${b} steps right.`], ["Answer", `You land on ${s}.`]],
          `Yes! ${a} + ${b} = ${s}.`);
      },
      function oneStepEquation() {
        if (Math.random() < 0.5) {
          const x = rnd(3, 30), a = rnd(4, 25), b = x + a;
          return q("One-step equations", `Solve for x: x + ${a} = ${b}`, `x = ${x}`, [`x = ${b + a}`, `x = ${x + 1}`, `x = ${a}`], (k) => `x = ${x - k}`,
            [`What can you do to both sides to get x by itself?`, `Undo the + ${a} by subtracting ${a} from both sides.`],
            `You're close. Do the opposite operation to both sides.`,
            [["Undo the addition", `Subtract ${a} from both sides.`], ["Simplify", `x = ${b} − ${a}.`], ["Answer", `x = ${x}.`]],
            `Yes! x = ${x}. Check: ${x} + ${a} = ${b}.`);
        }
        const x = rnd(2, 12), a = rnd(2, 9), b = a * x;
        return q("One-step equations", `Solve for x: ${a}x = ${b}`, `x = ${x}`, [`x = ${b * a}`, `x = ${b - a}`, `x = ${x + 1}`], (k) => `x = ${x + 1 + k}`,
          [`${a}x means ${a} times x. What undoes multiplying?`, `Divide both sides by ${a}.`],
          `You're close. Use division to undo multiplication.`,
          [["Undo the multiplication", `Divide both sides by ${a}.`], ["Simplify", `x = ${b} ÷ ${a}.`], ["Answer", `x = ${x}.`]],
          `Yes! x = ${x}. Check: ${a} × ${x} = ${b}.`);
      },
    ],
  };

  const MATH_TOPICS = {
    1: "Adding, subtracting and place value",
    2: "Two-digit math, place value and money",
    3: "Multiplication, division, rounding and area",
    4: "Fractions, multiplication and division",
    5: "Decimals, fractions, volume and order of operations",
    6: "Ratios, percents, integers and equations",
  };

  // ---------- reading library ----------
  // Each passage has 2 questions: [skill, prompt, choices (right first), hint1, hint2, nudge, steps, rightFeedback]
  const P = (id, passage, qs) => ({ id, passage, qs });
  const READING = {
    1: [
      P("r1a", "Sam has a red kite. He runs fast in the park. The wind pulls the kite up, up, up. It goes over the tall tree. Sam laughs and holds the string tight.", [
        ["Story details", "What color is Sam's kite?", ["Red", "Blue", "Green", "Yellow"], "Look at the very first sentence.", "The story says Sam has a ___ kite.", "You're close. Read the first sentence again.", [["Find the kite", "The first sentence talks about the kite."], ["Read the word before kite", "It says a red kite."], ["Answer", "The kite is red."]], "Yes! Sam's kite is red."],
        ["Story details", "What pulls the kite up?", ["The wind", "Sam's dad", "A bird", "The tree"], "Find the sentence with the word up in it.", "Something pulls the kite up, up, up. What is it?", "You're close. Something in the sky moves the kite.", [["Find the right sentence", "The wind pulls the kite up, up, up."], ["Who does the pulling?", "The wind does."], ["Answer", "The wind."]], "Right! The wind pulls it up."],
      ]),
      P("r1b", "Nia has a pet fish named Bubbles. Bubbles is orange with a big tail. Every morning Nia drops two flakes of food in the tank. Bubbles swims to the top to eat.", [
        ["Story details", "What is the name of Nia's fish?", ["Bubbles", "Goldie", "Nemo", "Flakes"], "Look at the first sentence.", "The fish is named ___.", "You're close. The name is in the first sentence.", [["Find the pet", "Nia has a pet fish."], ["Find its name", "It is named Bubbles."], ["Answer", "Bubbles."]], "Yes! The fish is named Bubbles."],
        ["Order of events", "What does Bubbles do after Nia drops in the food?", ["Swims to the top to eat", "Hides in a rock", "Goes to sleep", "Jumps out of the tank"], "Find the last sentence of the story.", "First Nia drops food. Then Bubbles swims to the ___.", "You're close. Look at what happens last.", [["First", "Nia drops two flakes of food."], ["Next", "Bubbles swims to the top."], ["Answer", "Bubbles swims up to eat."]], "Right! Bubbles swims up to eat."],
      ]),
      P("r1c", "It is raining. Jay puts on his yellow boots. He jumps in a big puddle. Splash! Water gets on his mom. She smiles and jumps in too.", [
        ["Word meaning", "What does splash tell us?", ["The water flew up", "Jay fell down", "The rain stopped", "Mom was mad"], "Splash is a sound word. What makes that sound?", "When you jump in a puddle, the water flies up and makes a splash.", "You're close. Think about what happens when you jump in water.", [["Find the word", "Splash! comes right after Jay jumps."], ["Think about the sound", "Jumping in water makes it fly up."], ["Answer", "The water flew up."]], "Yes! Splash means water flew up."],
        ["Characters' feelings", "How does Mom feel about getting wet?", ["Happy", "Angry", "Sad", "Scared"], "Look at what Mom does after the water hits her.", "She smiles and jumps in too. What does a smile show?", "You're close. A smile is a clue.", [["Find Mom", "Water gets on his mom."], ["What does she do?", "She smiles and jumps in too."], ["Answer", "She is happy."]], "Right! She smiles, so she is happy."],
      ]),
      P("r1d", "Lila plants a seed in a cup. She gives it water every day. She puts it by the window so it gets sun. After one week, a tiny green leaf pops up!", [
        ["Story details", "Where does Lila put the cup?", ["By the window", "In the closet", "Under her bed", "In the fridge"], "Find the sentence with the word sun.", "She puts it by the ___ so it gets sun.", "You're close. Plants need sun, so think about where the sun comes in.", [["Find the place", "She puts it by the window."], ["Why there?", "So it gets sun."], ["Answer", "By the window."]], "Yes! By the window, for the sun."],
        ["Order of events", "What happens after one week?", ["A tiny leaf pops up", "The seed is gone", "The cup breaks", "Lila forgets the plant"], "Look at the last sentence.", "After one week, a tiny green ___ pops up.", "You're close. The end of the story tells what happened.", [["Find the time words", "After one week..."], ["Read the rest", "a tiny green leaf pops up!"], ["Answer", "A leaf pops up."]], "Right! A tiny green leaf pops up."],
      ]),
    ],
    2: [
      P("r2a", "Marcus wanted to build the tallest block tower in his class. He stacked the big blocks on the bottom and the small blocks on top. When the tower got wobbly, he started over and made the base wider. This time it stood taller than his teacher's desk.", [
        ["Cause and effect", "Why did Marcus start over?", ["The tower got wobbly", "He ran out of blocks", "His teacher told him to", "He wanted to go outside"], "Find the word wobbly in the story.", "When the tower got wobbly, he started over. What made him start over?", "You're close. Look for the word when.", [["Find the problem", "The tower got wobbly."], ["See what he did", "He started over."], ["Answer", "Because it got wobbly."]], "Yes! It got wobbly, so he started over."],
        ["Word meaning", "What does base mean in this story?", ["The bottom part", "The top part", "A kind of game", "The classroom floor"], "He made the base wider so the tower would not fall.", "Where would you make a tower wider to keep it steady?", "You're close. Think about which part holds the rest up.", [["Find the word", "He made the base wider."], ["Use the clue", "Wider at the bottom keeps a tower steady."], ["Answer", "The base is the bottom part."]], "Right! The base is the bottom."],
      ]),
      P("r2b", "Every Saturday, Grandma Rosa and Ava make tortillas. Ava mixes the flour and water. Grandma rolls the dough into flat circles. Then they cook them on a hot pan until little brown spots appear. Ava's favorite part is eating the first warm one.", [
        ["Story details", "What does Ava do?", ["Mixes the flour and water", "Rolls the dough", "Washes the dishes", "Buys the flour"], "Find the sentence that starts with Ava.", "Ava ___ the flour and water.", "You're close. Grandma rolls; Ava does something else.", [["Find Ava's job", "Ava mixes the flour and water."], ["Find Grandma's job", "Grandma rolls the dough."], ["Answer", "Ava mixes."]], "Yes! Ava mixes the flour and water."],
        ["Order of events", "What happens right before they eat?", ["They cook them on a hot pan", "They buy them at the store", "They put them in the fridge", "They make a sandwich"], "Look for the word Then.", "Then they cook them on a hot pan. What comes after cooking?", "You're close. Put the steps in order: mix, roll, cook, eat.", [["Mix and roll", "First mix, then roll."], ["Cook", "Then they cook them on a hot pan."], ["Eat", "After cooking, Ava eats one. Cooking comes right before."]], "Right! They cook them right before eating."],
      ]),
      P("r2c", "Owls hunt at night. Their big eyes help them see in the dark. They can turn their heads almost all the way around. Their soft feathers let them fly without making a sound, so mice do not hear them coming.", [
        ["Main idea", "What is this passage mostly about?", ["How owls are good night hunters", "Why mice are fast", "How to draw an owl", "Where owls build nests"], "Every sentence tells something about owls.", "What do big eyes, turning heads and quiet feathers all help owls do?", "You're close. Think about what the whole passage explains.", [["Read the first sentence", "Owls hunt at night."], ["Look at the details", "Big eyes, turning heads, quiet feathers."], ["Put it together", "They all help owls hunt at night."]], "Yes! It's about how owls hunt at night."],
        ["Story details", "Why can't mice hear owls coming?", ["Their soft feathers make no sound", "Owls are very small", "Mice are sleeping", "Owls hide in trees"], "Find the last sentence.", "Their soft feathers let them fly without a ___.", "You're close. Look at what the feathers do.", [["Find the reason", "Soft feathers let them fly without a sound."], ["Connect it", "So mice don't hear them."], ["Answer", "The soft feathers are quiet."]], "Right! Soft feathers make them silent."],
      ]),
      P("r2d", "Diego lost his library book. He looked under the couch and in his backpack. He checked the car. Finally, his little sister came in holding it. She had been looking at the pictures all morning.", [
        ["Story details", "Where was the book?", ["His little sister had it", "Under the couch", "In the car", "In his backpack"], "Diego looked in lots of places. Who walked in at the end?", "His sister came in holding it.", "You're close. Read the last two sentences.", [["Places he looked", "Couch, backpack, car."], ["Who had it", "His little sister came in holding it."], ["Answer", "His sister had it."]], "Yes! His little sister had it."],
        ["Word meaning", "What does finally mean in the story?", ["At last, after a long time", "At the very start", "Very quickly", "In the dark"], "Diego looked in many places before the book showed up.", "Finally comes after a lot of searching. Does it mean the beginning or the end?", "You're close. Finally comes at the end of something.", [["Look at what came before", "He searched lots of places."], ["See where finally is", "It comes when the search ends."], ["Answer", "It means at last."]], "Right! Finally means at last."],
      ]),
    ],
    3: [
      P("r3a", "Jada was nervous about her first swim lesson. She stood at the edge of the pool with her toes curled over the side. The coach showed her how to blow bubbles and kick. By the end of the lesson, Jada was kicking across the shallow end and asking when she could come back.", [
        ["How characters change", "How did Jada change during the lesson?", ["She went from nervous to excited", "She went from happy to bored", "She went from brave to scared", "She did not change at all"], "Compare how she felt at the start and at the end.", "At the start she was nervous. At the end she asked when she could come back.", "You're close. Look at the first and last sentences.", [["Beginning", "She was nervous."], ["End", "She wanted to come back."], ["Change", "Nervous to excited."]], "Yes! She went from nervous to excited."],
        ["Making inferences", "Why were Jada's toes curled over the side?", ["She was scared to get in", "She was cold", "She was doing a trick", "Her shoes were too small"], "This happens right after we learn she was nervous.", "What do people do with their bodies when they don't want to go in yet?", "You're close. Connect it to how she was feeling.", [["Her feeling", "She was nervous."], ["Her body", "Standing at the edge, toes curled."], ["Inference", "She was scared to get in."]], "Right! She was nervous about getting in."],
      ]),
      P("r3b", "Bees do an important job. When a bee visits a flower to drink nectar, yellow powder called pollen sticks to its fuzzy body. At the next flower, some pollen rubs off. This helps plants make seeds and fruit. Without bees, we would have fewer apples, berries and pumpkins.", [
        ["Main idea", "What is the main idea?", ["Bees help plants make seeds and fruit", "Bees like yellow flowers best", "Pumpkins grow in the fall", "Bees have fuzzy bodies"], "Find the sentence that tells why the whole thing matters.", "Fuzzy bodies and pollen are details. What big job do they add up to?", "You're close. Pick the idea the details support, not one detail.", [["First sentence", "Bees do an important job."], ["Details", "Pollen moves from flower to flower."], ["Main idea", "That helps plants make seeds and fruit."]], "Yes! Bees help plants make seeds and fruit."],
        ["Word meaning", "What is pollen?", ["A yellow powder on flowers", "A sweet drink", "A kind of bee", "A fruit"], "The passage tells you right after the word.", "Yellow powder called pollen...", "You're close. Read the words right before pollen.", [["Find the word", "...yellow powder called pollen."], ["Use the clue", "Called means it is named."], ["Answer", "Pollen is a yellow powder."]], "Right! Pollen is the yellow powder."],
      ]),
      P("r3c", "Andre saved his allowance for three months to buy a skateboard. When he finally had enough, he saw that his neighbor's bike had a flat tire and no money to fix it. Andre thought for a long time. Then he walked next door with a new tire tube.", [
        ["Making inferences", "What did Andre most likely decide?", ["To use some money to help his neighbor", "To buy the skateboard right away", "To keep saving forever", "To sell his bike"], "Look at what he carried next door.", "Why would he bring a new tire tube to his neighbor?", "You're close. Actions show choices.", [["The problem", "The neighbor's bike had a flat."], ["Andre's action", "He brought a new tire tube."], ["Inference", "He used his money to help."]], "Yes! He chose to help his neighbor."],
        ["Character traits", "Which word best describes Andre?", ["Generous", "Lazy", "Selfish", "Silly"], "What kind of person gives up something they want to help someone?", "Generous means happy to give to others.", "You're close. Think about what his choice shows.", [["What he wanted", "A skateboard."], ["What he did", "Helped his neighbor."], ["Trait", "That is generous."]], "Right! Andre is generous."],
      ]),
      P("r3d", "The town's old library was too small. Kids had to sit on the floor during story time. So the neighbors held a bake sale, a car wash and a fun run. After a year of hard work, they raised enough money to add a new reading room with big windows and comfy chairs.", [
        ["Problem and solution", "What was the problem?", ["The library was too small", "The library had no books", "Kids did not like reading", "The town had no cars"], "Find the first sentence.", "Kids had to sit on the floor. Why?", "You're close. The problem comes first in the story.", [["First sentence", "The old library was too small."], ["Proof", "Kids sat on the floor."], ["Answer", "It was too small."]], "Yes! The library was too small."],
        ["Problem and solution", "How did the neighbors solve it?", ["They raised money to add a new room", "They closed the library", "They moved to a new town", "They bought more books"], "Look at what they did and what they built.", "Bake sale, car wash, fun run. What was all that for?", "You're close. Find what they got at the end.", [["Their actions", "A bake sale, car wash and fun run."], ["The result", "Enough money for a new reading room."], ["Solution", "They raised money to add a room."]], "Right! They raised money for a new room."],
      ]),
    ],
    4: [
      P("r4a", "Every morning, Mr. Okafor swept the sidewalk in front of his corner store, even the parts in front of other shops. Some people thought it was strange. But when the block won an award for the cleanest street in the city, everyone knew who had started it.", [
        ["Making inferences", "Who most likely started the clean-street habit?", ["Mr. Okafor", "The city mayor", "The other shop owners", "The award judges"], "Who swept even in front of other shops?", "The last sentence says everyone knew who started it. Who was sweeping every morning?", "You're close. The story only names one person sweeping.", [["The habit", "Sweeping every morning."], ["Who did it", "Mr. Okafor."], ["Inference", "He started it."]], "Yes! Mr. Okafor started it."],
        ["Theme", "What lesson does the story teach?", ["Small actions can make a big difference", "Never talk to your neighbors", "Awards are the most important thing", "Only clean your own space"], "Think about how one person's daily habit affected the whole block.", "A theme is a lesson you can use in your own life.", "You're close. The theme is bigger than sweeping.", [["The action", "One person sweeps every day."], ["The result", "The whole block wins an award."], ["Lesson", "Small actions add up."]], "Right! Small actions can make a big difference."],
      ]),
      P("r4b", "Octopuses are masters of disguise. Special cells in their skin can change color in less than a second. Some octopuses can even change the bumps on their skin to look like rocks or coral. This helps them hide from sharks and sneak up on crabs.", [
        ["Vocabulary in context", "What does disguise mean in this passage?", ["Changing how you look so others don't know you", "A very fast swimmer", "A kind of coral", "Being friendly"], "The rest of the passage explains how octopuses look like rocks or coral.", "Why would an animal look like a rock? What is it doing?", "You're close. Read the examples that follow the word.", [["Find the clues", "Change color, look like rocks or coral."], ["Why?", "To hide."], ["Meaning", "A disguise changes how you look."]], "Yes! A disguise hides who you are."],
        ["Main idea", "What is the main idea?", ["Octopuses can change how they look to hide and hunt", "Sharks eat crabs", "Coral is very colorful", "Octopuses have eight arms"], "Which answer covers the whole passage, not just one part?", "Color change, bumpy skin, hiding and hunting all connect to one big idea.", "You're close. A main idea is bigger than one fact.", [["Topic", "Octopuses."], ["Details", "Change color and texture."], ["Main idea", "They change how they look to hide and hunt."]], "Right! That's the main idea."],
      ]),
      P("r4c", "Keisha had practiced her piano piece for weeks, but at the recital her mind went blank. The room was silent. She took a deep breath, looked at her hands, and started again from the beginning. This time the music flowed. When she finished, the applause felt even louder than she had imagined.", [
        ["Character traits", "What does Keisha show when she starts again?", ["Determination", "Laziness", "Rudeness", "Boredom"], "She forgot the music in front of everyone. Did she give up?", "Determination means not giving up when something is hard.", "You're close. Look at what she did after her mind went blank.", [["The problem", "Her mind went blank."], ["Her action", "Deep breath, started again."], ["Trait", "Determination."]], "Yes! She showed determination."],
        ["Vocabulary in context", "What does flowed mean here?", ["Went smoothly", "Was very loud", "Stopped suddenly", "Spilled water"], "Think about how the music sounded the second time compared to the first.", "Water that flows moves smoothly without stopping.", "You're close. The first time she got stuck. The second time?", [["First try", "She got stuck."], ["Second try", "The music flowed."], ["Meaning", "It went smoothly."]], "Right! It went smoothly."],
      ]),
      P("r4d", "Before refrigerators, people cut huge blocks of ice from frozen lakes in winter. They packed the ice in sawdust and stored it in thick-walled icehouses. The ice could last all summer. Ice delivery workers carried blocks into homes with giant tongs.", [
        ["Cause and effect", "Why was the ice packed in sawdust?", ["To keep it from melting", "To make it taste better", "To make it lighter", "To color it"], "The ice lasted all summer. What helped it last?", "Sawdust works a little like a blanket that keeps the cold in.", "You're close. Think about why they wanted it to last until summer.", [["The goal", "Keep ice all summer."], ["The method", "Sawdust and thick walls."], ["Effect", "It kept the ice from melting."]], "Yes! Sawdust kept it from melting."],
        ["Author's purpose", "Why did the author write this passage?", ["To explain how people kept ice before refrigerators", "To convince you to buy a refrigerator", "To tell a funny story", "To teach you how to skate"], "Is the passage telling a story, giving facts, or trying to change your mind?", "It gives facts about how something worked long ago.", "You're close. Look at what kind of information it gives.", [["Kind of writing", "Facts about the past."], ["Topic", "Keeping ice before fridges."], ["Purpose", "To explain."]], "Right! It explains how people kept ice."],
      ]),
    ],
    5: [
      P("r5a", "The old oak in Rivera Park had stood for two hundred years. When the city planned to cut it down for a parking lot, Mateo wrote a letter to the newspaper. Neighbors read it, signed a petition, and filled the city council meeting. The council changed its plan. Today a small sign under the oak reads: \"Saved by the people who loved it.\"", [
        ["Theme", "Which theme fits the story best?", ["When people work together, they can protect what matters", "Old trees are dangerous", "Parking lots are more useful than parks", "Letters are hard to write"], "Think about what happened after Mateo's letter.", "One letter led many neighbors to act, and that changed the council's plan.", "You're close. A theme is a lesson about life, not just a fact from the story.", [["The problem", "The tree would be cut down."], ["The actions", "A letter, a petition, a full meeting."], ["Theme", "Working together protects what matters."]], "Yes! Working together saved the oak."],
        ["Summarizing", "Which is the best summary?", ["A boy's letter led neighbors to stop the city from cutting down an old oak", "An oak tree is two hundred years old", "The city wanted a parking lot", "A sign stands under a tree"], "A summary covers the beginning, middle and end in one sentence.", "Which choice tells the problem AND how it was solved?", "You're close. The other choices are only single details.", [["Beginning", "The city planned to cut the oak."], ["Middle", "Mateo and neighbors spoke up."], ["End", "The council changed its plan."]], "Right! That covers the whole story."],
      ]),
      P("r5b", "Thunder rolled across the valley like a giant clearing its throat. Priya pulled her hood tighter. The rain came down in silver sheets, and the trail turned into a chocolate river. Still, she smiled. Her grandfather had said the waterfall was most beautiful after a storm.", [
        ["Figurative language", "What does \"thunder rolled like a giant clearing its throat\" mean?", ["The thunder was deep and rumbling", "A giant was nearby", "Priya had a cold", "The storm was over"], "This is a simile. It compares thunder to something else using like.", "What does it sound like when someone big clears their throat? Low and rumbly.", "You're close. Similes describe; they aren't meant literally.", [["Spot the simile", "Thunder rolled like a giant clearing its throat."], ["Picture the sound", "A deep, rumbling noise."], ["Meaning", "The thunder was deep and rumbling."]], "Yes! It describes deep, rumbling thunder."],
        ["Making inferences", "Why does Priya smile even in the storm?", ["She expects the waterfall to look amazing", "She likes getting wet", "She is lost", "The storm has stopped"], "Read the last sentence carefully.", "Her grandfather said the waterfall is most beautiful after a storm.", "You're close. Her reason is in the final sentence.", [["The situation", "Rain and mud."], ["The clue", "The waterfall is best after a storm."], ["Inference", "She's excited to see it."]], "Right! She's looking forward to the waterfall."],
      ]),
      P("r5c", "In 1965, a group of students at a Chicago high school noticed their cafeteria threw away trays of food every day. They started a program to give the leftovers to a nearby shelter. Within a year, three other schools had copied their idea.", [
        ["Main idea", "What is the main idea?", ["Students started a program that other schools copied", "Cafeterias always waste food", "Chicago has many high schools", "Shelters need volunteers"], "Which choice tells what the students did and what happened because of it?", "Notice the last sentence: other schools copied the idea.", "You're close. Pick the choice that covers the whole passage.", [["Problem", "Food was thrown away."], ["Action", "Students gave leftovers to a shelter."], ["Result", "Other schools copied them."]], "Yes! That's the main idea."],
        ["Cause and effect", "What caused the students to start the program?", ["They saw the cafeteria throwing away food", "A teacher gave them homework", "The shelter asked for money", "They wanted to win a contest"], "Find what the students noticed.", "They noticed food was thrown away every day. Then they acted.", "You're close. The cause comes before the action.", [["What they noticed", "Trays of food thrown away."], ["What they did", "Gave leftovers to a shelter."], ["Cause", "The wasted food."]], "Right! The wasted food made them act."],
      ]),
      P("r5d", "My little brother is a tornado. He spins through the living room, scattering blocks, books and socks. Mom says he has ants in his pants. But at bedtime, when the house is quiet, he curls up next to me like a sleepy kitten and asks for one more story.", [
        ["Figurative language", "What does \"My little brother is a tornado\" mean?", ["He is wild and messy", "He likes the weather", "He is very tall", "He is scared of storms"], "This is a metaphor. It says he IS a tornado to describe how he acts.", "What does a tornado do to everything in its path?", "You're close. Think about what he does in the living room.", [["The metaphor", "He is a tornado."], ["The clues", "He spins and scatters things."], ["Meaning", "He is wild and messy."]], "Yes! He's wild and messy like a tornado."],
        ["Compare and contrast", "How is the brother different at bedtime?", ["He is calm and cuddly", "He is even wilder", "He is angry", "He is not home"], "Look at the word But. It shows a change.", "At bedtime he curls up like a sleepy kitten. How is a kitten different from a tornado?", "You're close. Compare the daytime brother to the bedtime brother.", [["Daytime", "Wild, like a tornado."], ["Bedtime", "Like a sleepy kitten."], ["Difference", "Calm and cuddly at night."]], "Right! At bedtime he's calm and cuddly."],
      ]),
    ],
    6: [
      P("r6a", "Some cities are painting their rooftops white. Dark roofs soak up sunlight and can reach over 150 degrees in summer, heating the buildings below. White roofs reflect much of that sunlight. Studies show this can lower the temperature inside by several degrees and cut energy bills. Critics argue the paint costs money, but supporters say it pays for itself within a few summers.", [
        ["Author's purpose", "What is the author's main purpose?", ["To explain why some cities paint roofs white", "To tell a story about a hot summer", "To sell white paint", "To describe how to climb on a roof"], "Look at what the passage gives you: facts, reasons and evidence.", "It explains a practice and why people do it. Does it tell a story or try to sell something?", "You're close. Notice that it includes both sides.", [["Topic", "White rooftops."], ["Content", "Facts, studies and both sides."], ["Purpose", "To inform and explain."]], "Yes! It explains why cities paint roofs white."],
        ["Using evidence", "Which detail best supports the idea that white roofs help?", ["Studies show this can lower the temperature inside", "Some cities are painting their rooftops white", "Critics argue the paint costs money", "Dark roofs soak up sunlight"], "Evidence for a claim should show a benefit.", "Which sentence shows a result that helps people?", "You're close. One choice is the opposite side's argument.", [["The claim", "White roofs help."], ["Check each choice", "Only one shows a measured benefit."], ["Best evidence", "Studies show cooler temperatures."]], "Right! The study result is the strongest evidence."],
      ]),
      P("r6b", "Malik's grandmother handed him the worn leather notebook. \"Your grandfather wrote in this every day for forty years,\" she said. Malik turned the yellowed pages slowly. There were weather notes, grocery lists, and, on the very last page, a single line: \"Teach Malik to fish.\" Malik closed the notebook and looked out at the lake for a long time.", [
        ["Word choice", "Why does the author describe the notebook as worn and the pages as yellowed?", ["To show the notebook is old and well used", "To show it is cheap", "To show Malik spilled something", "To show it was just bought"], "What happens to a notebook used every day for forty years?", "Worn and yellowed are clues about time and use.", "You're close. These words tell you about age.", [["The words", "Worn, yellowed."], ["The fact", "Used every day for forty years."], ["Effect", "It shows the notebook is old and loved."]], "Yes! It shows how old and used it is."],
        ["Making inferences", "What is Malik most likely feeling at the end?", ["Moved and thoughtful about his grandfather", "Bored by the notebook", "Angry at his grandmother", "Excited to go shopping"], "He reads a line about himself, then looks at the lake for a long time.", "The last page shows his grandfather was thinking of him. How might that feel?", "You're close. Long, quiet moments in stories usually show deep feelings.", [["The discovery", "A line about teaching Malik to fish."], ["His reaction", "Looks at the lake for a long time."], ["Inference", "He's moved and thinking about his grandfather."]], "Right! He's moved and thoughtful."],
      ]),
      P("r6c", "School should start later, argues a group of student council members. They point to research showing teenagers' sleep cycles shift later during puberty, making it hard to fall asleep before 11 p.m. They also note that schools that moved start times to 8:30 or later reported better attendance and fewer car accidents among teen drivers.", [
        ["Claim and evidence", "What is the students' main claim?", ["School should start later", "Teenagers drive too fast", "Puberty is difficult", "Attendance is always good"], "The claim is what they are trying to convince people of.", "Look at the very first sentence.", "You're close. Evidence supports a claim; it isn't the claim itself.", [["Find the opinion", "School should start later."], ["Find the support", "Sleep research, attendance, accidents."], ["Claim", "School should start later."]], "Yes! That's their claim."],
        ["Using evidence", "Which is evidence for their claim?", ["Schools with later start times reported better attendance", "School should start later", "The students are on the student council", "Teens like to stay up late"], "Evidence is a fact or result that supports the claim.", "Which choice describes a measured result from real schools?", "You're close. One choice just repeats the claim.", [["The claim", "Start school later."], ["Look for results", "Better attendance at later-start schools."], ["Evidence", "That result supports the claim."]], "Right! The attendance result is evidence."],
      ]),
      P("r6d", "The marathon runner crossed the finish line forty minutes after the winner. The crowd had mostly gone home. But a small group of volunteers stayed, clapping and cheering as if she had won. Later she said that moment meant more to her than any medal.", [
        ["Theme", "What theme does this passage suggest?", ["Kindness and encouragement can matter more than winning", "Only winners deserve attention", "Marathons are too long", "Volunteers should go home early"], "Why did the moment mean more than a medal?", "She didn't win, but people cheered for her anyway.", "You're close. Think about what made the moment special.", [["The situation", "She finished last, long after the winner."], ["What happened", "Volunteers cheered for her."], ["Theme", "Encouragement can mean more than winning."]], "Yes! Kindness can matter more than winning."],
        ["Vocabulary in context", "What does \"as if she had won\" tell you about the volunteers' cheering?", ["They cheered as loudly as they would for a winner", "They thought she really won", "They were confused", "They were cheering for someone else"], "As if compares what happened to something else.", "They knew she didn't win, but they cheered like she did.", "You're close. As if means like, not that it was true.", [["The phrase", "As if she had won."], ["What it compares", "Their cheering to a winner's cheering."], ["Meaning", "They cheered just as loudly."]], "Right! They cheered like she was the winner."],
      ]),
    ],
  };

  // A second set of passages, four more per grade.
  const MORE = {
    1: [
      P("r1e", "Ben has a big brown dog named Rocky. Rocky likes to dig. He digs in the yard. He digs in the sand. One day Rocky digs up Ben's lost red ball! Ben gives Rocky a hug.", [
        ["Story details", "What does Rocky like to do?", ["Dig", "Swim", "Sleep", "Bark at cats"], "Look at the second sentence.", "Rocky likes to ___.", "You're close. The story says it more than once.", [["Find Rocky", "Rocky is Ben's dog."], ["Find what he likes", "Rocky likes to dig."], ["Answer", "Dig."]], "Yes! Rocky likes to dig."],
        ["Story details", "What does Rocky find?", ["Ben's lost red ball", "A bone", "A shoe", "A toy car"], "Find the sentence that says One day.", "Rocky digs up Ben's lost ___.", "You're close. Look near the end of the story.", [["Find the clue", "One day Rocky digs up..."], ["Read the rest", "...Ben's lost red ball!"], ["Answer", "The red ball."]], "Right! He finds Ben's red ball."],
      ]),
      P("r1f", "Ana and Pop go to the farm. They see a cow. Moo! They see a pig. Oink! They pick a big orange pumpkin. Ana carries it to the car. It is heavy, but she does not drop it.", [
        ["Story details", "What do Ana and Pop pick?", ["A pumpkin", "An apple", "A flower", "A carrot"], "Find the word pick in the story.", "They pick a big orange ___.", "You're close. It is big and orange.", [["Find the word pick", "They pick a big orange..."], ["Read the next word", "pumpkin."], ["Answer", "A pumpkin."]], "Yes! They pick a pumpkin."],
        ["Word meaning", "The pumpkin is heavy. What does heavy mean?", ["Hard to lift", "Very small", "Very soft", "Easy to carry"], "Ana almost could not carry it.", "It is heavy, BUT she does not drop it. Was it easy or hard to carry?", "You're close. Think about how it felt to carry.", [["Find the word", "It is heavy."], ["Use the clue", "She worked hard not to drop it."], ["Answer", "Heavy means hard to lift."]], "Right! Heavy means hard to lift."],
      ]),
      P("r1g", "The sun goes down. The sky turns pink and orange. Birds fly home to their nests. Kim puts on her pajamas. She looks out the window and sees the first star. She makes a wish.", [
        ["Order of events", "What happens first?", ["The sun goes down", "Kim makes a wish", "Kim sees a star", "Kim puts on pajamas"], "Look at the very first sentence.", "The story starts with the ___ going down.", "You're close. Find the first thing that happens.", [["First sentence", "The sun goes down."], ["Later", "Pajamas, star, wish."], ["Answer", "The sun goes down first."]], "Yes! The sun goes down first."],
        ["Making inferences", "What time of day is it?", ["Night time", "Morning", "Lunch time", "Noon"], "The sun goes down and Kim puts on pajamas.", "When do you wear pajamas and see stars?", "You're close. Think about when the sun goes down.", [["Clue 1", "The sun goes down."], ["Clue 2", "Pajamas and stars."], ["Answer", "It is night."]], "Right! It is night time."],
      ]),
      P("r1h", "Tom wants to help. He sets the table. He puts a fork by each plate. He puts a cup by each plate too. Mom says, \"Thank you, Tom! You are a big helper.\" Tom feels proud.", [
        ["Story details", "What does Tom put by each plate?", ["A fork and a cup", "A spoon", "A hat", "A book"], "Find the sentences that start with He puts.", "He puts a ___ by each plate. He puts a ___ too.", "You're close. There are two things.", [["First thing", "A fork."], ["Second thing", "A cup."], ["Answer", "A fork and a cup."]], "Yes! A fork and a cup."],
        ["Characters' feelings", "How does Tom feel at the end?", ["Proud", "Sad", "Angry", "Sleepy"], "Read the last sentence.", "Tom feels ___.", "You're close. The last sentence tells you.", [["What happened", "Mom thanked him."], ["Last sentence", "Tom feels proud."], ["Answer", "Proud."]], "Right! Tom feels proud."],
      ]),
    ],
    2: [
      P("r2e", "Zoe found a hurt bird under the slide at recess. One of its wings was hanging down. She did not touch it. Instead, she ran to get her teacher. Ms. Lee called an animal helper, who came and took the bird to get better.", [
        ["Story details", "Where did Zoe find the bird?", ["Under the slide", "In a tree", "In the classroom", "On the bus"], "Look at the first sentence.", "Zoe found a hurt bird under the ___.", "You're close. It was at recess.", [["Find the place", "...under the slide at recess."], ["Check", "That is where she saw it."], ["Answer", "Under the slide."]], "Yes! Under the slide."],
        ["Character traits", "What does Zoe do that is smart?", ["She gets a grown-up to help", "She picks up the bird", "She runs away", "She keeps playing"], "Read the sentences after she finds the bird.", "She did not touch it. Instead, she ran to get her ___.", "You're close. Who did she get?", [["What she didn't do", "She did not touch it."], ["What she did", "She got her teacher."], ["Answer", "She got a grown-up to help."]], "Right! Getting a grown-up was smart."],
      ]),
      P("r2f", "A caterpillar eats and eats. When it is big, it makes a hard shell around itself called a chrysalis. Inside, it changes. After about two weeks, the shell opens and out comes a butterfly with bright wings.", [
        ["Order of events", "What happens after the caterpillar makes a chrysalis?", ["It changes inside", "It eats leaves", "It is an egg", "It lays eggs"], "Find the word Inside.", "The caterpillar makes a chrysalis. Then, inside, it ___.", "You're close. Look at the sentence right after chrysalis.", [["Step 1", "It eats and eats."], ["Step 2", "It makes a chrysalis."], ["Step 3", "Inside, it changes."]], "Yes! It changes inside."],
        ["Word meaning", "What is a chrysalis?", ["A hard shell around the caterpillar", "A kind of leaf", "A butterfly's wing", "A bird's nest"], "The passage tells you right before the word.", "A hard shell around itself called a ___.", "You're close. Read what the word is called.", [["Find the word", "...called a chrysalis."], ["Read the clue", "A hard shell around itself."], ["Answer", "A hard shell."]], "Right! A chrysalis is the hard shell."],
      ]),
      P("r2g", "Jamal wanted to win the spelling bee. Every night he practiced ten words with his big sister. Some nights he got tired and wanted to quit, but he kept going. On the day of the bee, he spelled every word right and won a blue ribbon.", [
        ["Story details", "Who helped Jamal practice?", ["His big sister", "His dad", "His teacher", "His friend"], "Find the word practiced.", "He practiced ten words with his big ___.", "You're close. Look at the second sentence.", [["Find the sentence", "Every night he practiced..."], ["Find who", "...with his big sister."], ["Answer", "His big sister."]], "Yes! His big sister helped."],
        ["Theme", "What lesson does the story teach?", ["Practice and not giving up pays off", "Spelling is easy", "Ribbons are blue", "Sisters are bossy"], "Jamal was tired but kept going. What happened in the end?", "He practiced every night and won. What does that teach?", "You're close. Think about why he won.", [["The work", "He practiced every night."], ["The hard part", "He wanted to quit but kept going."], ["Lesson", "Practice pays off."]], "Right! Practice and not giving up pays off."],
      ]),
      P("r2h", "Elephants are the biggest animals on land. They use their long trunks to smell, drink water, and pick up food. A trunk is so strong it can lift a log, but it can also gently pick up a single peanut.", [
        ["Main idea", "What is this passage mostly about?", ["What elephants do with their trunks", "Where peanuts grow", "How logs are cut", "Why elephants are gray"], "Most of the sentences are about one body part.", "Smell, drink, pick up food, lift a log. What part does all that?", "You're close. Look for what every detail is about.", [["Topic", "Elephants."], ["Details", "The trunk smells, drinks, lifts and picks up."], ["Main idea", "What elephants do with trunks."]], "Yes! It's about what elephant trunks can do."],
        ["Word meaning", "What does gently mean?", ["Softly and carefully", "Very fast", "Very loud", "Roughly"], "Picking up one peanut without crushing it.", "Lifting a log is strong. Picking up a peanut needs a ___ touch.", "You're close. Compare a heavy log to a tiny peanut.", [["The contrast", "Strong enough for a log."], ["The other side", "But also picks up a single peanut."], ["Meaning", "Gently means softly and carefully."]], "Right! Gently means softly and carefully."],
      ]),
    ],
    3: [
      P("r3e", "When the power went out during the storm, Lucas felt scared of the dark. His grandpa lit a candle and said, \"Let's tell stories the old way.\" They took turns making up tales about brave knights and talking dogs. By the time the lights came back on, Lucas almost wished they hadn't.", [
        ["How characters change", "How did Lucas's feelings change?", ["From scared to having fun", "From happy to angry", "From bored to sleepy", "They did not change"], "Compare the first sentence to the last sentence.", "At first he was scared. At the end he almost wished the lights stayed off. Why?", "You're close. Find his feeling at the start and the end.", [["Start", "Scared of the dark."], ["Middle", "Telling stories with Grandpa."], ["End", "He was having so much fun he almost wanted the dark to stay."]], "Yes! He went from scared to having fun."],
        ["Making inferences", "Why did Lucas almost wish the lights hadn't come back?", ["He was enjoying the stories with Grandpa", "He liked the storm", "He wanted to go to sleep", "The lights were too bright"], "What were they doing when the lights came back?", "They were making up stories together. Did he want that to end?", "You're close. Think about what the lights coming back would stop.", [["What they were doing", "Telling stories."], ["What the lights mean", "The fun might end."], ["Inference", "He was enjoying it."]], "Right! He was enjoying story time."],
      ]),
      P("r3f", "Penguins are birds, but they cannot fly. Instead, their wings work like flippers, helping them zoom through the water to catch fish. Their black-and-white coloring helps them hide. From above, their black backs blend with the dark ocean. From below, their white bellies blend with the bright sky.", [
        ["Main idea", "What is the main idea?", ["Penguins have special features for life in the water", "Penguins can fly very high", "Fish live in the ocean", "The sky is bright"], "Every detail is about how penguins' bodies help them.", "Flipper wings, coloring that hides them. What do they all show?", "You're close. Pick the idea that covers all the details.", [["Topic", "Penguins."], ["Details", "Flipper wings and hiding colors."], ["Main idea", "Their bodies are made for ocean life."]], "Yes! Penguins have special features for the water."],
        ["Cause and effect", "Why are penguins hard to see from above?", ["Their black backs blend with the dark ocean", "They swim very deep", "They hide under ice", "They are very small"], "Find the sentence that says From above.", "From above, their black backs blend with the dark ___.", "You're close. Look at the color of their backs.", [["Look from above", "You see their backs."], ["Their backs", "Black."], ["The ocean", "Dark, so they blend in."]], "Right! Black backs blend with the dark ocean."],
      ]),
      P("r3g", "Emma's class planted a garden in an empty lot next to the school. At first, neighbors walked past without looking. But as tomatoes, sunflowers and peppers began to grow, people stopped to chat. Soon, Mr. Gomez from across the street was bringing his own watering can to help.", [
        ["How things change", "How did the neighbors change?", ["From ignoring the garden to helping with it", "From helping to leaving", "From happy to angry", "They never noticed"], "Compare At first with Soon.", "At first they walked past. Soon, Mr. Gomez brought a watering can. What changed?", "You're close. Look at the beginning and the end.", [["At first", "They walked past without looking."], ["Then", "They stopped to chat."], ["Soon", "A neighbor helped water it."]], "Yes! They went from ignoring it to helping."],
        ["Making inferences", "Why did people start stopping to chat?", ["The growing plants caught their attention", "The school told them to", "It was raining", "They were lost"], "What started happening right before people stopped?", "Tomatoes, sunflowers and peppers began to grow.", "You're close. Look for the word as.", [["What changed in the garden", "Plants began to grow."], ["What people did", "They stopped to chat."], ["Inference", "The plants caught their interest."]], "Right! The growing plants got their attention."],
      ]),
      P("r3h", "Carlos always picked the same lunch: a turkey sandwich. One day the cafeteria ran out of turkey, so he tried the veggie wrap. He took a tiny bite, then a bigger one. \"This is actually really good,\" he said. The next week, he tried the lentil soup.", [
        ["Theme", "What lesson does the story teach?", ["Trying new things can be a nice surprise", "Turkey is the best food", "Cafeterias always run out", "Never eat lunch at school"], "Carlos only ate one thing until he had to try something new.", "He liked the new food, then tried another. What does that teach?", "You're close. Think about what Carlos learned.", [["Before", "Same lunch every day."], ["The change", "He had to try the wrap and liked it."], ["Lesson", "New things can be good surprises."]], "Yes! Trying new things can be a nice surprise."],
        ["Character change", "What shows that Carlos changed?", ["He tried the lentil soup the next week", "He ate a turkey sandwich", "He took a tiny bite", "The cafeteria ran out of turkey"], "Look for something he chose to do on his own.", "The last sentence shows a new choice.", "You're close. Which action did he pick himself, without being forced?", [["Forced change", "No turkey, so he tried the wrap."], ["His own choice", "Next week he tried lentil soup."], ["Evidence", "That shows he changed."]], "Right! Trying the soup shows he changed."],
      ]),
    ],
    4: [
      P("r4e", "Hurricanes form over warm ocean water. The warm, wet air rises and starts to spin. As more warm air feeds the storm, it grows stronger. When a hurricane moves over land or cold water, it loses its fuel and slowly weakens.", [
        ["Cause and effect", "Why does a hurricane weaken over land?", ["It loses its fuel of warm ocean water", "Land is too bumpy", "Trees block the wind", "It runs out of spin"], "What does the passage say feeds the storm?", "Warm ocean air is its fuel. Is there warm ocean water over land?", "You're close. Look for the word fuel.", [["Fuel", "Warm, wet ocean air."], ["Over land", "There is no warm ocean water."], ["Effect", "It loses fuel and weakens."]], "Yes! Without warm water, it loses its fuel."],
        ["Text structure", "How is this passage organized?", ["It explains steps in order, from forming to weakening", "It compares two storms", "It tells a story about a family", "It lists opinions about weather"], "Look at how each sentence moves forward in time.", "Forms, rises and spins, grows, weakens. What kind of order is that?", "You're close. Notice the sequence.", [["Start", "Hurricanes form."], ["Middle", "They grow stronger."], ["End", "They weaken."]], "Right! It explains the steps in order."],
      ]),
      P("r4f", "Grandpa Leon never threw anything away. His garage was full of old bike parts, broken radios and jars of screws. Everyone teased him about it. But when the school's science fair needed materials, Grandpa Leon's garage became the most popular place on the block.", [
        ["Making inferences", "Why did the garage become popular?", ["It had lots of parts kids could use for projects", "Grandpa gave out candy", "It was the biggest garage", "It had a TV"], "What did the science fair need?", "The fair needed materials. What was the garage full of?", "You're close. Connect the garage to the science fair.", [["What the fair needed", "Materials."], ["What the garage had", "Bike parts, radios, screws."], ["Inference", "Kids came for project parts."]], "Yes! It was full of useful parts."],
        ["Theme", "What theme does the story show?", ["Something others laugh at can turn out to be valuable", "Never keep old things", "Garages should be clean", "Science fairs are boring"], "People teased Grandpa. Then what happened?", "His habit that people laughed at turned out to help everyone.", "You're close. Think about how people saw the garage at first and later.", [["At first", "Everyone teased him."], ["Later", "Everyone needed his garage."], ["Theme", "What others laugh at can be valuable."]], "Right! What people laughed at became valuable."],
      ]),
      P("r4g", "The Great Chicago Fire started on October 8, 1871. Strong winds and wooden buildings helped the flames spread quickly. The fire burned for two days and destroyed much of the city. Afterward, Chicago rebuilt with brick and stone, and new rules required buildings to be safer.", [
        ["Cause and effect", "What helped the fire spread quickly?", ["Strong winds and wooden buildings", "Brick and stone", "New safety rules", "Rain"], "Find the second sentence.", "Strong winds and ___ buildings helped the flames spread.", "You're close. What were buildings made of back then?", [["Find the cause", "Strong winds and wooden buildings."], ["Find the effect", "Flames spread quickly."], ["Answer", "Wind and wood."]], "Yes! Wind and wooden buildings spread the fire."],
        ["Making inferences", "Why did Chicago rebuild with brick and stone?", ["Brick and stone don't burn as easily as wood", "Wood was too expensive", "Brick is prettier", "Stone is lighter"], "Think about what helped the fire spread.", "Wooden buildings burned fast. What would a city want instead?", "You're close. Connect the building material to the fire.", [["The problem", "Wood burned quickly."], ["The change", "Brick and stone."], ["Inference", "They burn less easily."]], "Right! Brick and stone are safer from fire."],
      ]),
      P("r4h", "Sofia's soccer team was losing 2 to 0 at halftime. Her teammates sat with their heads down. Sofia stood up. \"We've come back before,\" she said. \"Let's pass more and stop trying to do everything alone.\" In the second half, they scored three goals.", [
        ["Character traits", "Which word best describes Sofia?", ["Encouraging", "Selfish", "Shy", "Careless"], "Look at what she did when her teammates were sad.", "She stood up and gave them a plan and hope. What kind of person does that?", "You're close. Think about how her words affected the team.", [["The moment", "Teammates had their heads down."], ["Her action", "She cheered them on with a plan."], ["Trait", "Encouraging."]], "Yes! Sofia is encouraging."],
        ["Cause and effect", "What most likely helped the team score three goals?", ["Passing more and working together", "The other team left", "It started raining", "Sofia played alone"], "What advice did Sofia give?", "She said to pass more and stop trying to do everything alone.", "You're close. Connect her advice to the result.", [["The advice", "Pass more, work together."], ["The result", "Three goals."], ["Cause", "Teamwork."]], "Right! Passing and teamwork helped."],
      ]),
    ],
    5: [
      P("r5e", "Coral reefs cover less than one percent of the ocean floor, yet they are home to about a quarter of all ocean species. Reefs are built by tiny animals called coral polyps. When ocean water gets too warm, corals lose the colorful algae that feed them and turn white, a process called bleaching. Without help, bleached reefs can die.", [
        ["Main idea", "What is the main idea?", ["Coral reefs are important and in danger from warm water", "The ocean is very big", "Algae are colorful", "Polyps are tiny"], "The passage tells why reefs matter and what threatens them.", "One part shows why reefs matter. The other shows a danger. Which choice has both?", "You're close. Pick the choice that covers the whole passage.", [["Why reefs matter", "Home to a quarter of ocean species."], ["The danger", "Warm water causes bleaching."], ["Main idea", "Important and in danger."]], "Yes! Reefs are important and in danger."],
        ["Vocabulary in context", "What is bleaching?", ["When corals lose their algae and turn white", "When reefs grow bigger", "When fish clean the coral", "When the ocean freezes"], "The passage defines it right before the word.", "Corals lose the algae that feed them and turn white, a process called ___.", "You're close. Read the words just before bleaching.", [["Find the word", "...a process called bleaching."], ["Read the definition", "Losing algae and turning white."], ["Meaning", "That is bleaching."]], "Right! That's coral bleaching."],
      ]),
      P("r5f", "Dad's food truck had a line around the block, but Kayla could see him wiping his forehead and rushing. She grabbed an apron. \"I'll take orders,\" she said. Dad looked surprised, then grinned. By the end of lunch, the line was gone, and Dad handed her a tip jar with her name taped on it.", [
        ["Making inferences", "Why did Kayla grab an apron?", ["She saw her dad needed help", "She was hungry", "She wanted a new outfit", "Her dad told her to"], "What did Kayla notice about her dad?", "He was wiping his forehead and rushing. What does that tell you?", "You're close. She noticed something before she acted.", [["What she saw", "A long line and Dad rushing."], ["What it means", "He was overwhelmed."], ["Inference", "She wanted to help."]], "Yes! She saw he needed help."],
        ["Character's feelings", "How did Dad feel about Kayla helping?", ["Surprised and then proud", "Angry", "Bored", "Embarrassed"], "Look at Dad's reactions, in order.", "He looked surprised, then grinned, then gave her a tip jar with her name.", "You're close. His actions show how he felt.", [["First", "He looked surprised."], ["Then", "He grinned."], ["Finally", "He gave her a tip jar. He was proud."]], "Right! Surprised, then proud."],
      ]),
      P("r5g", "Some people think video games are a waste of time. But researchers have found that certain games can improve problem-solving skills and teamwork. Players in strategy games plan ahead, and players in team games learn to communicate quickly. Still, experts agree that balance matters: games should not replace sleep, exercise or homework.", [
        ["Author's point of view", "What is the author's view of video games?", ["They can have benefits, but balance is important", "They are always bad", "They should replace homework", "They are only for adults"], "The author gives benefits and also a warning.", "Look at the word Still in the last sentence. What does it add?", "You're close. The author shows two sides.", [["Benefits", "Problem-solving and teamwork."], ["Warning", "Balance matters."], ["View", "Helpful, in balance."]], "Yes! Games can help, but balance matters."],
        ["Using evidence", "Which detail supports the idea that games can be helpful?", ["Players in strategy games plan ahead", "Some people think games are a waste of time", "Games should not replace sleep", "Balance matters"], "Find a detail that shows a skill games build.", "Which choice describes something good players learn?", "You're close. Some choices are warnings, not benefits.", [["The idea", "Games can help."], ["Look for a benefit", "Planning ahead."], ["Evidence", "Strategy players plan ahead."]], "Right! Planning ahead is a benefit."],
      ]),
      P("r5h", "The night before the big race, Imani couldn't sleep. Her mind raced faster than her feet ever had. She replayed every turn of the track. In the morning, her coach said, \"You've done the work. Now just run your race.\" Imani took a deep breath, and the butterflies in her stomach began to settle.", [
        ["Figurative language", "What does \"butterflies in her stomach\" mean?", ["She felt nervous", "She ate butterflies", "She was hungry", "She felt sick from food"], "This is an expression, not something real.", "When do people feel fluttery inside? Before something big and scary.", "You're close. Connect it to how she felt the night before.", [["The expression", "Butterflies in her stomach."], ["The situation", "Before a big race."], ["Meaning", "She felt nervous."]], "Yes! It means she was nervous."],
        ["Figurative language", "What does \"her mind raced faster than her feet ever had\" mean?", ["She had many thoughts going quickly", "She ran in her sleep", "She forgot the race", "Her feet were slow"], "Her mind is not really running. What is it doing?", "She replayed every turn of the track all night. Lots of fast thoughts.", "You're close. Think about why she couldn't sleep.", [["The phrase", "Her mind raced."], ["The clue", "She replayed every turn."], ["Meaning", "Lots of quick thoughts."]], "Right! Her thoughts were racing."],
      ]),
    ],
    6: [
      P("r6e", "In 1955, fifteen-year-old Claudette Colvin refused to give up her bus seat in Montgomery, Alabama, nine months before Rosa Parks did the same. Colvin was arrested. Her case later became part of the lawsuit that ended bus segregation in the city. For decades her role was little known, but historians now recognize her courage.", [
        ["Main idea", "What is the main idea?", ["Claudette Colvin took a brave stand that helped end bus segregation", "Buses in 1955 were crowded", "Rosa Parks lived in Montgomery", "Historians study the past"], "Which choice covers what she did and why it mattered?", "She refused, was arrested, and her case helped end segregation.", "You're close. A main idea covers the whole passage.", [["Her action", "Refused to give up her seat."], ["The result", "Her case helped end bus segregation."], ["Main idea", "A brave stand that made a difference."]], "Yes! Her stand helped end bus segregation."],
        ["Making inferences", "Why might Colvin's role have been little known for decades?", ["Others' stories got more attention at the time", "She asked people not to talk about it", "She never rode a bus", "The arrest never happened"], "The passage says historians recognize her NOW. What about before?", "Rosa Parks became famous for a similar act. Whose story got more attention?", "You're close. Think about whose name most people know.", [["The fact", "Her role was little known."], ["The comparison", "Rosa Parks' act became famous."], ["Inference", "Other stories got more attention."]], "Right! Other stories got more attention then."],
      ]),
      P("r6f", "The fox had always believed the crow was foolish. So when the crow offered to share a map to a hidden orchard, the fox laughed and went his own way. All winter, the fox searched for food in the frozen fields while the crow feasted on stored apples. By spring, the fox had learned that pride can be expensive.", [
        ["Theme", "What is the theme of this fable?", ["Being too proud to accept help can cost you", "Crows are smarter than foxes", "Apples are good in winter", "Maps are hard to read"], "The last sentence states the lesson.", "Pride can be expensive. What did the fox's pride make him lose?", "You're close. Fables often state their lesson at the end.", [["The choice", "The fox refused help."], ["The result", "He went hungry all winter."], ["Theme", "Pride can cost you."]], "Yes! Being too proud to accept help can cost you."],
        ["Word choice", "What does expensive mean in the last sentence?", ["It caused a big loss", "It cost a lot of money", "It was very shiny", "It was very rare"], "The fox didn't pay money. What did he lose?", "Expensive is used to describe the cost of a choice, not money.", "You're close. Think about what the fox gave up.", [["The phrase", "Pride can be expensive."], ["What he lost", "A whole winter of food."], ["Meaning", "It caused a big loss."]], "Right! His pride cost him a lot."],
      ]),
      P("r6g", "Recycling one aluminum can saves enough energy to run a TV for about three hours. Aluminum can be recycled again and again without losing quality, and a recycled can may be back on a store shelf in as little as 60 days. Yet millions of cans still end up in landfills every year.", [
        ["Author's purpose", "What is the author most likely trying to do?", ["Show why recycling cans matters", "Sell aluminum cans", "Explain how TVs work", "Tell a story about a store"], "Look at the facts the author chose and the last sentence.", "Facts about saved energy, then a problem: cans still go to landfills.", "You're close. Think about why the author ends with the landfill fact.", [["Facts", "Recycling saves energy and reuses metal."], ["Problem", "Cans still end up in landfills."], ["Purpose", "To show recycling matters."]], "Yes! The author shows why recycling matters."],
        ["Using evidence", "Which fact shows aluminum is easy to reuse?", ["It can be recycled again and again without losing quality", "Millions of cans end up in landfills", "A TV can run for three hours", "Stores sell cans"], "Look for a fact about reusing the metal.", "Which choice says something about recycling many times?", "You're close. One choice is about the problem, not reuse.", [["The claim", "Aluminum is easy to reuse."], ["Find the fact", "Recycled again and again without losing quality."], ["Evidence", "That supports the claim."]], "Right! It can be recycled again and again."],
      ]),
      P("r6h", "Rain drummed against the window as Ms. Adeyemi handed back the essays. Jordan's heart sank when he saw red ink covering his pages. Then he read the note at the bottom: \"Lots of edits because your ideas are worth making even stronger. Let's talk tomorrow.\" Jordan read it twice, then smiled for the first time all day.", [
        ["Character's feelings", "How do Jordan's feelings change?", ["From disappointed to encouraged", "From happy to angry", "From bored to sleepy", "From excited to scared"], "Compare his heart sinking with how the passage ends.", "The red ink made him sad. The note made him smile. Why?", "You're close. Track his feelings through the passage.", [["Start", "His heart sank at the red ink."], ["Turning point", "He read the encouraging note."], ["End", "He smiled. He felt encouraged."]], "Yes! From disappointed to encouraged."],
        ["Word choice", "Why does the author describe rain drumming against the window?", ["To set a gloomy mood before the good news", "To explain the weather report", "To show the school had a leak", "To show Jordan likes rain"], "Think about how the opening makes you feel.", "Rain often creates a dark mood. That matches Jordan's sinking heart at first.", "You're close. Authors use setting to create mood.", [["The detail", "Rain drumming."], ["The mood", "Gloomy, like Jordan's feeling."], ["Purpose", "It contrasts with the hopeful ending."]], "Right! It sets a gloomy mood that turns hopeful."],
      ]),
    ],
  };
  for (const g of Object.keys(MORE)) READING[g] = (READING[g] || []).concat(MORE[g]);

  function readingQuestions(grade) {
    const out = [];
    for (const p of READING[grade] || []) {
      p.qs.forEach((r, i) => {
        const [skill, prompt, ch, h1, h2, nudge, steps, right] = r;
        out.push({
          id: `${p.id}q${i + 1}`, group: p.id, skill, prompt, choices: ch.slice(), answerIndex: 0,
          hints: [h1, h2], nudge, steps: steps.map(([title, detail]) => ({ title, detail })), rightFeedback: right, passage: p.passage,
        });
      });
    }
    return out;
  }

  // ---------- science: hand-written questions, four skills per grade ----------
  // Each row: [skill, prompt, choices (the first one is right; they get shuffled), hint 1, hint 2, nudge,
  //            worked steps [title, detail], what Numi says when it's right]
  const SCIENCE_TOPICS = {
    1: "Living things, light, sound and the sky",
    2: "Matter, habitats, plants and a changing Earth",
    3: "Weather, life cycles, forces and traits",
    4: "Energy, rocks, animal bodies and waves",
    5: "Matter, food webs, the water cycle and space",
    6: "Cells, Earth's layers, weather and heat",
  };
  const SCIENCE = {
    1: [
      ["What living things need", "What do all animals need to stay alive?", ["Food, water and air", "Toys and books", "Shoes and hats", "A TV"],
        "Think about what your body needs every day.", "You eat, you drink, and you breathe. Animals do too.", "What do you do at breakfast, and what do you do all the time without thinking?",
        [["Think about your body", "Every day you eat food, drink water and breathe air."], ["Animals are the same", "Dogs, fish and birds all need food, water and air to live."]], "Yes! Food, water and air keep animals alive."],
      ["What living things need", "What does a plant need to grow?", ["Sunlight and water", "Candy and juice", "A blanket", "Darkness all the time"],
        "Plants by a sunny window grow well.", "Plants make their own food using light, and their roots drink.", "Where do plants grow best, in a dark closet or by a sunny window?",
        [["Plants use light", "Leaves use sunlight to make food for the plant."], ["Plants drink water", "Roots take in water from the soil."]], "Right! Plants need sunlight and water."],
      ["What living things need", "Which one is a living thing?", ["A tree", "A rock", "A spoon", "A cloud"],
        "Living things grow and need food or water.", "Does it grow bigger over time? A rock does not.", "Which one started small and grew?",
        [["What living things do", "Living things grow, need food or water, and make more of their own kind."], ["Check each one", "A tree grows from a seed. A rock, a spoon and a cloud do not grow like that."]], "Yes! A tree is alive. It grows and needs water."],
      ["What living things need", "Why does a bird build a nest?", ["To keep its eggs and babies safe", "To play a game", "To hide its toys", "To stay cold"],
        "Think about what is inside a nest.", "Eggs and baby birds need a safe, warm home.", "What do you usually find inside a nest?",
        [["Look inside", "Nests hold eggs and baby birds."], ["A safe home", "The nest keeps the babies safe and warm until they can fly."]], "Right! Nests keep eggs and baby birds safe."],
      ["Light and sound", "What makes a sound?", ["Something shaking back and forth", "Something sitting still", "Turning off the lights", "Closing your eyes"],
        "Touch your throat while you hum.", "You can feel your throat buzz. That buzz is shaking.", "What do you feel on a drum right after you hit it?",
        [["Feel it", "When you hum, your throat buzzes."], ["Sound is shaking", "Sounds are made when things shake back and forth very fast. Scientists call it vibrating."]], "Yes! Sound comes from things shaking, or vibrating."],
      ["Light and sound", "Why can't you see in a room with no light at all?", ["We need light to see", "Our eyes fall asleep", "The things disappear", "The room gets smaller"],
        "Think about what happens when someone turns on a lamp.", "When the light comes on, you can see again. The things never left.", "What changes when you flip on the light switch?",
        [["Things are still there", "The chair and the bed don't go anywhere in the dark."], ["Light helps us see", "Light bounces off things and into our eyes. No light means we can't see them."]], "Right! We need light to see things."],
      ["Light and sound", "Which one gives off its own light?", ["The Sun", "The Moon", "A mirror", "A window"],
        "One of these is a giant ball of hot, glowing gas.", "The Moon and a mirror only bounce light from somewhere else.", "Which one shines even when nothing else is shining on it?",
        [["Making light", "The Sun is a star. Stars make their own light."], ["Bouncing light", "The Moon, a mirror and a window do not make light. They only bounce it or let it through."]], "Yes! The Sun makes its own light."],
      ["Light and sound", "What happens when you stand in front of a lamp?", ["Your body makes a shadow", "You turn see-through", "The lamp turns off", "Nothing at all"],
        "Your body blocks some of the light.", "Where light is blocked, there is a dark shape.", "What dark shape follows you on a sunny day?",
        [["Blocking light", "Light cannot go through your body."], ["A shadow", "The dark place behind you, where the light can't reach, is your shadow."]], "Right! You block the light and make a shadow."],
      ["The sky", "When can we see the Sun in the sky?", ["In the daytime", "Only at midnight", "Never", "Only when it rains"],
        "Think about when it is bright outside.", "The Sun is what makes the day bright.", "Is it light or dark outside when you eat lunch?",
        [["Day", "During the day, our side of Earth faces the Sun."], ["Night", "At night our side faces away, so we can't see the Sun."]], "Yes! We see the Sun in the daytime."],
      ["The sky", "What can we often see in the sky at night?", ["The Moon and stars", "A rainbow", "The Sun", "Butterflies"],
        "Look up on a clear night.", "There's a big round or curved shape and lots of tiny twinkles.", "What twinkles at night?",
        [["Night sky", "When the Sun is gone, the sky is dark."], ["What we see", "On a clear night we can see the Moon and many stars."]], "Right! The Moon and stars shine at night."],
      ["The sky", "Why is it colder at night than in the day?", ["The Sun is not warming the ground", "The Moon is cold", "The stars make cold air", "Night is longer"],
        "Think about what warms you up outside.", "Sunshine warms the ground and air. At night there is no sunshine.", "What feels warm on your face on a sunny day?",
        [["Sun warms", "During the day, sunlight warms the land and air."], ["No Sun", "At night the Sun isn't shining on us, so things cool down."]], "Yes! Without the Sun's warmth it gets colder."],
      ["The sky", "The Sun seems to move across the sky each day. Where does it rise?", ["In the east", "In the north", "Under the ground", "It doesn't rise"],
        "Morning starts on one side of the sky.", "The Sun rises in the east and sets in the west.", "Which direction is 'sunrise'?",
        [["Morning", "Every morning the Sun appears on the east side of the sky."], ["Evening", "In the evening it sets on the west side."]], "Right! The Sun rises in the east."],
      ["Animal parents and babies", "How is a baby duck like its parents?", ["It has feathers and a bill", "It has fur", "It has fins", "It has wheels"],
        "Ducklings grow up to be ducks.", "Think about what grown-up ducks have on their body and face.", "What covers a duck's body?",
        [["Parents and babies", "Babies look a lot like their parents."], ["Ducks", "Ducks and ducklings both have feathers and a flat bill."]], "Yes! Ducklings have feathers and bills like their parents."],
      ["Animal parents and babies", "What does a young kangaroo ride in?", ["Its mother's pouch", "A nest in a tree", "A shell", "A cave under water"],
        "Mother kangaroos have a special pocket.", "The pocket is on the mother's belly.", "Where does a baby kangaroo, called a joey, stay safe?",
        [["A special pocket", "Mother kangaroos have a pouch on their belly."], ["Safe and warm", "The joey rides there and drinks milk while it grows."]], "Right! A joey rides in its mother's pouch."],
      ["Animal parents and babies", "Why do baby animals cry or call out?", ["To get help from their parents", "To scare the rain away", "Because they are bored", "To make the Sun rise"],
        "Think about what a hungry baby needs.", "The noise tells the parent something is needed.", "Who comes when a baby bird chirps loudly?",
        [["A signal", "Crying or chirping tells the parent the baby needs something."], ["Parents help", "The parent brings food or keeps the baby warm and safe."]], "Yes! Calling out gets the parent to help."],
      ["Animal parents and babies", "Which baby looks a lot like its parent?", ["A puppy", "A caterpillar", "A tadpole", "An egg"],
        "Some babies change a lot as they grow. Others look like small grown-ups.", "A caterpillar becomes a butterfly, and a tadpole becomes a frog.", "Which one already looks like a small dog?",
        [["Big changes", "Caterpillars and tadpoles change shape a lot as they grow."], ["Small grown-ups", "A puppy already looks like a small dog."]], "Right! A puppy looks like a small dog."],
    ],
    2: [
      ["Solids, liquids and gases", "Which one is a liquid?", ["Milk", "A brick", "A pencil", "Air"],
        "A liquid can be poured and takes the shape of its cup.", "A brick keeps its shape. Air is a gas.", "Which one can you pour into a glass?",
        [["What liquids do", "Liquids flow and take the shape of whatever holds them."], ["Check each one", "Milk pours. A brick and a pencil are solids. Air is a gas."]], "Yes! Milk is a liquid."],
      ["Solids, liquids and gases", "What happens to an ice cube left in a warm room?", ["It melts into water", "It gets bigger", "It turns into a rock", "It stays the same"],
        "Ice is frozen water.", "Warmth changes a solid into a liquid.", "What do you see in the dish after a while?",
        [["Ice is solid water", "Ice is water that got cold enough to freeze."], ["Warming melts it", "Heat turns the ice back into liquid water."]], "Right! Warmth melts ice into water."],
      ["Solids, liquids and gases", "Which one is a solid?", ["A wooden block", "Juice", "Steam", "Rain"],
        "A solid keeps its own shape.", "Juice and rain pour. Steam floats away.", "Which one stays the same shape on a table?",
        [["What solids do", "Solids keep their shape unless you break or bend them."], ["Check", "A wooden block keeps its shape. The others flow or float."]], "Yes! A wooden block is a solid."],
      ["Solids, liquids and gases", "When water in a puddle dries up on a sunny day, where does it go?", ["Into the air as water vapor", "Into outer space right away", "It turns into sand", "It hides under the puddle"],
        "The Sun warms the water.", "Warm water slowly turns into a gas you can't see.", "What is the gas form of water called?",
        [["Heat from the Sun", "Sunlight warms the puddle."], ["Evaporation", "The water turns into water vapor, a gas, and mixes into the air."]], "Right! It evaporates into the air as water vapor."],
      ["Habitats", "Which animal lives in the ocean?", ["A whale", "A camel", "A squirrel", "A cow"],
        "Think about who swims in salt water.", "A camel lives in the desert. A squirrel lives in trees.", "Which animal is the biggest swimmer?",
        [["A habitat is a home", "Animals live where they can find food, water and shelter."], ["Ocean animals", "Whales live and swim in the ocean."]], "Yes! Whales live in the ocean."],
      ["Habitats", "Why can a camel live in the desert?", ["It can go a long time without water", "It loves snow", "It breathes under water", "It eats ice"],
        "Deserts are very dry.", "A camel's body saves water and fat for long trips.", "What is hard to find in a desert?",
        [["Desert life", "Deserts get very little rain."], ["Camel bodies", "Camels can go many days without drinking, so they do well there."]], "Right! Camels can go a long time without water."],
      ["Habitats", "A polar bear has thick fur and fat. What habitat is it built for?", ["A cold, icy place", "A hot desert", "A rainforest tree", "A pond"],
        "Thick fur is like a warm coat.", "You wear a thick coat when it's freezing.", "Where would you need a big, warm coat?",
        [["Body clues", "Thick fur and fat keep an animal warm."], ["Habitat", "Polar bears live in the icy Arctic."]], "Yes! Polar bears are built for cold, icy places."],
      ["Habitats", "What does a habitat give an animal?", ["Food, water and shelter", "Money", "A bike", "A phone"],
        "Think about what an animal needs to survive.", "It needs to eat, drink and stay safe.", "What three things keep an animal alive and safe?",
        [["What animals need", "Animals need food, water and a safe place."], ["Habitat", "A good habitat has all three."]], "Right! A habitat gives food, water and shelter."],
      ["Plants and seeds", "What part of a plant takes in water from the soil?", ["The roots", "The flowers", "The leaves", "The fruit"],
        "This part is under the ground.", "It grows down into the dirt.", "Which part do you usually not see?",
        [["Under the ground", "Roots grow down into the soil."], ["Drinking water", "Roots soak up water and send it up the plant."]], "Yes! Roots take in water."],
      ["Plants and seeds", "How can seeds travel to new places?", ["Wind, water and animals carry them", "They walk on little legs", "They drive", "They never move"],
        "Think of a dandelion puff.", "Some seeds stick to fur, and some float.", "What happens when you blow on a dandelion?",
        [["Wind", "Light seeds like dandelion seeds float on the wind."], ["Animals and water", "Some seeds stick to fur or get eaten and dropped. Some float on water."]], "Right! Wind, water and animals spread seeds."],
      ["Plants and seeds", "A plant was kept in a dark closet for two weeks. What probably happened?", ["It got weak and pale", "It grew faster", "It turned bright green", "It grew flowers"],
        "Plants need light to make food.", "Without light, a plant can't make enough food.", "What do plants need from the Sun?",
        [["Plants need light", "Leaves use light to make food."], ["No light", "In the dark the plant can't make food, so it gets weak and pale."]], "Yes! Without light, the plant gets weak and pale."],
      ["Plants and seeds", "How do bees help flowers?", ["They carry pollen from flower to flower", "They water them", "They paint them", "They pull them up"],
        "Bees get a yellow dust on their bodies.", "That dust is pollen. Flowers need it to make seeds.", "What sticks to a bee's fuzzy legs?",
        [["Pollen", "Flowers make a powder called pollen."], ["Carrying it", "Bees move pollen between flowers, which helps the flowers make seeds."]], "Right! Bees carry pollen and help flowers make seeds."],
      ["A changing Earth", "Over many years, a river can make a deep canyon. How?", ["Moving water wears away rock", "The rocks melt", "Animals dig it", "The wind fills it in"],
        "Water keeps rubbing on the rock, day after day.", "Tiny bits of rock get carried away by the water.", "What does flowing water do to rock over a long time?",
        [["Wearing away", "Moving water slowly carries away tiny pieces of rock. This is called erosion."], ["Long time", "After thousands of years, the river cuts a deep canyon."]], "Yes! Moving water wears away rock."],
      ["A changing Earth", "Which change to land happens very fast?", ["An earthquake", "A canyon forming", "A mountain wearing down", "Soil forming"],
        "Some changes take thousands of years. One takes seconds.", "Shaking ground can change land in moments.", "Which one could happen while you watch?",
        [["Slow changes", "Canyons, mountains wearing down and soil forming take a very long time."], ["Fast change", "An earthquake can change the land in seconds."]], "Right! Earthquakes change land quickly."],
      ["A changing Earth", "How can planting grass on a hill help?", ["Roots hold the soil so rain won't wash it away", "It makes the hill taller", "It stops the wind forever", "It makes rocks"],
        "Grass roots grab onto the dirt.", "Rain can wash bare dirt down a hill.", "What part of the grass holds the dirt?",
        [["Bare soil", "Rain can wash loose soil down a hill."], ["Roots hold on", "Grass roots hold the soil in place."]], "Yes! Roots keep the soil from washing away."],
      ["A changing Earth", "Where is most of Earth's water?", ["In the oceans", "In ponds", "In clouds", "In puddles"],
        "Think about what covers most of a globe.", "The blue parts of a map are mostly salt water.", "What is the biggest kind of water on Earth?",
        [["Look at a globe", "Most of Earth is covered by blue water."], ["Oceans", "Most of that water is in the salty oceans."]], "Right! Most of Earth's water is in the oceans."],
    ],
    3: [
      ["Weather and climate", "What tool measures how hot or cold the air is?", ["A thermometer", "A ruler", "A scale", "A clock"],
        "'Thermo' means heat.", "This tool shows temperature in degrees.", "What do you use to check if you have a fever?",
        [["Temperature", "Hot and cold are measured as temperature."], ["The tool", "A thermometer measures temperature."]], "Yes! A thermometer measures temperature."],
      ["Weather and climate", "What is the difference between weather and climate?", ["Weather is today; climate is the usual pattern over many years", "They are the same", "Climate is only rain", "Weather only happens at night"],
        "One is about right now. The other is about many years.", "'It's raining today' is weather. 'Summers here are hot' is climate.", "Which word describes what an area is usually like?",
        [["Weather", "Weather is what the air is like at one time, like today."], ["Climate", "Climate is the usual weather in a place over many years."]], "Right! Weather is now; climate is the long-term pattern."],
      ["Weather and climate", "Which is the best way to stay safe in a thunderstorm?", ["Go inside a building", "Stand under a tall tree", "Swim in a lake", "Fly a kite"],
        "Lightning likes tall things and water.", "A building gives the safest shelter.", "Where should you go when you hear thunder?",
        [["Lightning danger", "Lightning can hit tall objects and water."], ["Stay safe", "Going inside a building is the safest choice."]], "Yes! Go inside during a thunderstorm."],
      ["Weather and climate", "A place is hot and gets lots of rain all year. What climate is it?", ["Tropical", "Polar", "Desert", "Arctic tundra"],
        "Rainforests have this climate.", "Polar and tundra places are cold. Deserts are dry.", "What climate do rainforests have?",
        [["Clues", "Hot and very rainy all year."], ["Name", "That is a tropical climate, where rainforests grow."]], "Right! That's a tropical climate."],
      ["Life cycles", "What is the right order of a butterfly's life cycle?", ["Egg, caterpillar, chrysalis, butterfly", "Butterfly, egg, chrysalis, caterpillar", "Caterpillar, egg, butterfly, chrysalis", "Chrysalis, butterfly, caterpillar, egg"],
        "Every life cycle starts with an egg.", "The caterpillar makes a chrysalis before it becomes a butterfly.", "What hatches from the egg?",
        [["Start", "A butterfly lays an egg. A caterpillar hatches."], ["Change", "The caterpillar forms a chrysalis and comes out as a butterfly."]], "Yes! Egg, caterpillar, chrysalis, butterfly."],
      ["Life cycles", "A tadpole lives in water and breathes with gills. What does it grow into?", ["A frog", "A fish", "A turtle", "A duck"],
        "This animal grows legs and loses its tail.", "It can live on land and in water when it grows up.", "Which animal says 'ribbit'?",
        [["Tadpole", "A tadpole hatches from a frog egg."], ["Growing up", "It grows legs, loses its tail, and becomes a frog."]], "Right! A tadpole grows into a frog."],
      ["Life cycles", "What do all life cycles have in common?", ["Living things are born, grow, make young and die", "They all have a chrysalis", "They all hatch from eggs", "They all live in water"],
        "Not all animals hatch from eggs, so it can't be that.", "Think about what happens to every living thing over time.", "What do a puppy and a seedling both do?",
        [["Different paths", "Some animals hatch, some are born, and plants grow from seeds."], ["Same pattern", "All are born or sprout, grow up, can make young, and die."]], "Yes! Born, grow, make young, and die."],
      ["Life cycles", "How does a sunflower start its life?", ["As a seed", "As an egg", "As a caterpillar", "As a tadpole"],
        "Plants don't hatch from eggs.", "You can plant this in soil.", "What do you put in the ground to grow a flower?",
        [["Plants start small", "Most plants start as seeds."], ["Growing", "The seed sprouts, grows into a plant, and makes flowers and new seeds."]], "Right! A sunflower starts as a seed."],
      ["Forces and magnets", "What will a magnet pick up?", ["A steel paper clip", "A wooden stick", "A plastic spoon", "A rubber band"],
        "Magnets pull on some metals.", "Wood, plastic and rubber are not pulled by magnets.", "Which one is made of metal?",
        [["Magnets", "Magnets attract iron and steel."], ["Check", "A steel paper clip sticks. Wood, plastic and rubber don't."]], "Yes! Magnets pick up steel paper clips."],
      ["Forces and magnets", "What happens when you hold the north ends of two magnets together?", ["They push apart", "They stick together", "They melt", "They turn into one magnet"],
        "Same ends act differently from opposite ends.", "Opposites attract. Same ends repel.", "Do two north ends attract or repel?",
        [["Poles", "Every magnet has a north end and a south end."], ["Same ends", "Two north ends push away from each other. That's called repelling."]], "Right! Same ends push apart."],
      ["Forces and magnets", "You push a toy car softly, then hard. What happens with the hard push?", ["It goes faster and farther", "It goes slower", "It doesn't move", "It goes backward"],
        "A push is a force.", "A bigger force makes a bigger change in motion.", "Which push sends the car farther?",
        [["Forces", "A push or a pull is a force."], ["Bigger force", "A harder push makes the car speed up more and go farther."]], "Yes! A harder push makes it go faster and farther."],
      ["Forces and magnets", "Why does a ball rolling on grass stop sooner than on a smooth floor?", ["Grass causes more friction", "Grass is magnetic", "The floor pushes it", "Balls don't like grass"],
        "Friction is a force that slows things down.", "Rough surfaces rub more than smooth ones.", "Which surface is rougher?",
        [["Friction", "Friction happens when two surfaces rub. It slows moving things."], ["Rough vs smooth", "Grass is rougher than a smooth floor, so it slows the ball faster."]], "Right! More friction on grass stops the ball sooner."],
      ["Traits and fossils", "Why do puppies often look like their parents?", ["They get traits from their parents", "They copy them", "They eat the same food", "They live in the same house"],
        "Traits like fur color are passed down.", "Babies get these traits from their mom and dad.", "What do we call features passed from parents to young?",
        [["Traits", "A trait is a feature, like fur color or ear shape."], ["Inherited", "Puppies inherit traits from their parents."]], "Yes! Puppies inherit traits from their parents."],
      ["Traits and fossils", "What is a fossil?", ["The remains or print of a living thing from long ago", "A shiny new rock", "A kind of cloud", "A plant that is alive today"],
        "Dinosaur bones are one kind.", "Fossils are often found in rock.", "What can tell us about animals from millions of years ago?",
        [["Long ago", "When some plants and animals died long ago, they were buried."], ["Turned to rock", "Over time, their shape or bones were kept in rock. These are fossils."]], "Right! Fossils are remains or prints from long ago."],
      ["Traits and fossils", "A fossil of a fish was found on a mountain. What does that tell us?", ["The area was once covered by water", "Fish can climb", "Someone dropped it", "Mountains make fish"],
        "Fish live in water.", "The land must have been very different long ago.", "Where did the fish live when it was alive?",
        [["Fish need water", "Fish can only live in water."], ["Land changes", "A fish fossil on a mountain means water once covered that land."]], "Yes! That land was once under water."],
      ["Traits and fossils", "A rabbit has white fur in winter and brown fur in summer. How does this help it?", ["It blends in and hides from predators", "It stays wet", "It runs slower", "It makes it louder"],
        "Think about the color of the ground in winter and summer.", "Snow is white. Dirt and plants in summer are brown.", "Why would matching the ground help a rabbit?",
        [["Matching", "White fur matches snow. Brown fur matches dirt and dry plants."], ["Hiding", "Blending in helps the rabbit hide from foxes and hawks. This is called camouflage."]], "Right! It blends in to hide from predators."],
    ],
    4: [
      ["Energy", "A ball is rolling down a hill. What kind of energy does a moving ball have?", ["Motion energy", "Sound energy only", "No energy", "Light energy"],
        "Anything that moves has this kind of energy.", "The faster it moves, the more it has.", "What do we call the energy of moving things?",
        [["Moving things", "Moving objects have motion energy (kinetic energy)."], ["Speed", "A faster ball has more motion energy."]], "Yes! A rolling ball has motion energy."],
      ["Energy", "What happens when you rub your hands together quickly?", ["They get warm", "They get cold", "They turn blue", "They get wet"],
        "Try it now.", "Rubbing turns motion energy into heat.", "How do your hands feel after rubbing?",
        [["Friction", "Rubbing makes friction."], ["Heat", "Friction changes motion energy into heat, so your hands warm up."]], "Right! Rubbing makes heat."],
      ["Energy", "A flashlight changes energy from its battery into what?", ["Light", "Wind", "Water", "Food"],
        "What comes out of a flashlight?", "The battery stores energy, and the bulb gives it off.", "Why do you use a flashlight in the dark?",
        [["Stored energy", "A battery stores energy."], ["Changed energy", "The flashlight changes it into light, and a little heat."]], "Yes! It changes stored energy into light."],
      ["Energy", "Which is a renewable energy source that won't run out?", ["Sunlight", "Coal", "Oil", "Natural gas"],
        "Renewable means it keeps coming back.", "Coal, oil and gas take millions of years to form.", "Which one shines every day?",
        [["Renewable", "Renewable sources are replaced naturally and quickly."], ["Check", "Sunlight returns every day. Coal, oil and gas will run out."]], "Right! Sunlight is renewable."],
      ["Rocks and erosion", "What is weathering?", ["Breaking rock into smaller pieces", "Making rain", "Building a volcano", "Melting ice"],
        "It happens to rocks over time.", "Water, ice, wind and plant roots can crack rock.", "What happens to a big rock over many years?",
        [["Breaking down", "Weathering breaks rock into smaller pieces."], ["Causes", "Water, ice, wind and plant roots all help."]], "Yes! Weathering breaks rock into smaller pieces."],
      ["Rocks and erosion", "Water gets into a crack in a rock and freezes. What happens?", ["The ice spreads and makes the crack bigger", "The rock gets smaller instantly", "The crack disappears", "The rock melts"],
        "Water takes up more space when it freezes.", "The growing ice pushes on the rock.", "What does freezing water do to a crack?",
        [["Ice expands", "Water gets bigger when it freezes."], ["Pushing", "The ice pushes the crack wider. Over and over, this breaks the rock."]], "Right! Freezing water widens cracks."],
      ["Rocks and erosion", "What is erosion?", ["Moving bits of rock and soil to a new place", "Making new rocks from nothing", "Rocks growing", "Ice turning into rock"],
        "Weathering breaks rock. Erosion moves it.", "Wind, water and ice carry the pieces.", "What do rivers do with sand and mud?",
        [["Breaking vs moving", "Weathering breaks rock; erosion carries the pieces away."], ["Carriers", "Water, wind and ice move soil and rock to new places."]], "Yes! Erosion moves rock and soil."],
      ["Rocks and erosion", "Which rock forms when lava cools?", ["Igneous rock", "Sedimentary rock", "Fossil rock", "Sand"],
        "Lava is melted rock.", "'Igneous' comes from a word for fire.", "Which rock is made from fire-hot melted rock?",
        [["Melted rock", "Lava is melted rock from a volcano."], ["Cooling", "When it cools and hardens, it becomes igneous rock."]], "Right! Cooled lava makes igneous rock."],
      ["Animal bodies and senses", "Why does an owl have big eyes?", ["To see in the dark when it hunts at night", "To look pretty", "To swim", "To stay cool"],
        "Owls are awake at night.", "Big eyes let in more light.", "When do owls hunt?",
        [["Night hunters", "Most owls hunt at night."], ["Big eyes", "Big eyes collect more light, so owls see well in the dark."]], "Yes! Big eyes help owls see at night."],
      ["Animal bodies and senses", "How does a fish breathe under water?", ["With gills", "With lungs", "Through its tail", "It doesn't breathe"],
        "Fish don't come up for air like whales.", "This body part takes oxygen out of water.", "What are the slits on the sides of a fish's head?",
        [["Oxygen", "Fish need oxygen, which is in the water."], ["Gills", "Gills take oxygen from the water as it passes through."]], "Right! Fish breathe with gills."],
      ["Animal bodies and senses", "What part of your body sends messages to your brain about what you touch?", ["Nerves", "Hair", "Fingernails", "Teeth"],
        "These are like tiny wires in your body.", "They carry signals from your skin to your brain.", "What carries messages through your body?",
        [["Sensing touch", "Your skin senses touch."], ["Messages", "Nerves carry that message to your brain."]], "Yes! Nerves carry messages to your brain."],
      ["Animal bodies and senses", "A cactus has thick stems and sharp spines. How do these help it?", ["Store water and keep animals away", "Help it swim", "Make it grow fast in snow", "Help it fly"],
        "Cactuses live in dry deserts.", "Thick stems hold water. Spines poke.", "Why would a plant in a desert need to save water?",
        [["Thick stems", "The stem stores water for dry times."], ["Spines", "Sharp spines keep thirsty animals from eating it."]], "Right! They store water and protect the plant."],
      ["Waves", "What do sound waves need to travel through?", ["Matter like air, water or solids", "Empty space", "Only light", "Nothing"],
        "In space there is no air.", "Sound travels by making things vibrate.", "Can astronauts hear each other in space without radios?",
        [["Vibrations", "Sound is vibrations passing from particle to particle."], ["Needs matter", "Sound needs air, water or a solid. It can't travel through empty space."]], "Yes! Sound needs matter to travel."],
      ["Waves", "Why do you see lightning before you hear thunder?", ["Light travels faster than sound", "Sound travels faster than light", "Thunder happens later", "Your ears are slow"],
        "Both happen at the same moment.", "One kind of wave is much faster.", "Which is faster, light or sound?",
        [["Same time", "Lightning and thunder happen together."], ["Speed", "Light travels much faster than sound, so you see it first."]], "Right! Light is faster than sound."],
      ["Waves", "What happens to light when it hits a mirror?", ["It bounces off (reflects)", "It disappears", "It turns into sound", "It stops"],
        "You can see yourself in a mirror.", "Light comes back toward your eyes.", "What is it called when light bounces?",
        [["Hitting a mirror", "Light hits the smooth, shiny surface."], ["Reflection", "It bounces back. That's reflection."]], "Yes! Light reflects off a mirror."],
      ["Waves", "A water wave moves across a pond. A floating leaf bobs up and down. What does this show?", ["Waves move energy, not the water itself", "The leaf is swimming", "The pond is tilted", "Waves move the whole pond"],
        "The leaf stays in about the same spot.", "The wave passes by, but the water mostly moves up and down.", "Does the leaf travel across the pond?",
        [["The leaf", "The leaf bobs up and down but stays in place."], ["Energy", "Waves carry energy across the water while the water mostly stays put."]], "Right! Waves carry energy."],
    ],
    5: [
      ["Matter and mixtures", "You stir salt into water until you can't see it. What happened?", ["The salt dissolved", "The salt disappeared forever", "The salt turned into water", "The water turned into salt"],
        "The salt is still there.", "Taste it, and it's salty. The salt mixed in tiny pieces.", "If the water dried up, what would be left?",
        [["Mixing", "Salt breaks into tiny pieces in the water."], ["Dissolving", "It dissolved. If the water evaporates, the salt is left behind."]], "Yes! The salt dissolved."],
      ["Matter and mixtures", "Which is a physical change?", ["Cutting paper", "Burning wood", "Baking a cake", "Rusting iron"],
        "A physical change doesn't make a new substance.", "Burning, baking and rusting make new substances.", "After the change, is it still paper?",
        [["Physical change", "Only size, shape or state changes."], ["Check", "Cut paper is still paper. Burning, baking and rusting make something new."]], "Right! Cutting paper is a physical change."],
      ["Matter and mixtures", "How could you separate iron filings from sand?", ["Use a magnet", "Add water and freeze it", "Shake it", "Heat it up"],
        "Iron has a special property sand doesn't.", "Magnets pull on iron.", "Which tool attracts iron?",
        [["Properties", "Iron is magnetic. Sand is not."], ["Separate", "A magnet pulls out the iron and leaves the sand."]], "Yes! A magnet separates iron from sand."],
      ["Matter and mixtures", "When 50 grams of water and 10 grams of sugar are mixed, how much does the mixture weigh?", ["60 grams", "50 grams", "40 grams", "10 grams"],
        "Matter is not lost when things mix.", "Add the two amounts together.", "What is 50 + 10?",
        [["Matter is conserved", "When things mix, the total amount of matter stays the same."], ["Add", "50 grams + 10 grams = 60 grams."]], "Right! 60 grams. Matter isn't lost."],
      ["Food webs", "In a food chain, where do plants get their energy?", ["From sunlight", "From eating animals", "From rocks", "From the Moon"],
        "Plants make their own food.", "They use light to do it.", "What shines on leaves?",
        [["Producers", "Plants are producers. They make their own food."], ["Sunlight", "They use energy from sunlight to make sugar."]], "Yes! Plants get energy from sunlight."],
      ["Food webs", "In this food chain, grass → rabbit → fox, what is the rabbit?", ["A consumer that eats plants", "A producer", "A decomposer", "The Sun"],
        "The rabbit eats the grass.", "Animals that eat other living things are consumers.", "Does the rabbit make its own food?",
        [["Producer", "Grass makes its own food."], ["Consumer", "The rabbit eats grass, so it is a consumer (an herbivore)."]], "Right! The rabbit is a plant-eating consumer."],
      ["Food webs", "What do decomposers like mushrooms and worms do?", ["Break down dead things and return nutrients to the soil", "Make food from sunlight", "Hunt foxes", "Make rain"],
        "They are nature's recyclers.", "They feed on dead plants and animals.", "What happens to fallen leaves over time?",
        [["Dead matter", "Decomposers eat dead plants and animals."], ["Recycling", "They break it down into nutrients that go back into the soil for plants."]], "Yes! Decomposers recycle nutrients."],
      ["Food webs", "If all the rabbits in a field disappeared, what would probably happen to the foxes that eat them?", ["They would have less food", "They would have more food", "Nothing would change", "They would eat grass"],
        "Foxes depend on rabbits.", "Fewer rabbits means fewer meals.", "What would the foxes eat?",
        [["Connections", "In a food web, animals depend on what they eat."], ["Less food", "Without rabbits, foxes have less food, so there might be fewer foxes."]], "Right! The foxes would have less food."],
      ["The water cycle", "What is it called when water vapor cools and forms tiny drops in clouds?", ["Condensation", "Evaporation", "Erosion", "Melting"],
        "It's the opposite of evaporation.", "Think of drops on a cold glass of lemonade.", "What forms on the outside of a cold cup?",
        [["Cooling vapor", "Water vapor cools high in the sky."], ["Condensation", "It turns back into tiny liquid drops. That's condensation, and the drops form clouds."]], "Yes! That's condensation."],
      ["The water cycle", "What powers the water cycle?", ["The Sun", "The Moon", "Wind turbines", "Fish"],
        "Something has to heat water to make it evaporate.", "It's the biggest source of heat for Earth.", "What warms oceans and lakes?",
        [["Evaporation needs heat", "Water evaporates when it's warmed."], ["Sun", "The Sun's heat drives evaporation, which keeps the water cycle going."]], "Right! The Sun powers the water cycle."],
      ["The water cycle", "Rain, snow, sleet and hail are all kinds of what?", ["Precipitation", "Evaporation", "Condensation", "Collection"],
        "These all fall from clouds.", "The word starts with 'pre'.", "What do we call water falling from the sky?",
        [["Falling water", "When drops in clouds get heavy, they fall."], ["Precipitation", "Rain, snow, sleet and hail are precipitation."]], "Yes! They're all precipitation."],
      ["The water cycle", "Where does most of the water that evaporates come from?", ["The oceans", "Puddles", "Snowmen", "Bathtubs"],
        "It's where most of Earth's water is.", "Oceans cover most of Earth.", "What is the biggest body of water?",
        [["Most water", "About 97% of Earth's water is in the oceans."], ["Evaporation", "So most evaporation happens from the ocean surface."]], "Right! Most comes from the oceans."],
      ["The Sun, Moon and stars", "Why does the Sun look bigger and brighter than other stars?", ["It is much closer to Earth", "It is the biggest star", "Other stars are turned off", "It is a planet"],
        "The Sun is a fairly average star.", "Other stars are extremely far away.", "Do things look bigger when they're near or far?",
        [["Average star", "The Sun is a medium-sized star."], ["Distance", "It's much closer than any other star, so it looks bigger and brighter."]], "Yes! It's much closer."],
      ["The Sun, Moon and stars", "What causes day and night?", ["Earth spinning on its axis", "The Sun moving around Earth", "The Moon blocking the Sun", "Clouds"],
        "Earth turns all the way around once a day.", "When your side faces the Sun, it's day.", "How long does Earth take to spin once?",
        [["Spinning", "Earth spins once about every 24 hours."], ["Day and night", "The side facing the Sun has day. The side facing away has night."]], "Right! Earth's spinning causes day and night."],
      ["The Sun, Moon and stars", "At noon your shadow is short. Late in the afternoon it is long. Why?", ["The Sun is lower in the sky", "You grew taller", "The Sun got bigger", "The ground moved"],
        "Shadows depend on where the light comes from.", "Low light makes long shadows.", "Where is the Sun at noon compared to late afternoon?",
        [["High Sun", "At noon the Sun is high, so shadows are short."], ["Low Sun", "Later the Sun is low in the sky, so shadows stretch long."]], "Yes! A lower Sun makes longer shadows."],
      ["The Sun, Moon and stars", "Why does the Moon seem to change shape during a month?", ["We see different amounts of its sunlit side", "It really changes shape", "Earth's shadow eats it", "Clouds cover parts"],
        "The Moon is always round.", "Half the Moon is always lit by the Sun. We see different parts of that half.", "What do we call the Moon's changing shapes?",
        [["Lit half", "The Sun always lights half of the Moon."], ["Phases", "As the Moon orbits Earth, we see more or less of the lit half. These are phases."]], "Right! We see different amounts of the lit side."],
    ],
    6: [
      ["Cells", "What is the basic unit of all living things?", ["The cell", "The atom", "The organ", "The skeleton"],
        "All living things are made of these.", "You need a microscope to see most of them.", "What are tiny building blocks of life?",
        [["Building blocks", "Every living thing is made of one or more cells."], ["Basic unit", "The cell is the smallest unit that is alive."]], "Yes! The cell is the basic unit of life."],
      ["Cells", "Which part of a plant cell makes food using sunlight?", ["Chloroplast", "Nucleus", "Cell membrane", "Vacuole"],
        "This part is green.", "It's where photosynthesis happens.", "Which part holds chlorophyll?",
        [["Photosynthesis", "Plants make sugar from sunlight, water and carbon dioxide."], ["Chloroplast", "This happens in the green chloroplasts."]], "Right! Chloroplasts make food."],
      ["Cells", "What does the nucleus of a cell do?", ["Controls the cell and holds its DNA", "Makes food from light", "Lets water in and out", "Gives the cell its green color"],
        "It's like the control center.", "It stores the cell's instructions.", "Where is DNA kept in animal and plant cells?",
        [["Control center", "The nucleus directs what the cell does."], ["DNA", "It holds DNA, the cell's instructions."]], "Yes! The nucleus controls the cell."],
      ["Cells", "Which is found in plant cells but not animal cells?", ["A cell wall", "A nucleus", "A cell membrane", "Cytoplasm"],
        "Plants stand up stiffly without bones.", "This tough outer layer gives support.", "What makes plant cells stiff?",
        [["Both have", "Plant and animal cells both have a nucleus, membrane and cytoplasm."], ["Plants only", "Plant cells also have a stiff cell wall."]], "Right! Cell walls are in plant cells."],
      ["Earth's layers and plates", "What is the outermost layer of Earth called?", ["The crust", "The core", "The mantle", "The magma"],
        "It's the layer we live on.", "It's thin compared to the others, like the skin of an apple.", "What layer has land and ocean floor?",
        [["Layers", "Earth has a crust, mantle, outer core and inner core."], ["Outside", "The crust is the thin outer layer."]], "Yes! The crust is the outer layer."],
      ["Earth's layers and plates", "What causes most earthquakes?", ["Tectonic plates moving and slipping", "Heavy rain", "The Moon's light", "Animals digging"],
        "Earth's crust is broken into huge pieces.", "These pieces grind and slip past each other.", "What are the giant moving pieces of crust called?",
        [["Plates", "The crust is made of big tectonic plates."], ["Slipping", "When plates suddenly slip, the ground shakes."]], "Right! Moving plates cause most earthquakes."],
      ["Earth's layers and plates", "Many volcanoes are found where?", ["Along the edges of tectonic plates", "In the middle of every desert", "Only at the North Pole", "Under every city"],
        "Think of the 'Ring of Fire' around the Pacific Ocean.", "Magma rises where plates meet or pull apart.", "Where do plates meet?",
        [["Plate edges", "Plates meet or pull apart at their edges."], ["Magma", "Magma can rise up there and form volcanoes."]], "Yes! Most volcanoes are at plate edges."],
      ["Earth's layers and plates", "Africa and South America look like they could fit together like puzzle pieces. What explains this?", ["They were once joined and drifted apart", "Someone carved them", "It's just a coincidence", "Oceans shaped them that way last year"],
        "Matching fossils are found on both coasts.", "Continents move very slowly over millions of years.", "What is the idea that continents move called?",
        [["Clues", "Their coastlines match, and the same fossils are found on both."], ["Continental drift", "They were once joined and slowly drifted apart."]], "Right! They were once joined."],
      ["Weather and the atmosphere", "What tool measures air pressure?", ["A barometer", "A thermometer", "A rain gauge", "An anemometer"],
        "'Baro' means weight or pressure.", "Falling pressure often means a storm is coming.", "Which tool helps forecasters watch for storms?",
        [["Air pressure", "Air pushes on everything. That push is air pressure."], ["Tool", "A barometer measures air pressure."]], "Yes! A barometer measures air pressure."],
      ["Weather and the atmosphere", "Why does warm air rise?", ["It is less dense than cool air", "It is heavier", "It is pulled by the Moon", "Warm air is magnetic"],
        "Warm air particles spread out.", "Spread-out air is lighter for its size.", "Why does a hot-air balloon float?",
        [["Spreading out", "Heating makes air particles move faster and spread apart."], ["Less dense", "The warm air is less dense, so cooler air sinks and pushes it up."]], "Right! Warm air is less dense, so it rises."],
      ["Weather and the atmosphere", "What usually happens when a cold front moves in?", ["Storms, then cooler weather", "It gets much hotter", "The air stops moving", "Snow turns to sand"],
        "A cold front is cold air pushing into warm air.", "The warm air is forced up quickly, which forms storm clouds.", "What is the weather like after the front passes?",
        [["Pushing warm air up", "Cold air shoves warm, moist air upward fast."], ["Result", "That can bring storms, and then cooler, drier weather."]], "Yes! Storms, then cooler weather."],
      ["Weather and the atmosphere", "Which gas makes up most of the air we breathe?", ["Nitrogen", "Oxygen", "Carbon dioxide", "Helium"],
        "It's not the one we need to breathe.", "About 78% of air is this gas.", "Which gas is most common in air?",
        [["Air mix", "Air is a mix of gases."], ["Most of it", "About 78% is nitrogen and about 21% is oxygen."]], "Right! Most of the air is nitrogen."],
      ["Heat and energy transfer", "A metal spoon in hot soup gets hot. How does the heat travel?", ["Conduction", "Convection", "Radiation", "Evaporation"],
        "The heat moves through the spoon by touching.", "Heat passes from particle to particle in a solid.", "What's heat transfer by direct contact called?",
        [["Touching", "The hot soup touches the spoon."], ["Conduction", "Heat moves through the metal particle by particle. That is conduction."]], "Yes! That's conduction."],
      ["Heat and energy transfer", "How does the Sun's heat reach Earth through space?", ["Radiation", "Conduction", "Convection", "Wind"],
        "Space is almost empty, so there's nothing to touch.", "This kind of heat travels as waves.", "How do you feel warmth from a campfire without touching it?",
        [["Empty space", "Conduction and convection need matter."], ["Radiation", "The Sun's energy travels as waves through space. That is radiation."]], "Right! Radiation carries the Sun's heat."],
      ["Heat and energy transfer", "Why do pots often have plastic or wooden handles?", ["Those materials are insulators and don't get hot fast", "They are shinier", "They conduct heat well", "They are magnetic"],
        "Metal gets hot fast.", "Some materials slow down heat flow.", "What's a material called that slows heat?",
        [["Conductors", "Metals let heat move through them quickly."], ["Insulators", "Plastic and wood slow heat down, so the handle stays cooler."]], "Yes! They're insulators."],
      ["Heat and energy transfer", "In a pot of boiling water, hot water rises and cooler water sinks. What is this called?", ["Convection", "Conduction", "Radiation", "Reflection"],
        "This happens in liquids and gases.", "It makes a loop, like a current.", "What is heat moving with flowing liquid or gas called?",
        [["Moving liquid", "Warm water rises; cool water sinks."], ["Convection", "This circle of moving water carries heat. That's convection."]], "Right! That's convection."],
    ],
  };

  function scienceQuestions(grade) {
    return (SCIENCE[grade] || []).map((r, i) => {
      const [skill, prompt, ch, h1, h2, nudge, steps, right] = r;
      return { id: `s${grade}q${i + 1}`, skill, prompt, choices: ch.slice(), answerIndex: 0,
        hints: [h1, h2], nudge, steps: steps.map(([title, detail]) => ({ title, detail })), rightFeedback: right };
    });
  }

  // ---------- remembering what this device has seen ----------
  const SEEN_KEY = "numbernest-seen-v1";
  function loadSeen() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveSeen(seen) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* storage may be blocked */ }
  }

  function shuffleChoices(item) {
    const right = item.choices[item.answerIndex];
    const order = shuffle(item.choices.map((c, i) => i));
    const ch = order.map((i) => item.choices[i]);
    return Object.assign({}, item, { choices: ch, answerIndex: ch.indexOf(right) });
  }

  // ---------- build one practice session ----------
  function session(subject, grade, deck) {
    try {
      const key = `${subject}-${grade}`;
      const seen = loadSeen();
      const seenList = seen[key] || [];
      let questions;
      let topic = deck.topic;

      if (subject === "science" && SCIENCE[grade]) {
        // Up to 10 science questions: ones this device hasn't seen yet first, then the ones seen longest ago,
        // in an order that never asks the same skill twice in a row.
        topic = SCIENCE_TOPICS[grade];
        const LEN = 10;
        const pool = scienceQuestions(grade);
        const unseen = shuffle(pool.filter((x) => !seenList.includes(x.id)));
        const old = seenList.map((id) => pool.find((x) => x.id === id)).filter(Boolean);
        const items = unseen.concat(old).slice(0, LEN);
        const ok = (list) => list.every((x, i) => i === 0 || x.skill !== list[i - 1].skill);
        questions = items;
        for (let tries = 0; tries < 200 && !ok(questions); tries++) questions = shuffle(items);
        seen[key] = seenList.filter((id) => !items.some((x) => x.id === id)).concat(items.map((x) => x.id));
      } else if (subject === "math" && MATH[grade]) {
        topic = MATH_TOPICS[grade];
        // Up to 10 questions: every kind of problem twice with new numbers, in a mixed order,
        // never the same kind twice in a row. One may be swapped for a hand-written question.
        const LEN = 10;
        let items = [];
        while (items.length < LEN) for (const g of shuffle(MATH[grade])) if (items.length < LEN) items.push(g());
        const ok = (list) => list.every((x, i) => i === 0 || x.skill !== list[i - 1].skill);
        questions = items;
        for (let tries = 0; tries < 200 && !ok(questions); tries++) questions = shuffle(items);
        const fresh = deck.questions.filter((x) => !seenList.includes(x.id));
        const base = pick(fresh.length ? fresh : deck.questions);
        const slot = questions.findIndex((x) => x.skill === base.skill);
        questions[slot >= 0 ? slot : rnd(0, LEN - 1)] = base;
        seen[key] = fresh.length ? seenList.concat([base.id]) : [base.id];
      } else {
        // Reading: whole passages the student hasn't seen yet, then fall back to the oldest.
        const pool = deck.questions.map((x) => Object.assign({ group: "base-" + x.passage.slice(0, 20) }, x)).concat(readingQuestions(grade));
        const groups = [];
        for (const item of pool) {
          let g = groups.find((x) => x.id === item.group);
          if (!g) groups.push((g = { id: item.group, items: [] }));
          g.items.push(item);
        }
        // Passages not read yet come first, then the ones read longest ago.
        const unseen = shuffle(groups.filter((g) => !seenList.includes(g.id)))
          .concat(seenList.map((id, i) => ({ g: groups.find((x) => x.id === id), k: i + Math.random() * 4 }))
            .filter((x) => x.g).sort((x, y) => x.k - y.k).map((x) => x.g));
        // Up to 10 questions from passages the student hasn't read yet.
        const chosen = [];
        questions = [];
        for (const g of unseen) {
          if (questions.length + g.items.length > 10) continue;
          chosen.push(g);
          questions.push(...g.items);
          if (questions.length >= 8) break;
        }
        // Mix up the passage order, keeping each passage's questions together.
        questions = shuffle(chosen).flatMap((g) => g.items);
        seen[key] = seenList.filter((id) => !chosen.some((g) => g.id === id)).concat(chosen.map((g) => g.id));
      }

      saveSeen(seen);
      return { topic, questions: questions.map(shuffleChoices) };
    } catch (err) {
      return deck;
    }
  }

  // ---------- results: the completed screen and the grown-up report ----------
  // Results stay on this device only (browser storage). Nothing is sent anywhere.
  const HISTORY_KEY = "numbernest-history-v1";
  let round = { subject: "math", grade: 4, items: [], startedAt: Date.now() };

  // Called by the tutor screen each time a question is finished.
  // result: "first" (right on the first try), "helped" (right after hints or a wrong pick), "shown" (solution shown).
  function record(question, info) {
    if (info.index === 0 || round.subject !== info.subject || round.grade !== info.grade) {
      round = { subject: info.subject, grade: info.grade, items: [], startedAt: Date.now() - 60000 };
    }
    round.items = round.items.filter((x) => x.index !== info.index);
    round.items.push({
      index: info.index,
      skill: question.skill,
      prompt: question.prompt,
      answer: question.choices[question.answerIndex],
      wrong: info.wrong || [],
      hints: info.hints || 0,
      result: info.result,
    });
  }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveRound(summary) {
    try {
      const list = loadHistory();
      list.unshift(summary);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
    } catch (e) { /* storage may be blocked */ }
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const subjName = (s) => (s === "reading" ? "Reading" : s === "science" ? "Science" : "Math");
  const RESULT_LABEL = { first: "Right on the first try", helped: "Right with a hint", shown: "Needed the full solution" };

  function css() {
    if (document.getElementById("nn-done-css")) return;
    const st = document.createElement("style");
    st.id = "nn-done-css";
    st.textContent = `
      .nn-overlay{position:fixed;inset:0;z-index:9999;overflow-y:auto;background:linear-gradient(180deg,#dbe9ff 0%,#efe4ff 55%,#d9f2df 100%);
        font-family:Nunito,ui-rounded,'Segoe UI Variable Display','Segoe UI',system-ui,-apple-system,sans-serif;color:#241f4a;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
      .nn-card{max-width:680px;margin:24px auto;background:#fff;border-radius:28px;padding:28px 24px;box-shadow:0 20px 50px -24px rgba(60,40,140,.45)}
      .nn-center{text-align:center}
      .nn-owl{width:96px;height:96px;margin:0 auto 8px;display:block}
      .nn-h1{font-size:clamp(26px,6vw,36px);font-weight:800;margin:6px 0 4px;line-height:1.15}
      .nn-sub{color:#5b5687;font-size:17px;margin:0 0 18px}
      .nn-stars{font-size:52px;letter-spacing:6px;margin:6px 0 10px}
      .nn-stars .off{filter:grayscale(1);opacity:.3}
      .nn-score{font-size:22px;font-weight:800;margin:4px 0 18px}
      .nn-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0 18px}
      .nn-tile{border-radius:18px;padding:14px 10px;text-align:center;background:#f4f1ff}
      .nn-tile b{display:block;font-size:28px;font-weight:800;font-variant-numeric:tabular-nums}
      .nn-tile span{font-size:13px;color:#5b5687;font-weight:600}
      .nn-tile.first{background:#e3f7e9}.nn-tile.helped{background:#fff4d6}.nn-tile.shown{background:#ffe6ea}
      .nn-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:14px}
      .nn-btn{appearance:none;border:0;border-radius:16px;padding:14px 20px;font-family:inherit;font-weight:800;font-size:16px;cursor:pointer;background:#6c5ce7;color:#fff;min-height:48px}
      .nn-btn.alt{background:#fff4d6;color:#7a5200}.nn-btn.ghost{background:#f1effa;color:#3b3570}
      .nn-btn:focus-visible,.nn-input:focus-visible{outline:3px solid #2f80ed;outline-offset:2px}
      .nn-input{font:inherit;font-size:24px;font-weight:800;text-align:center;width:140px;padding:10px;border-radius:14px;border:2px solid #cfc8f5;margin:8px 0}
      .nn-msg{min-height:22px;color:#c0392b;font-weight:700}
      .nn-h2{font-size:18px;font-weight:800;margin:22px 0 8px}
      .nn-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
      .nn-row{border:1px solid #ebe7fb;border-radius:16px;padding:12px 14px}
      .nn-row .top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;flex-wrap:wrap}
      .nn-row .q{font-weight:700;overflow-wrap:anywhere}
      .nn-row .meta{font-size:14px;color:#5b5687;margin-top:4px;overflow-wrap:anywhere}
      .nn-chip{font-size:12px;font-weight:800;border-radius:999px;padding:4px 10px;white-space:nowrap}
      .nn-chip.first{background:#e3f7e9;color:#1d6b3a}.nn-chip.helped{background:#fff4d6;color:#7a5200}.nn-chip.shown{background:#ffe6ea;color:#9b1c33}
      .nn-chip.strong{background:#e3f7e9;color:#1d6b3a}.nn-chip.close{background:#fff4d6;color:#7a5200}.nn-chip.practice{background:#ffe6ea;color:#9b1c33}
      .nn-note{background:#f4f1ff;border-radius:16px;padding:14px 16px;line-height:1.5}
      .nn-small{font-size:13px;color:#6b6795}
      .nn-next{border-radius:20px;padding:16px 16px 18px;margin:4px 0 18px;background:#f4f1ff}
      .nn-next.up{background:#e3f7e9}.nn-next.again{background:#fff4d6}
      .nn-next-title{font-size:20px;font-weight:800;margin:0;line-height:1.3}
      .nn-next-text{color:#5b5687;font-size:16px;margin:6px 0 0}
      .nn-next .nn-btns{margin-top:12px}
      .nn-btn.go{background:#1f8a4c}.nn-btn.redo{background:#b86e00}
      @media (max-width:480px){.nn-tiles{grid-template-columns:1fr}.nn-card{padding:22px 16px}}
      @media (prefers-reduced-motion:no-preference){.nn-pop{animation:nnpop .5s ease-out both}@keyframes nnpop{from{transform:scale(.85);opacity:0}to{transform:none;opacity:1}}}
    `;
    document.head.appendChild(st);
  }

  const OWL = `<svg class="nn-owl" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="56" r="38" fill="#8f7cf0"/><path d="M22 34 Q18 14 28 10 Q34 20 40 28Z M78 34 Q82 14 72 10 Q66 20 60 28Z" fill="#8f7cf0"/><circle cx="38" cy="50" r="13" fill="#fff"/><circle cx="62" cy="50" r="13" fill="#fff"/><circle cx="38" cy="51" r="6" fill="#241f4a"/><circle cx="62" cy="51" r="6" fill="#241f4a"/><path d="M45 62 L55 62 L50 70Z" fill="#ffb02e"/><ellipse cx="50" cy="80" rx="18" ry="10" fill="#c9bff9"/></svg>`;

  function summarize() {
    const items = round.items.slice().sort((a, b) => a.index - b.index);
    const count = (r) => items.filter((x) => x.result === r).length;
    const skills = {};
    for (const it of items) {
      const s = (skills[it.skill] = skills[it.skill] || { skill: it.skill, total: 0, first: 0, helped: 0, shown: 0 });
      s.total++; s[it.result]++;
    }
    return {
      when: new Date().toISOString(),
      subject: round.subject, grade: round.grade,
      minutes: Math.max(1, Math.round((Date.now() - round.startedAt) / 60000)),
      total: items.length, first: count("first"), helped: count("helped"), shown: count("shown"),
      skills: Object.values(skills), items,
    };
  }

  function overlay(html) {
    css();
    let el = document.getElementById("nn-done");
    if (!el) {
      el = document.createElement("div");
      el.id = "nn-done";
      el.className = "nn-overlay";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      document.body.appendChild(el);
    }
    el.innerHTML = html;
    el.scrollTop = 0;
    const focus = el.querySelector("[data-focus]") || el.querySelector("button");
    if (focus) focus.focus();
    return el;
  }

  function newRound() { window.location.reload(); }
  // Close the completed screen if the app moves to another page (for example with the back button).
  window.addEventListener("hashchange", () => { const el = document.getElementById("nn-done"); if (el) el.remove(); });
  const TOP_GRADE = 6;
  // Start a fresh round of the given subject and grade (the app keeps them in the #/tutor link).
  function playGrade(subject, grade) {
    window.location.hash = `#/tutor?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade)}`;
    window.location.reload();
  }

  // A friendly next step for the completed screen, based on the score.
  // 9 or 10 out of 10: try the next grade up. Below 6: play this grade again. 6 to 8: encouragement.
  // (Rounds are usually 10 questions; shorter rounds use the same 90% and 60% lines.)
  function suggestion(s) {
    const right = s.first + s.helped;
    const grade = Number(s.grade);
    const subj = subjName(s.subject).toLowerCase();
    if (right >= s.total * 0.9) {
      if (grade < TOP_GRADE) {
        return { kind: "up", title: "Ready for the next level? 🚀", text: `You know grade ${grade} ${subj} really well.`,
          button: `Try grade ${grade + 1}`, grade: grade + 1 };
      }
      return { kind: "up", title: "You're a top-level star! 🏆", text: `Grade ${grade} is the highest level. Keep your skills sharp!` };
    }
    if (right < s.total * 0.6) {
      return { kind: "again", title: "Let's practice this level again 💪", text: "Every round makes your brain stronger.",
        button: `Play grade ${grade} again`, grade };
    }
    return { kind: "keep", title: "You're getting stronger! 🌱", text: "Keep practicing and you'll be ready for the next level soon." };
  }
  function goHome() { window.location.href = new URL("./", window.location.href).href; }

  // The child's "You did it!" screen.
  function finish(skipSave) {
    const s = summarize();
    if (!s.total) return newRound();
    if (skipSave !== true) saveRound({ when: s.when, subject: s.subject, grade: s.grade, total: s.total, first: s.first, helped: s.helped, shown: s.shown, minutes: s.minutes,
      skills: s.skills.map((k) => ({ skill: k.skill, total: k.total, right: k.first + k.helped, first: k.first })) });
    const right = s.first + s.helped;
    const stars = right >= s.total * 0.9 ? 3 : right >= s.total * 0.6 ? 2 : 1;
    const cheer = stars === 3 ? "Amazing work!" : stars === 2 ? "Great job!" : "You finished! Way to keep going!";
    const next = suggestion(s);
    const el = overlay(`
      <div class="nn-card nn-center nn-pop">
        ${OWL}
        <p class="nn-sub" style="margin:0">Grade ${s.grade} ${subjName(s.subject).toLowerCase()} · round complete</p>
        <h1 class="nn-h1">${cheer}</h1>
        <div class="nn-stars" aria-label="${stars} of 3 stars">${[1, 2, 3].map((i) => `<span class="${i <= stars ? "" : "off"}">⭐</span>`).join("")}</div>
        <p class="nn-score">You got ${right} out of ${s.total}!</p>
        <div class="nn-tiles">
          <div class="nn-tile first"><b>${s.first}</b><span>First try</span></div>
          <div class="nn-tile helped"><b>${s.helped}</b><span>With a hint</span></div>
          <div class="nn-tile shown"><b>${s.shown}</b><span>Learned the steps</span></div>
        </div>
        <div class="nn-next ${next.kind}" data-next="${next.kind}">
          <p class="nn-next-title">${next.title}</p>
          <p class="nn-next-text">${esc(next.text)}</p>
          ${next.button ? `<div class="nn-btns"><button class="nn-btn ${next.kind === "up" ? "go" : "redo"}" data-act="next">${esc(next.button)}</button></div>` : ""}
        </div>
        <p class="nn-sub">Show a grown-up how you did!</p>
        <div class="nn-btns">
          <button class="nn-btn alt" data-act="grownup" data-focus>Show a grown-up</button>
          <button class="nn-btn" data-act="again">Practice more</button>
          <button class="nn-btn ghost" data-act="home">Home</button>
        </div>
      </div>`);
    el.querySelector('[data-act="grownup"]').onclick = () => gate(s);
    el.querySelector('[data-act="again"]').onclick = newRound;
    el.querySelector('[data-act="home"]').onclick = goHome;
    const nextBtn = el.querySelector('[data-act="next"]');
    if (nextBtn) nextBtn.onclick = () => playGrade(s.subject, next.grade);
  }

  // A quick grown-ups question before the report, like the parent view.
  function gate(s) {
    const a = rnd(6, 12), b = rnd(3, 9);
    const el = overlay(`
      <div class="nn-card nn-center">
        ${OWL}
        <h1 class="nn-h1">Grown-ups only</h1>
        <p class="nn-sub">Answer this to see the full report.</p>
        <form id="nn-gate">
          <label for="nn-gate-in" style="font-size:24px;font-weight:800">What is ${a} × ${b}?</label><br>
          <input id="nn-gate-in" class="nn-input" inputmode="numeric" autocomplete="off" data-focus>
          <p class="nn-msg" id="nn-gate-msg" role="status"></p>
          <div class="nn-btns">
            <button class="nn-btn" type="submit">Open report</button>
            <button class="nn-btn ghost" type="button" data-act="back">Back</button>
          </div>
        </form>
      </div>`);
    el.querySelector("#nn-gate").onsubmit = (e) => {
      e.preventDefault();
      if (Number(el.querySelector("#nn-gate-in").value) === a * b) report(s);
      else el.querySelector("#nn-gate-msg").textContent = "That's not it. Try again.";
    };
    el.querySelector('[data-act="back"]').onclick = () => finish(true);
  }

  // The grown-up report for this round.
  function report(s) {
    const when = new Date(s.when).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const level = (k) => (k.shown === 0 && k.helped === 0 ? ["strong", "Strong"] : k.shown === 0 ? ["close", "Getting there"] : ["practice", "Needs practice"]);
    const practice = s.skills.filter((k) => k.shown > 0).map((k) => k.skill);
    const close = s.skills.filter((k) => k.shown === 0 && k.helped > 0).map((k) => k.skill);
    const strong = s.skills.filter((k) => k.shown === 0 && k.helped === 0).map((k) => k.skill);
    const list = (arr) => arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    let note = "";
    if (strong.length) note += `<b>Strong:</b> ${esc(list(strong))}. `;
    if (close.length) note += `<b>Getting there</b> (right after a hint): ${esc(list(close))}. `;
    if (practice.length) note += `<b>Practice next:</b> ${esc(list(practice))}. Numi showed the full steps for these, so a short review together would help.`;
    if (!practice.length && !close.length) note += "Every question was right on the first try. Try the next grade up for a challenge.";
    const history = loadHistory().slice(1, 6);
    const el = overlay(`
      <div class="nn-card">
        <p class="nn-sub" style="margin:0">Report for grown-ups</p>
        <h1 class="nn-h1">Grade ${s.grade} ${subjName(s.subject).toLowerCase()}: ${s.first + s.helped} of ${s.total} right</h1>
        <p class="nn-sub">${esc(when)} · about ${s.minutes} minute${s.minutes === 1 ? "" : "s"}</p>
        <div class="nn-tiles">
          <div class="nn-tile first"><b>${s.first}</b><span>Right on the first try</span></div>
          <div class="nn-tile helped"><b>${s.helped}</b><span>Right after a hint</span></div>
          <div class="nn-tile shown"><b>${s.shown}</b><span>Needed the full solution</span></div>
        </div>
        <div class="nn-note">${note}</div>
        <h2 class="nn-h2">By skill</h2>
        <ul class="nn-list">${s.skills.map((k) => { const [c, t] = level(k); return `<li class="nn-row"><div class="top"><span class="q">${esc(k.skill)}</span><span class="nn-chip ${c}">${t}</span></div><div class="meta">${k.first + k.helped} of ${k.total} right${k.first ? `, ${k.first} on the first try` : ""}</div></li>`; }).join("")}</ul>
        <h2 class="nn-h2">Every question</h2>
        <ul class="nn-list">${s.items.map((it, i) => `<li class="nn-row"><div class="top"><span class="q">${i + 1}. ${esc(it.prompt)}</span><span class="nn-chip ${it.result}">${RESULT_LABEL[it.result]}</span></div>
          <div class="meta">${esc(it.skill)} · Answer: <b>${esc(it.answer)}</b>${it.wrong.length ? ` · First tried: ${esc(it.wrong.join(", "))}` : ""}${it.hints ? ` · ${it.hints} hint${it.hints === 1 ? "" : "s"}` : ""}</div></li>`).join("")}</ul>
        ${history.length ? `<h2 class="nn-h2">Earlier rounds on this device</h2><ul class="nn-list">${history.map((h) => `<li class="nn-row"><div class="top"><span class="q">Grade ${h.grade} ${subjName(h.subject).toLowerCase()}</span><span class="nn-small">${esc(new Date(h.when).toLocaleDateString(undefined, { month: "short", day: "numeric" }))}</span></div><div class="meta">${h.first + h.helped} of ${h.total} right · ${h.first} on the first try · ${h.shown} needed the solution</div></li>`).join("")}</ul>` : ""}
        <p class="nn-small" style="margin-top:16px">Results are saved only on this device. Nothing is sent anywhere.</p>
        <div class="nn-btns">
          <button class="nn-btn" data-act="again" data-focus>Practice more</button>
          <button class="nn-btn ghost" data-act="home">Home</button>
        </div>
      </div>`);
    el.querySelector('[data-act="again"]').onclick = newRound;
    el.querySelector('[data-act="home"]').onclick = goHome;
  }

  // ---------- real numbers for the parent page and the streak ----------
  const DAY = 86400000;
  const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`; };
  const shortDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  function student() {
    const hist = loadHistory();
    const days = new Set(hist.map((h) => dayKey(h.when)));
    let streak = 0;
    let d = Date.now();
    if (!days.has(dayKey(d))) d -= DAY; // a streak still counts until the end of today
    while (days.has(dayKey(d))) { streak++; d -= DAY; }
    const today = dayKey(Date.now());
    const minutesToday = hist.filter((h) => dayKey(h.when) === today).reduce((n, h) => n + (h.minutes || 0), 0);
    return { streakDays: streak, minutesToday };
  }

  function parentReport() {
    const since = Date.now() - 7 * DAY;
    const week = loadHistory().filter((h) => new Date(h.when).getTime() >= since);
    const range = `${shortDate(since + DAY)} – ${shortDate(Date.now())}`;
    if (!week.length) {
      return {
        weekOf: `Last 7 days (${range})`,
        minutesPracticed: 0, questionsAttempted: 0, questionsCorrect: 0, groups: [],
        note: "No practice rounds finished on this device in the last 7 days. When your child finishes a round of 10 questions, the results show up here, by skill.",
      };
    }
    const groups = [];
    for (const [subject, label] of [["math", "Math"], ["reading", "Reading"], ["science", "Science"]]) {
      const map = {};
      for (const h of week.filter((x) => x.subject === subject)) {
        for (const k of h.skills || []) {
          const m = (map[k.skill] = map[k.skill] || { name: k.skill, total: 0, right: 0 });
          m.total += k.total; m.right += k.right;
        }
      }
      const skills = Object.values(map).map((m) => ({ name: m.name, accuracy: m.total ? m.right / m.total : 0 }))
        .sort((a, b) => b.accuracy - a.accuracy);
      if (skills.length) groups.push({ subject, label, skills });
    }
    const all = groups.flatMap((g) => g.skills);
    const weakest = all.slice().sort((a, b) => a.accuracy - b.accuracy)[0];
    const strongest = all.slice().sort((a, b) => b.accuracy - a.accuracy)[0];
    const rounds = week.length;
    let note = `${rounds} round${rounds === 1 ? "" : "s"} finished this week. `;
    if (strongest) note += `Strongest: ${strongest.name} (${Math.round(strongest.accuracy * 100)}% right). `;
    if (weakest && weakest !== strongest && weakest.accuracy < 0.8) note += `The one to work on: ${weakest.name} (${Math.round(weakest.accuracy * 100)}% right). Doing a round together and talking through the hints helps most.`;
    else if (weakest) note += "Everything is above 80%. Try the next grade up for a challenge.";
    return {
      weekOf: `Last 7 days (${range})`,
      minutesPracticed: week.reduce((n, h) => n + (h.minutes || 0), 0),
      questionsAttempted: week.reduce((n, h) => n + (h.total || 0), 0),
      questionsCorrect: week.reduce((n, h) => n + (h.first || 0) + (h.helped || 0), 0),
      groups,
      note,
    };
  }

  window.NumberNestBank = {
    session,
    record,
    finish,
    student,
    parentReport,
    // For testing: every generator and passage, so they can be checked.
    _math: MATH,
    _reading: READING,
    _readingQuestions: readingQuestions,
    _science: SCIENCE,
    _scienceQuestions: scienceQuestions,
  };
})();
