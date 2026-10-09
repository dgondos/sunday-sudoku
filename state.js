/* Pure game state. ES5 by design for iOS 12 Safari. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SudokuState = factory();
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var multipliers = {easy: 1, medium: 2, hard: 3, expert: 4};
  function zeros() { var a = [], i; for (i = 0; i < 81; i++) a.push(0); return a; }
  function newGame(puzzle, now) {
    return {version: 1, id: puzzle.id + '-' + now, puzzle: JSON.parse(JSON.stringify(puzzle)), board: puzzle.givens.slice(), notes: zeros(), selected: puzzle.givens.indexOf(0), noteMode: false, elapsedMs: 0, mistakes: 0, hints: 0, history: [], finished: false, recorded: false};
  }
  function complete(game) {
    for (var i = 0; i < 81; i++) if (game.board[i] !== game.puzzle.solution[i]) return false;
    return true;
  }
  function snapshot(game) {
    game.history.push({board: game.board.slice(), notes: game.notes.slice()});
    if (game.history.length > 200) game.history.shift();
  }
  function peers(a, b) {
    var ar = Math.floor(a / 9), br = Math.floor(b / 9), ac = a % 9, bc = b % 9;
    return ar === br || ac === bc || (Math.floor(ar / 3) === Math.floor(br / 3) && Math.floor(ac / 3) === Math.floor(bc / 3));
  }
  function place(game, index, value, noteMode) {
    if (game.finished || index < 0 || index > 80 || index % 1 || value < 0 || value > 9 || value % 1 || game.puzzle.givens[index]) return {changed: false};
    if (noteMode && value && game.board[index]) return {changed: false};
    if (!noteMode && game.board[index] === value && (value || !game.notes[index])) return {changed: false};
    snapshot(game);
    if (noteMode && value) {
      game.notes[index] ^= 1 << (value - 1);
      return {changed: true, error: false, complete: false};
    }
    game.board[index] = value;
    game.notes[index] = 0;
    var error = !!value && value !== game.puzzle.solution[index], i;
    if (error) game.mistakes++;
    if (value && !error) for (i = 0; i < 81; i++) if (peers(index, i)) game.notes[i] &= ~(1 << (value - 1));
    game.finished = complete(game);
    return {changed: true, error: error, complete: game.finished};
  }
  function undo(game) {
    if (game.finished || !game.history.length) return false;
    var previous = game.history.pop();
    game.board = previous.board;
    game.notes = previous.notes;
    return true;
  }
  function hint(game, index) {
    if (game.finished) return {changed: false};
    if (index < 0 || index > 80 || game.puzzle.givens[index] || game.board[index] === game.puzzle.solution[index]) {
      index = -1;
      for (var i = 0; i < 81; i++) if (!game.puzzle.givens[i] && game.board[i] !== game.puzzle.solution[i]) { index = i; break; }
    }
    if (index < 0) return {changed: false};
    game.hints++;
    var result = place(game, index, game.puzzle.solution[index], false);
    result.index = index;
    return result;
  }
  function score(game) {
    var correct = 0, i, multiplier = multipliers[game.puzzle.difficulty];
    for (i = 0; i < 81; i++) if (!game.puzzle.givens[i] && game.board[i] === game.puzzle.solution[i]) correct++;
    var bonus = game.finished ? 1000 + Math.max(0, 600 - Math.floor(game.elapsedMs / 1000)) : 0;
    return Math.max(0, (correct * 50 + bonus - game.mistakes * 20 - game.hints * 100) * multiplier);
  }
  function ranked(records, difficulty) {
    return records.filter(function (r) { return r.difficulty === difficulty; }).sort(function (a, b) {
      return b.score - a.score || a.elapsedMs - b.elapsedMs || a.date - b.date;
    }).slice(0, 10);
  }
  function recordWin(records, game, name, now) {
    if (!game.finished || game.recorded) return false;
    for (var i = 0; i < records.length; i++) if (records[i].id === game.id) { game.recorded = true; return false; }
    records.push({id: game.id, name: String(name || 'Mum').slice(0, 24), difficulty: game.puzzle.difficulty, score: score(game), elapsedMs: game.elapsedMs, hints: game.hints, mistakes: game.mistakes, date: now});
    game.recorded = true;
    var kept = [];
    for (var level in multipliers) if (Object.prototype.hasOwnProperty.call(multipliers, level)) kept = kept.concat(ranked(records, level));
    records.splice.apply(records, [0, records.length].concat(kept));
    return true;
  }
  var storageKey = 'sunday-sudoku.v1';
  function digits(a, blanks) {
    if (!Array.isArray(a) || a.length !== 81) return false;
    for (var i = 0; i < 81; i++) if (typeof a[i] !== 'number' || a[i] % 1 || a[i] < (blanks ? 0 : 1) || a[i] > 9) return false;
    return true;
  }
  function validSolution(a) {
    if (!digits(a, false)) return false;
    for (var i = 0; i < 81; i++) for (var j = i + 1; j < 81; j++) if (peers(i, j) && a[i] === a[j]) return false;
    return true;
  }
  function finitePositive(n) { return typeof n === 'number' && isFinite(n) && n >= 0; }
  function validGame(game) {
    if (!game || game.version !== 1 || typeof game.id !== 'string' || !game.puzzle || !multipliers[game.puzzle.difficulty]) return false;
    var p = game.puzzle, i;
    if (!digits(p.givens, true) || !validSolution(p.solution) || !digits(game.board, true)) return false;
    if (!Array.isArray(game.notes) || game.notes.length !== 81 || !Array.isArray(game.history) || game.history.length > 200) return false;
    for (i = 0; i < 81; i++) {
      if (p.givens[i] && (p.givens[i] !== p.solution[i] || game.board[i] !== p.givens[i])) return false;
      if (typeof game.notes[i] !== 'number' || game.notes[i] % 1 || game.notes[i] < 0 || game.notes[i] > 511) return false;
    }
    for (i = 0; i < game.history.length; i++) {
      var h = game.history[i];
      if (!h || !digits(h.board, true) || !Array.isArray(h.notes) || h.notes.length !== 81) return false;
      for (var j = 0; j < 81; j++) if ((p.givens[j] && h.board[j] !== p.givens[j]) || typeof h.notes[j] !== 'number' || h.notes[j] % 1 || h.notes[j] < 0 || h.notes[j] > 511) return false;
    }
    return finitePositive(game.elapsedMs) && finitePositive(game.mistakes) && game.mistakes % 1 === 0 && finitePositive(game.hints) && game.hints % 1 === 0 && typeof game.finished === 'boolean' && game.finished === complete(game) && typeof game.recorded === 'boolean' && typeof game.noteMode === 'boolean' && typeof game.selected === 'number' && game.selected % 1 === 0 && game.selected >= 0 && game.selected < 81;
  }
  function readSave(storage) {
    try {
      var data = JSON.parse(storage.getItem(storageKey));
      if (!data || data.version !== 1 || !validGame(data.game) || !Array.isArray(data.records) || data.records.length > 40 || !data.preferences) return null;
      for (var i = 0; i < data.records.length; i++) {
        var r = data.records[i];
        if (!r || typeof r.id !== 'string' || typeof r.name !== 'string' || !multipliers[r.difficulty] || !finitePositive(r.score) || !finitePositive(r.elapsedMs) || !finitePositive(r.date)) return null;
      }
      if (typeof data.preferences.name !== 'string' || typeof data.preferences.errors !== 'boolean' || typeof data.preferences.motion !== 'boolean') return null;
      return data;
    } catch (error) { return null; }
  }
  function writeSave(storage, data) {
    try { storage.setItem(storageKey, JSON.stringify(data)); return true; }
    catch (error) { return false; }
  }
  return {newGame: newGame, place: place, complete: complete, undo: undo, hint: hint, score: score, ranked: ranked, recordWin: recordWin, readSave: readSave, writeSave: writeSave, validGame: validGame, storageKey: storageKey};
}));
