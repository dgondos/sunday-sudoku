'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const enginePath = path.join(__dirname, '..', 'engine.js');
function core() {
  assert.ok(fs.existsSync(enginePath), 'engine module must exist');
  return require(enginePath);
}
const solution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179'.split('').map(Number);
const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'.split('').map(Number);
test('solve completes a known board without mutating its givens', () => {
  const engine = core();
  const before = puzzle.slice();
  assert.deepEqual(engine.solve(puzzle), solution);
  assert.deepEqual(puzzle, before);
});
test('countSolutions distinguishes impossible, unique, and ambiguous boards', () => {
  const engine = core();
  assert.equal(engine.countSolutions(puzzle), 1);
  assert.equal(engine.countSolutions(Array(81).fill(0)), 2);
  assert.equal(engine.countSolutions(Array(81).fill(0), 3), 3);
  const bad = puzzle.slice(); bad[2] = 5;
  assert.equal(engine.countSolutions(bad), 0);
  assert.equal(engine.solve(bad), null);
});
test('candidates and completion checks reject malformed boards safely', () => {
  const engine = core();
  assert.deepEqual(engine.candidates(puzzle, 2), [1, 2, 4]);
  assert.deepEqual(engine.candidates(puzzle, 0), []);
  assert.deepEqual(engine.candidates(puzzle, -1), []);
  assert.equal(engine.isValidComplete(solution), true);
  assert.equal(engine.isValidComplete(puzzle), false);
  const bad = solution.slice(); bad[0] = bad[1];
  for (const board of [null, {}, [], '0'.repeat(81), Array(81).fill(NaN), Array(81).fill(0.5), Array(81).fill(10), bad]) {
    assert.equal(engine.solve(board), null);
    assert.equal(engine.countSolutions(board), 0);
    assert.deepEqual(engine.candidates(board, 0), []);
    assert.equal(engine.isValidComplete(board), false);
  }
  assert.throws(() => engine.countSolutions(puzzle, 0), RangeError);
});
test('ratePuzzle classifies naked-single puzzles and leaves invalid or ambiguous boards unrated', () => {
  const engine = core();
  const before = puzzle.slice();
  const rating = engine.ratePuzzle(puzzle);
  assert.equal(rating.difficulty, 'easy');
  assert.equal(rating.hardestTechnique, 'naked-single');
  assert.equal(rating.solvedLogically, true);
  assert.equal(rating.requiresSearch, false);
  assert.equal(rating.unique, true);
  assert.ok(rating.techniques.nakedSingles > 0);
  assert.equal(rating.techniques.hiddenSingles, 0);
  assert.deepEqual(puzzle, before);
  assert.equal(engine.ratePuzzle(null).difficulty, null);
  assert.equal(engine.ratePuzzle(null).valid, false);
  const ambiguous = engine.ratePuzzle(Array(81).fill(0));
  assert.equal(ambiguous.difficulty, null);
  assert.equal(ambiguous.unique, false);
});
// Internally carved from the test solution with deterministic removal seed 9137.
const mediumFixture = '030608900600195300100040007000000023400800090010000000900000204080009630000206100'.split('').map(Number);
test('medium requires hidden singles after naked-single closure stalls', () => {
  const rating = core().ratePuzzle(mediumFixture);
  assert.equal(rating.difficulty, 'medium');
  assert.equal(rating.hardestTechnique, 'hidden-single');
  assert.equal(rating.solvedLogically, true);
  assert.ok(rating.techniques.hiddenSingles > 0);
  assert.equal(rating.techniques.lockedCandidates, 0);
  assert.equal(rating.techniques.nakedPairs, 0);
});
// Internally carved with seed 73201, trial 3; singles alone cannot finish.
const lockedFixture = '500608000000100300108002007000761400020800000003900000901000084000000600000000079'.split('').map(Number);
test('hard solves a board requiring locked-candidate eliminations', () => {
  const rating = core().ratePuzzle(lockedFixture);
  assert.equal(rating.difficulty, 'hard');
  assert.equal(rating.solvedLogically, true);
  assert.equal(rating.requiresSearch, false);
  assert.ok(rating.techniques.lockedCandidates > 0);
});
// Internally carved with seed 73201, trial 85; locked candidates alone stall.
const pairFixture = '500670002600000008000000507000000400026800001010904006900500000087400005000080100'.split('').map(Number);
test('hard can finish a board requiring naked-pair eliminations', () => {
  const rating = core().ratePuzzle(pairFixture);
  assert.equal(rating.difficulty, 'hard');
  assert.equal(rating.solvedLogically, true);
  assert.equal(rating.hardestTechnique, 'naked-pair');
  assert.ok(rating.techniques.nakedPairs > 0);
});
// Internally carved with seed 73201, trial 0; implemented logic stalls.
const expertFixture = '004000900672000308000002060009701000000000000003024850060500004000009030040000070'.split('').map(Number);
test('expert means unique but beyond implemented logic, with bounded search validation', () => {
  const rating = core().ratePuzzle(expertFixture);
  assert.equal(rating.difficulty, 'expert');
  assert.equal(rating.hardestTechnique, 'search');
  assert.equal(rating.solvedLogically, false);
  assert.equal(rating.requiresSearch, true);
  assert.equal(rating.unique, true);
  assert.equal(rating.exhausted, false);
  assert.ok(rating.remaining > 0);
  assert.ok(rating.searchNodes <= rating.searchLimit);
});
test('internally generated catalogue contains eight distinct unique logically classified puzzles per tier', () => {
  const cataloguePath = path.join(__dirname, '..', 'puzzles.js');
  assert.ok(fs.existsSync(cataloguePath), 'generated catalogue must exist');
  const catalogue = require(cataloguePath);
  assert.match(catalogue.attribution, /generated internally/i);
  const seen = new Set();
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    assert.ok(catalogue.levels[level].length >= 8, level + ' needs eight base puzzles');
    for (const entry of catalogue.levels[level]) {
      assert.match(entry.givens, /^[0-9]{81}$/);
      assert.match(entry.solution, /^[1-9]{81}$/);
      assert.ok(!seen.has(entry.givens), 'base givens must be distinct');
      seen.add(entry.givens);
      const givens = entry.givens.split('').map(Number);
      const solved = entry.solution.split('').map(Number);
      assert.equal(core().countSolutions(givens), 1, entry.id);
      assert.deepEqual(core().solve(givens), solved, entry.id);
      assert.equal(core().ratePuzzle(givens).difficulty, level, entry.id);
      assert.equal(entry.rating.difficulty, level);
      assert.equal(core().isValidComplete(solved), true);
    }
  }
});
test('createPuzzle deterministically transforms a catalogue puzzle for each level', () => {
  const engine = core();
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    const first = engine.createPuzzle(level, 124);
    assert.deepEqual(engine.createPuzzle(level, 124), first);
    assert.equal(first.difficulty, level);
    assert.equal(first.rating.difficulty, level);
    assert.equal(typeof first.id, 'string');
    assert.equal(first.givens.length, 81);
    assert.equal(first.solution.length, 81);
    assert.equal(engine.countSolutions(first.givens), 1);
    assert.deepEqual(engine.solve(first.givens), first.solution);
    assert.equal(engine.isValidComplete(first.solution), true);
    first.givens.forEach((value, index) => { if (value) assert.equal(value, first.solution[index]); });
    assert.notDeepEqual(engine.createPuzzle(level, 125).givens, first.givens);
  }
  assert.throws(() => engine.createPuzzle('impossible', 1), RangeError);
  for (const seed of [undefined, null, '1', NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => engine.createPuzzle('easy', seed), RangeError);
  }
});
test('rating search obeys its node budget and reports unknown rather than false uniqueness on exhaustion', () => {
  // Internally generated conflict-free adversarial input, random placement seed 84015, trial 16.
  const board = '200830056400000800000000000040700000000002001000040000000000508000000430001063000'.split('').map(Number);
  const rating = core().ratePuzzle(board);
  assert.equal(rating.exhausted, true);
  assert.ok(rating.searchNodes <= rating.searchLimit, 'must not visit a node beyond the advertised bound');
  assert.equal(rating.difficulty, null);
  assert.equal(rating.unique, null);
  assert.equal(rating.solvable, null);
});
test('all base entries survive deterministic automorphisms with their exact logical tier', () => {
  const engine = core();
  const catalogue = require('../puzzles');
  const seeds = Array.from({ length: 128 }, (_, i) => i).concat([-17, -1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 4294967297]);
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    const seen = new Set();
    for (const seed of seeds) {
      const value = engine.createPuzzle(level, seed);
      assert.equal(engine.countSolutions(value.givens), 1, level + ':' + seed);
      assert.deepEqual(engine.solve(value.givens), value.solution);
      assert.deepEqual(engine.ratePuzzle(value.givens), value.rating);
      assert.equal(value.rating.difficulty, level);
      const entries = catalogue.levels[level];
      const base = entries[((seed % entries.length) + entries.length) % entries.length];
      assert.equal(value.givens.filter(Boolean).length, base.rating.clues);
      seen.add(value.givens.join(''));
    }
    assert.equal(seen.size, seeds.length, 'seeds should provide genuinely distinct transformed puzzles');
  }
});
test('returned puzzle arrays and metadata cannot mutate the catalogue or future puzzles', () => {
  const engine = core();
  const original = engine.createPuzzle('medium', 31);
  const changed = engine.createPuzzle('medium', 31);
  changed.givens.fill(9); changed.solution.fill(0); changed.rating.techniques.hiddenSingles = -10;
  assert.deepEqual(engine.createPuzzle('medium', 31), original);
});
test('a locally conflict-free but impossible board returns null and remains unrated', () => {
  const board = puzzle.slice(); board[2] = 1;
  assert.equal(core().solve(board), null);
  assert.equal(core().countSolutions(board), 0);
  const rating = core().ratePuzzle(board);
  assert.equal(rating.valid, true);
  assert.equal(rating.solvable, false);
  assert.equal(rating.unique, false);
  assert.equal(rating.difficulty, null);
});
test('runtime parses as ES5 and browser UMD globals match CommonJS without modern dependencies', () => {
  const vm = require('node:vm');
  const acorn = require('acorn');
  const context = vm.createContext({ Map: undefined, Set: undefined, Promise: undefined, fetch: undefined });
  for (const name of ['engine.js', 'puzzles.js']) {
    const source = fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
    acorn.parse(source, { ecmaVersion: 5 });
    vm.runInContext(source, context, { filename: name });
  }
  assert.ok(context.SudokuPuzzles);
  assert.deepEqual(Object.keys(context.SudokuCore).sort(), ['candidates', 'countSolutions', 'createPuzzle', 'isValidComplete', 'ratePuzzle', 'solve']);
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    const browser = JSON.parse(JSON.stringify(context.SudokuCore.createPuzzle(level, -8392)));
    assert.deepEqual(browser, core().createPuzzle(level, -8392));
  }
});
test('offline generation produces a deterministic internally authored catalogue', () => {
  const generator = require('../scripts/generate-puzzles');
  const options = { count: 1, seed: 246801 };
  const first = generator.generateCatalogue(options);
  assert.deepEqual(generator.generateCatalogue(options), first);
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    assert.equal(first.levels[level].length, 1);
    const board = first.levels[level][0].givens.split('').map(Number);
    assert.equal(core().countSolutions(board), 1);
    assert.equal(core().ratePuzzle(board).difficulty, level);
  }
  assert.match(generator.serialize(first), /SudokuPuzzles/);
});
// Independent array/Set-based reference: no runtime bit masks or rating internals.
function referenceClosure(board, stage) {
  const a = board.slice();
  const row = i => Math.floor(i / 9), col = i => i % 9;
  const box = i => Math.floor(i / 27) * 3 + Math.floor(i % 9 / 3);
  const axes = [row, col, box];
  const units = axes.flatMap(axis => Array.from({ length: 9 }, (_, n) => Array.from({ length: 81 }, (_, i) => i).filter(i => axis(i) === n)));
  let candidates = a.map((d, i) => d ? [] : Array.from({ length: 9 }, (_, n) => n + 1).filter(n => !a.some((other, j) => other === n && axes.some(axis => axis(i) === axis(j)))));
  for (let wave = 0; wave < 810; wave += 1) {
    const fill = new Map();
    candidates.forEach((values, i) => { if (values.length === 1) fill.set(i, values[0]); });
    if (!fill.size && stage >= 1) {
      for (const unit of units) for (let digit = 1; digit <= 9; digit += 1) {
        const spots = unit.filter(i => candidates[i].includes(digit));
        if (spots.length === 1) fill.set(spots[0], digit);
      }
    }
    if (fill.size) {
      for (const [i, digit] of fill) {
        a[i] = digit; candidates[i] = [];
        candidates = candidates.map((values, j) => axes.some(axis => axis(i) === axis(j)) ? values.filter(n => n !== digit) : values);
      }
      continue;
    }
    if (stage < 2) break;
    const remove = Array.from({ length: 81 }, () => new Set());
    for (let u = 0; u < units.length; u += 1) for (let digit = 1; digit <= 9; digit += 1) {
      const spots = units[u].filter(i => candidates[i].includes(digit));
      if (spots.length < 2) continue;
      const targets = u >= 18 ? [row, col] : [box];
      for (const axis of targets) if (spots.every(i => axis(i) === axis(spots[0]))) {
        candidates.forEach((values, i) => { if (axis(i) === axis(spots[0]) && !units[u].includes(i) && values.includes(digit)) remove[i].add(digit); });
      }
    }
    if (!remove.some(values => values.size)) {
      for (const unit of units) for (const i of unit) if (candidates[i].length === 2) {
        const mates = unit.filter(j => candidates[j].join(',') === candidates[i].join(','));
        if (mates.length === 2) for (const j of unit) if (!mates.includes(j)) {
          for (const digit of candidates[i]) if (candidates[j].includes(digit)) remove[j].add(digit);
        }
      }
    }
    if (!remove.some(values => values.size)) break;
    candidates = candidates.map((values, i) => values.filter(n => !remove[i].has(n)));
  }
  return a;
}
test('every catalogue label agrees with an independent technique-based reference classifier', () => {
  const catalogue = require('../puzzles');
  for (const level of ['easy', 'medium', 'hard', 'expert']) for (const entry of catalogue.levels[level]) {
    const board = entry.givens.split('').map(Number);
    const closures = [0, 1, 2].map(stage => referenceClosure(board, stage));
    const completes = closures.map(result => result.every(Boolean));
    const expected = completes[0] ? 'easy' : completes[1] ? 'medium' : completes[2] ? 'hard' : 'expert';
    assert.equal(expected, level, entry.id);
    closures.forEach((result, stage) => { if (completes[stage]) assert.equal(result.join(''), entry.solution); });
  }
});
