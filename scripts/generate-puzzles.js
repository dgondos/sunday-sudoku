#!/usr/bin/env node
'use strict';
/* Offline-only generator. No fetched/copied puzzle banks. Each full grid is built
   by randomized backtracking, then clues are removed with uniqueness checks.
   Tier selection uses SudokuCore's logical classifier, never clue-count labels.
   Reproduce: node scripts/generate-puzzles.js
   Verify reproducibility: node scripts/generate-puzzles.js --check */
const fs = require('node:fs');
const path = require('node:path');
const core = require('../engine');
const LEVELS = ['easy', 'medium', 'hard', 'expert'];
const DEFAULT_SEED = 1398096975;
function randomSource(seed) {
  let state = seed >>> 0;
  return function () {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function shuffled(values, random) {
  const result = values.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const saved = result[i]; result[i] = result[j]; result[j] = saved;
  }
  return result;
}
function solvedGrid(random) {
  const board = Array(81).fill(0), rows = Array(9).fill(0), cols = Array(9).fill(0), boxes = Array(9).fill(0);
  function visit() {
    let best = -1, options = [], bestSize = 10;
    for (let i = 0; i < 81; i += 1) {
      if (board[i]) continue;
      const row = Math.floor(i / 9), col = i % 9, box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const blocked = rows[row] | cols[col] | boxes[box];
      const values = [];
      for (let d = 1; d <= 9; d += 1) if (!(blocked & (1 << (d - 1)))) values.push(d);
      if (!values.length) return false;
      if (values.length < bestSize) { best = i; options = values; bestSize = values.length; }
      if (bestSize === 1) break;
    }
    if (best === -1) return true;
    const row = Math.floor(best / 9), col = best % 9, box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    for (const d of shuffled(options, random)) {
      const bit = 1 << (d - 1);
      board[best] = d; rows[row] |= bit; cols[col] |= bit; boxes[box] |= bit;
      if (visit()) return true;
      board[best] = 0; rows[row] ^= bit; cols[col] ^= bit; boxes[box] ^= bit;
    }
    return false;
  }
  if (!visit()) throw new Error('Full-grid generation failed');
  return board;
}
function generateCatalogue(options) {
  options = options || {};
  const count = options.count === undefined ? 8 : options.count;
  const seed = options.seed === undefined ? DEFAULT_SEED : options.seed;
  if (!Number.isSafeInteger(count) || count < 1 || !Number.isSafeInteger(seed)) throw new RangeError('Invalid generator arguments');
  const random = randomSource(seed), levels = { easy: [], medium: [], hard: [], expert: [] }, seen = new Set();
  const indices = Array.from({ length: 81 }, (_, i) => i);
  let trials = 0;
  while (LEVELS.some(level => levels[level].length < count)) {
    if (trials >= 10000) throw new Error('Could not fill all logical tiers');
    const solution = solvedGrid(random), board = solution.slice(), used = new Set();
    trials += 1;
    for (const index of shuffled(indices, random)) {
      const saved = board[index]; board[index] = 0;
      if (core.countSolutions(board) !== 1) { board[index] = saved; continue; }
      const clues = board.filter(Boolean).length;
      // Curation only: avoid nearly complete easy boards. This does not assign a tier.
      if (clues > 36) continue;
      const rating = core.ratePuzzle(board), level = rating.difficulty;
      if (!level || used.has(level) || levels[level].length >= count) continue;
      const givens = board.join('');
      if (seen.has(givens)) continue;
      const entry = {
        id: level + '-' + ('0' + (levels[level].length + 1)).slice(-2),
        givens: givens, solution: solution.join(''), rating: rating,
        generationTrial: trials
      };
      if (core.solve(board).join('') !== entry.solution) throw new Error('Stored solution mismatch');
      levels[level].push(entry); used.add(level); seen.add(givens);
    }
  }
  return {
    version: 1,
    attribution: 'Generated internally by Sunday Sudoku randomized backtracking and unique-solution clue removal; no online puzzle bank used.',
    generationSeed: seed,
    generationTrials: trials,
    classifier: {
      easy: 'Unique; naked-single closure completes.',
      medium: 'Unique; naked singles stall, naked + hidden-single closure completes.',
      hard: 'Unique; singles stall, singles + locked candidates (pointing/claiming) + naked pairs complete.',
      expert: 'Unique within 100000 search nodes; implemented logical closure stalls. Search or techniques beyond this engine are required.'
    },
    levels: levels
  };
}
function serialize(catalogue) {
  return '/* Generated internally. Rebuild with node scripts/generate-puzzles.js. */\n' +
    '(function (root, factory) {\n' +
    "  if (typeof module === 'object' && module.exports) { module.exports = factory(); }\n" +
    '  else { root.SudokuPuzzles = factory(); }\n' +
    "}(typeof self !== 'undefined' ? self : this, function () {\n  'use strict';\n  return " +
    JSON.stringify(catalogue, null, 2) + ';\n}));\n';
}
if (require.main === module) {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const output = outputIndex === -1 ? path.join(__dirname, '..', 'puzzles.js') : path.resolve(args[outputIndex + 1]);
  const catalogue = generateCatalogue();
  const contents = serialize(catalogue);
  if (args.includes('--check')) {
    if (fs.readFileSync(output, 'utf8') !== contents) throw new Error('Catalogue is not reproducible');
    console.log('Catalogue is byte-for-byte reproducible.');
  } else {
    fs.writeFileSync(output, contents);
    console.log('Generated ' + LEVELS.map(level => level + '=' + catalogue.levels[level].length).join(', ') + ' in ' + catalogue.generationTrials + ' full-grid trials: ' + output);
  }
}
module.exports = { generateCatalogue: generateCatalogue, serialize: serialize };
