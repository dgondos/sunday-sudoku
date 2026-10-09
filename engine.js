/* Sunday Sudoku. Dependency-free ES5; generated catalogue is loaded separately. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(function () { return require('./puzzles'); });
  } else {
    root.SudokuCore = factory(function () { return root.SudokuPuzzles; });
  }
}(typeof self !== 'undefined' ? self : this, function (getCatalogue) {
  'use strict';
  var ALL = 511;
  var UNITS = [], PEERS = [], ROW = [], COL = [], BOX = [];
  var i, j, r, c, b, unit;
  for (i = 0; i < 9; i += 1) {
    unit = [];
    for (j = 0; j < 9; j += 1) { unit.push(i * 9 + j); }
    UNITS.push(unit);
  }
  for (i = 0; i < 9; i += 1) {
    unit = [];
    for (j = 0; j < 9; j += 1) { unit.push(j * 9 + i); }
    UNITS.push(unit);
  }
  for (i = 0; i < 9; i += 1) {
    unit = [];
    for (j = 0; j < 9; j += 1) {
      unit.push((Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + (i % 3) * 3 + j % 3);
    }
    UNITS.push(unit);
  }
  for (i = 0; i < 81; i += 1) {
    ROW[i] = Math.floor(i / 9); COL[i] = i % 9;
    BOX[i] = Math.floor(ROW[i] / 3) * 3 + Math.floor(COL[i] / 3);
    PEERS[i] = [];
    for (j = 0; j < 81; j += 1) {
      if (i !== j && (Math.floor(j / 9) === ROW[i] || j % 9 === COL[i] ||
          Math.floor(j / 27) * 3 + Math.floor((j % 9) / 3) === BOX[i])) {
        PEERS[i].push(j);
      }
    }
  }
  function bits(mask) {
    var count = 0;
    while (mask) { mask &= mask - 1; count += 1; }
    return count;
  }
  function digit(bit) {
    var n = 1;
    while (bit > 1) { bit >>= 1; n += 1; }
    return n;
  }
  function readBoard(board) {
    var rows = [], cols = [], boxes = [], cells = [], n, bit, k;
    if (!Array.isArray(board) || board.length !== 81) { return null; }
    for (k = 0; k < 9; k += 1) { rows[k] = 0; cols[k] = 0; boxes[k] = 0; }
    for (k = 0; k < 81; k += 1) {
      n = board[k];
      if (typeof n !== 'number' || n !== Math.floor(n) || n < 0 || n > 9) { return null; }
      cells[k] = n;
      if (n) {
        bit = 1 << (n - 1);
        if ((rows[ROW[k]] | cols[COL[k]] | boxes[BOX[k]]) & bit) { return null; }
        rows[ROW[k]] |= bit; cols[COL[k]] |= bit; boxes[BOX[k]] |= bit;
      }
    }
    return { cells: cells, rows: rows, cols: cols, boxes: boxes };
  }
  function search(board, limit, budget) {
    var state = readBoard(board), result = { count: 0, solution: null, nodes: 0, exhausted: false };
    if (!state) { return result; }
    function visit() {
      var k, mask, size, best = -1, bestMask = 0, bestSize = 10, bit;
      if (result.count >= limit || result.exhausted) { return; }
      if (budget && result.nodes >= budget) { result.exhausted = true; return; }
      result.nodes += 1;
      for (k = 0; k < 81; k += 1) {
        if (!state.cells[k]) {
          mask = ALL & ~(state.rows[ROW[k]] | state.cols[COL[k]] | state.boxes[BOX[k]]);
          size = bits(mask);
          if (!size) { return; }
          if (size < bestSize) { best = k; bestMask = mask; bestSize = size; }
          if (size === 1) { break; }
        }
      }
      if (best === -1) {
        result.count += 1;
        if (!result.solution) { result.solution = state.cells.slice(); }
        return;
      }
      while (bestMask && result.count < limit && !result.exhausted) {
        bit = bestMask & -bestMask; bestMask ^= bit;
        state.cells[best] = digit(bit);
        state.rows[ROW[best]] |= bit; state.cols[COL[best]] |= bit; state.boxes[BOX[best]] |= bit;
        visit();
        state.cells[best] = 0;
        state.rows[ROW[best]] ^= bit; state.cols[COL[best]] ^= bit; state.boxes[BOX[best]] ^= bit;
      }
    }
    visit();
    return result;
  }
  function solve(board) { return search(board, 1, 0).solution; }
  function countSolutions(board, limit) {
    if (typeof limit === 'undefined') { limit = 2; }
    if (typeof limit !== 'number' || limit !== Math.floor(limit) || limit < 1 || !isFinite(limit)) {
      throw new RangeError('limit must be a positive integer');
    }
    return search(board, limit, 0).count;
  }
  function candidates(board, index) {
    var state = readBoard(board), mask, values = [], n;
    if (!state || typeof index !== 'number' || index !== Math.floor(index) || index < 0 || index > 80 || state.cells[index]) {
      return values;
    }
    mask = ALL & ~(state.rows[ROW[index]] | state.cols[COL[index]] | state.boxes[BOX[index]]);
    for (n = 1; n <= 9; n += 1) { if (mask & (1 << (n - 1))) { values.push(n); } }
    return values;
  }
  function isValidComplete(board) {
    var state = readBoard(board), k;
    if (!state) { return false; }
    for (k = 0; k < 81; k += 1) { if (!state.cells[k]) { return false; } }
    return true;
  }
  function techniqueCounts() {
    return { nakedSingles: 0, hiddenSingles: 0, lockedCandidates: 0, nakedPairs: 0 };
  }
  function logicalSolve(board, stage) {
    var state = readBoard(board), cells = state.cells, masks = [], counts = techniqueCounts();
    var k, p, mask, fill, remaining = 0, progress, u, n, bit, spots, index, seen;
    var removals, targets, t, axis, group, confined, removed, mates;
    for (k = 0; k < 81; k += 1) {
      masks[k] = cells[k] ? 0 : ALL & ~(state.rows[ROW[k]] | state.cols[COL[k]] | state.boxes[BOX[k]]);
      if (!cells[k]) { remaining += 1; }
    }
    function place(index, bit) {
      cells[index] = digit(bit); masks[index] = 0; remaining -= 1;
      for (p = 0; p < PEERS[index].length; p += 1) { masks[PEERS[index][p]] &= ~bit; }
    }
    do {
      progress = false; fill = [];
      for (k = 0; k < 81; k += 1) {
        mask = masks[k];
        if (mask && !(mask & (mask - 1))) { fill.push([k, mask]); }
      }
      if (fill.length) {
        for (k = 0; k < fill.length; k += 1) { place(fill[k][0], fill[k][1]); counts.nakedSingles += 1; }
        progress = true;
      } else if (stage >= 1) {
        seen = [];
        for (u = 0; u < UNITS.length; u += 1) {
          for (n = 0; n < 9; n += 1) {
            bit = 1 << n; spots = 0; index = -1;
            for (k = 0; k < 9; k += 1) {
              if (masks[UNITS[u][k]] & bit) { spots += 1; index = UNITS[u][k]; }
            }
            if (spots === 1 && !seen[index]) { fill.push([index, bit]); seen[index] = true; }
          }
        }
        for (k = 0; k < fill.length; k += 1) { place(fill[k][0], fill[k][1]); counts.hiddenSingles += 1; }
        progress = fill.length > 0;
      }
      if (!progress && stage >= 2) {
        removals = [];
        for (k = 0; k < 81; k += 1) { removals[k] = 0; }
        /* Pointing (box -> line) and claiming (line -> box), computed
           simultaneously so coordinate/digit permutations cannot change closure. */
        for (u = 0; u < UNITS.length; u += 1) {
          for (n = 0; n < 9; n += 1) {
            bit = 1 << n; spots = [];
            for (k = 0; k < 9; k += 1) { if (masks[UNITS[u][k]] & bit) { spots.push(UNITS[u][k]); } }
            if (spots.length < 2) { continue; }
            targets = u >= 18 ? [ROW, COL] : [BOX];
            for (t = 0; t < targets.length; t += 1) {
              axis = targets[t]; group = axis[spots[0]]; confined = true;
              for (k = 1; k < spots.length; k += 1) { if (axis[spots[k]] !== group) { confined = false; } }
              if (!confined) { continue; }
              for (k = 0; k < 81; k += 1) {
                if (axis[k] === group && UNITS[u].indexOf(k) === -1) { removals[k] |= masks[k] & bit; }
              }
            }
          }
        }
        removed = 0;
        for (k = 0; k < 81; k += 1) { removed += bits(removals[k]); masks[k] &= ~removals[k]; }
        counts.lockedCandidates += removed; progress = removed > 0;
      }
      if (!progress && stage >= 2) {
        /* Exactly two equal two-candidate cells in a unit form a naked pair. */
        removals = [];
        for (k = 0; k < 81; k += 1) { removals[k] = 0; }
        for (u = 0; u < UNITS.length; u += 1) {
          for (t = 0; t < 9; t += 1) {
            index = UNITS[u][t]; mask = masks[index];
            if (bits(mask) !== 2) { continue; }
            mates = [];
            for (k = 0; k < 9; k += 1) { if (masks[UNITS[u][k]] === mask) { mates.push(UNITS[u][k]); } }
            if (mates.length !== 2 || index !== mates[0]) { continue; }
            for (k = 0; k < 9; k += 1) {
              index = UNITS[u][k];
              if (index !== mates[0] && index !== mates[1]) { removals[index] |= masks[index] & mask; }
            }
          }
        }
        removed = 0;
        for (k = 0; k < 81; k += 1) { removed += bits(removals[k]); masks[k] &= ~removals[k]; }
        counts.nakedPairs += removed; progress = removed > 0;
      }
    } while (progress && remaining);
    return { solved: remaining === 0, remaining: remaining, techniques: counts };
  }
  /* Rating contract (no clue-count thresholds): only provably unique boards get a tier.
     easy: naked singles alone complete; medium: naked closure stalls but adding hidden
     singles completes; hard: singles stall but adding locked candidates (both pointing
     and claiming) and naked pairs completes; expert: all those techniques stall.
     Each tier starts from the original board, not a trace influenced by stronger rules.
     Within a stage, each wave is simultaneous; naked singles have priority, then hidden
     singles, then locked candidates, then naked pairs. This preserves tier under every
     digit/row/column/band/stack permutation and transposition used by createPuzzle.
     techniques.*Singles count placements; lockedCandidates/nakedPairs count distinct
     eliminated cell-digit candidates, not deductions. remaining counts unfilled cells.
     searchNodes counts MRV uniqueness-validation nodes (for ALL tiers), never a clue
     burden or difficulty score. requiresSearch means this engine's logic cannot finish,
     not that every human solver must guess. Validation stops at 100000 nodes; exhausted
     input stays unrated, with unique:null and solvable:null if no solution was found.
     valid means array shape/range/no repeated givens, not proof of solvability. */
  function ratePuzzle(board) {
    var state = readBoard(board), checked, logical, k;
    var rating = {
      difficulty: null, valid: !!state, solvable: false, unique: false,
      solvedLogically: false, requiresSearch: false, hardestTechnique: null,
      clues: 0, techniques: techniqueCounts(), remaining: 0,
      searchNodes: 0, searchLimit: 100000, exhausted: false
    };
    if (!state) { return rating; }
    for (k = 0; k < 81; k += 1) { if (board[k]) { rating.clues += 1; } }
    rating.remaining = 81 - rating.clues;
    checked = search(board, 2, rating.searchLimit);
    rating.searchNodes = checked.nodes; rating.exhausted = checked.exhausted;
    rating.solvable = checked.count > 0 ? true : (checked.exhausted ? null : false);
    rating.unique = checked.exhausted ? null : checked.count === 1;
    if (!rating.unique) { return rating; }
    logical = logicalSolve(board, 0);
    rating.techniques = logical.techniques; rating.remaining = logical.remaining;
    if (logical.solved) {
      rating.difficulty = 'easy'; rating.hardestTechnique = 'naked-single'; rating.solvedLogically = true;
    } else {
      logical = logicalSolve(board, 1);
      rating.techniques = logical.techniques; rating.remaining = logical.remaining;
      if (logical.solved) {
        rating.difficulty = 'medium'; rating.hardestTechnique = 'hidden-single'; rating.solvedLogically = true;
      } else {
        logical = logicalSolve(board, 2);
        rating.techniques = logical.techniques; rating.remaining = logical.remaining;
        if (logical.solved) {
          rating.difficulty = 'hard';
          rating.hardestTechnique = logical.techniques.nakedPairs ? 'naked-pair' : 'locked-candidate';
          rating.solvedLogically = true;
        } else {
          rating.difficulty = 'expert'; rating.hardestTechnique = 'search'; rating.requiresSearch = true;
        }
      }
    }
    return rating;
  }
  function seededRandom(text) {
    var hash = 2166136261, k;
    for (k = 0; k < text.length; k += 1) {
      hash ^= text.charCodeAt(k);
      hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
    }
    return function () {
      hash = (hash * 1664525 + 1013904223) >>> 0;
      return hash / 4294967296;
    };
  }
  function shuffle(values, random) {
    var result = values.slice(), k, other, saved;
    for (k = result.length - 1; k > 0; k -= 1) {
      other = Math.floor(random() * (k + 1));
      saved = result[k]; result[k] = result[other]; result[other] = saved;
    }
    return result;
  }
  function permutedAxis(random) {
    var groups = shuffle([0, 1, 2], random), result = [], g, inside, k;
    for (g = 0; g < 3; g += 1) {
      inside = shuffle([0, 1, 2], random);
      for (k = 0; k < 3; k += 1) { result.push(groups[g] * 3 + inside[k]); }
    }
    return result;
  }
  function createPuzzle(level, seed) {
    var catalogue, entries, entry, random, digits, rows, cols, transpose;
    var givens = [], solution = [], k, row, col, source, value, rating;
    if (['easy', 'medium', 'hard', 'expert'].indexOf(level) === -1) {
      throw new RangeError('level must be easy, medium, hard, or expert');
    }
    if (typeof seed !== 'number' || !isFinite(seed) || seed !== Math.floor(seed) || Math.abs(seed) > 9007199254740991) {
      throw new RangeError('seed must be a safe integer');
    }
    catalogue = getCatalogue();
    if (!catalogue || !catalogue.levels) { throw new Error('Load puzzles.js before creating a puzzle'); }
    entries = catalogue.levels[level];
    entry = entries[((seed % entries.length) + entries.length) % entries.length];
    random = seededRandom(level + ':' + String(seed));
    digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random);
    rows = permutedAxis(random); cols = permutedAxis(random); transpose = random() < 0.5;
    /* Sudoku automorphisms preserve boxes, units, uniqueness, and logical tier. */
    for (k = 0; k < 81; k += 1) {
      row = rows[Math.floor(k / 9)]; col = cols[k % 9];
      source = transpose ? col * 9 + row : row * 9 + col;
      value = Number(entry.givens.charAt(source)); givens[k] = value ? digits[value - 1] : 0;
      solution[k] = digits[Number(entry.solution.charAt(source)) - 1];
    }
    // Rate the actual transformed board; search-node metrics are not copied from its base.
    rating = ratePuzzle(givens);
    if (rating.difficulty !== level) { throw new Error('Catalogue transformation changed logical tier'); }
    return { givens: givens, solution: solution, id: 'sudoku-v1-' + entry.id + ':' + String(seed), difficulty: level, rating: rating };
  }
  return {
    createPuzzle: createPuzzle, solve: solve, countSolutions: countSolutions, candidates: candidates,
    isValidComplete: isValidComplete, ratePuzzle: ratePuzzle
  };
}));
