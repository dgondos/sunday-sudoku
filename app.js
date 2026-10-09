/* Touch-first UI, deliberately ES5 for the first-generation iPad Air. */
(function () {
  'use strict';
  var State = window.SudokuState, Core = window.SudokuCore;
  var levels = ['easy', 'medium', 'hard', 'expert'];
  var names = {easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert'};
  var descriptions = {easy: 'A gentle start · simple singles', medium: 'A little focus · hidden singles', hard: 'A satisfying challenge · pairs & patterns', expert: 'The deep end · advanced reasoning'};
  var cells = [], numbers = [], data, game, paused = false, modalOpen = false, lastTick = Date.now(), storage = null, toastTimer;
  function el(id) { return document.getElementById(id); }
  function node(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }
  function time(ms) {
    var seconds = Math.floor(ms / 1000), minutes = Math.floor(seconds / 60);
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds % 60 < 10 ? '0' : '') + seconds % 60;
  }
  function save() {
    var ok = storage && State.writeSave(storage, data);
    el('save-status').textContent = ok ? 'Saved on this device' : 'Not saved · storage unavailable';
    el('save-status').className = 'save-status' + (ok ? '' : ' failed');
    return ok;
  }
  function related(a, b) {
    var ar = Math.floor(a / 9), br = Math.floor(b / 9), ac = a % 9, bc = b % 9;
    return ar === br || ac === bc || (Math.floor(ar / 3) === Math.floor(br / 3) && Math.floor(ac / 3) === Math.floor(bc / 3));
  }
  function render() {
    var selected = game.selected, value = game.board[selected], correct = 0, total = 0, counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i, j;
    for (i = 0; i < 81; i++) {
      var button = cells[i], row = Math.floor(i / 9), col = i % 9, digit = game.board[i];
      var classes = 'cell' + (game.puzzle.givens[i] ? ' given' : '') + (col === 2 || col === 5 ? ' box-right' : '') + (row === 2 || row === 5 ? ' box-bottom' : '') + (col === 8 ? ' edge-right' : '') + (row === 8 ? ' edge-bottom' : '');
      if (related(selected, i)) classes += ' related';
      if (value && digit === value) classes += ' same';
      if (selected === i) classes += ' selected';
      var error = digit && digit !== game.puzzle.solution[i];
      if (error && data.preferences.errors) classes += ' error';
      button.textContent = '';
      var label = 'Row ' + (row + 1) + ', column ' + (col + 1) + ', ';
      if (digit) {
        button.appendChild(node('span', 'digit', digit));
        label += digit + (game.puzzle.givens[i] ? ', fixed clue' : '') + (error && data.preferences.errors ? ', incorrect' : '');
      } else if (game.notes[i]) {
        classes += ' note-cell';
        var pencil = node('span', 'pencil-grid'), notes = [];
        pencil.setAttribute('aria-hidden', 'true');
        for (j = 1; j <= 9; j++) { var marked = game.notes[i] & (1 << (j - 1)); pencil.appendChild(node('span', '', marked ? j : '')); if (marked) notes.push(j); }
        button.appendChild(pencil);
        label += 'notes ' + notes.join(', ');
      } else label += 'empty';
      button.className = classes;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-selected', selected === i ? 'true' : 'false');
      button.tabIndex = selected === i ? 0 : -1;
      button.disabled = paused;
      if (!game.puzzle.givens[i]) {total++; if (digit === game.puzzle.solution[i]) correct++;}
      if (digit && !error) counts[digit]++;
    }
    for (i = 1; i <= 9; i++) {
      numbers[i - 1].disabled = paused || game.finished || counts[i] === 9;
      numbers[i - 1].querySelector('.remaining').textContent = counts[i] === 9 ? 'done' : (9 - counts[i]) + ' left';
    }
    el('timer').textContent = time(game.elapsedMs);
    el('score').textContent = State.score(game).toLocaleString('en-US');
    el('difficulty-label').textContent = names[game.puzzle.difficulty];
    el('progress-text').textContent = game.finished ? 'Beautifully done. All squares filled!' : correct + ' of ' + total + ' squares filled';
    el('progress-fill').style.width = (correct / total * 100) + '%';
    el('progress').setAttribute('aria-valuenow', Math.round(correct / total * 100));
    el('undo-button').disabled = paused || game.finished || !game.history.length;
    el('erase-button').disabled = paused || game.finished || !!game.puzzle.givens[selected] || (!game.board[selected] && !game.notes[selected]);
    el('notes-button').disabled = paused || game.finished;
    el('hint-button').disabled = paused || game.finished;
    el('notes-button').setAttribute('aria-pressed', game.noteMode ? 'true' : 'false');
    el('notes-state').textContent = game.noteMode ? 'On' : 'Off';
    el('control-title').textContent = game.finished ? 'A lovely little victory.' : game.noteMode ? 'Pencil in a possibility.' : 'Find your rhythm.';
    el('selection-tip').textContent = game.finished ? 'Your score is in your personal bests.' : game.puzzle.givens[selected] ? 'This is a clue. Choose an empty square.' : game.noteMode ? 'Notes are possibilities, not answers.' : 'Tap a number for your selected square.';
    el('board-wrap').className = 'board-wrap' + (paused ? ' paused' : '');
    el('pause-cover').hidden = !paused;
    el('pause-button').setAttribute('aria-label', paused ? 'Resume game' : 'Pause game');
    document.body.className = data.preferences.motion ? '' : 'no-motion';
  }
  function toast(message) {
    clearTimeout(toastTimer);
    el('toast').textContent = message; el('toast').hidden = false;
    toastTimer = setTimeout(function () { el('toast').hidden = true; }, 3200);
  }
  function animate(index, className) {
    if (!data.preferences.motion) return;
    var cell = cells[index]; cell.classList.remove(className); void cell.offsetWidth; cell.classList.add(className);
    setTimeout(function () { cell.classList.remove(className); }, 750);
  }
  function enter(value) {
    if (paused || modalOpen) return;
    tick();
    var result = State.place(game, game.selected, value, game.noteMode);
    if (!result.changed) { if (game.puzzle.givens[game.selected]) toast('That number is a clue. Choose an empty square.'); return; }
    render(); save();
    animate(game.selected, result.error && data.preferences.errors ? 'shake' : 'pop');
    if (result.error && data.preferences.errors) toast('Not quite — you can erase it or try another number.');
    if (result.complete) finish();
  }
  function select(index, focus) {
    if (paused || modalOpen) return;
    game.selected = index; render(); save(); if (focus) cells[index].focus();
  }
  function tick() {
    var now = Date.now();
    if (!paused && !modalOpen && !game.finished && !document.hidden) game.elapsedMs += Math.max(0, Math.min(now - lastTick, 5000));
    lastTick = now;
    el('timer').textContent = time(game.elapsedMs);
  }
  function setPaused(value) {
    tick(); paused = value; lastTick = Date.now(); render(); save();
  }
  try { storage = window.localStorage; } catch (error) { storage = null; }
  data = storage && State.readSave(storage);
  var restored = !!data;
  if (!data) {
    game = State.newGame(Core.createPuzzle('easy', Date.now() % 2147483647), Date.now());
    data = {version: 1, game: game, records: [], preferences: {name: 'Mum', errors: true, motion: true}};
  } else game = data.game;
  for (var i = 0; i < 81; i++) {
    var cell = node('button', 'cell'); cell.type = 'button'; cell.setAttribute('role', 'gridcell'); cell.setAttribute('data-cell', i);
    cell.style.setProperty('--delay', ((Math.floor(i / 9) + i % 9) * 0.018) + 's');
    (function (index) { cell.addEventListener('click', function () { select(index, false); }); }(i));
    cells.push(cell); el('board').appendChild(cell);
  }
  for (var n = 1; n <= 9; n++) {
    var number = node('button', 'number-button'); number.type = 'button'; number.setAttribute('data-number', n); number.setAttribute('aria-label', 'Enter ' + n);
    number.appendChild(node('span', 'number', n)); number.appendChild(node('span', 'remaining', '9 left'));
    (function (value) { number.addEventListener('click', function () { enter(value); }); }(n));
    numbers.push(number); el('numpad').appendChild(number);
  }
  if (game.finished && !game.recorded) State.recordWin(data.records, game, data.preferences.name, Date.now());
  paused = restored && !game.finished;
  render(); save();
  if (!restored) { el('board').classList.add('deal'); setTimeout(function () { el('board').classList.remove('deal'); }, 850); }
  el('pause-button').addEventListener('click', function () { setPaused(!paused); });
  el('resume-button').addEventListener('click', function () { setPaused(false); });
  var returnFocus = null;
  function openDialog(title) {
    tick();
    if (!modalOpen) returnFocus = document.activeElement;
    modalOpen = true; lastTick = Date.now();
    var content = el('modal-content'); content.textContent = '';
    var heading = node('h2', '', title); heading.id = 'modal-title'; content.appendChild(heading);
    el('modal-backdrop').hidden = false; el('modal').focus();
    return content;
  }
  function closeDialog() {
    el('modal-backdrop').hidden = true; modalOpen = false; lastTick = Date.now();
    if (returnFocus && document.documentElement.contains(returnFocus)) returnFocus.focus();
  }
  function action(text, className, callback) {
    var button = node('button', className, text); button.type = 'button'; button.addEventListener('click', callback); return button;
  }
  function startGame(level) {
    var seed = Math.floor(Math.random() * 2147483647);
    game = State.newGame(Core.createPuzzle(level, seed), Date.now()); data.game = game;
    closeDialog(); paused = false; lastTick = Date.now(); render(); save();
    el('board').classList.remove('deal'); void el('board').offsetWidth; el('board').classList.add('deal');
    setTimeout(function () { el('board').classList.remove('deal'); }, 850);
    cells[game.selected].focus();
  }
  function chooseDifficulty() {
    var content = openDialog('What feels right today?');
    content.appendChild(node('p', 'intro', 'From a gentle warm-up to a proper challenge.'));
    var options = node('div', 'difficulty-options');
    levels.forEach(function (level, index) {
      var button = action('', 'difficulty-option', function () {
        var hasProgress = !game.finished && (game.history.length > 0 || game.notes.some(function (note) {return !!note;}) || game.board.some(function (digit, i) {return digit !== game.puzzle.givens[i];}));
        if (hasProgress) confirm('Start a fresh puzzle?', 'Your current puzzle will be replaced. Your personal bests and settings will stay safe.', 'Start new puzzle', function () { startGame(level); });
        else startGame(level);
      });
      button.setAttribute('data-level', level);
      var text = node('span'); text.appendChild(node('strong', '', names[level])); text.appendChild(node('small', '', descriptions[level])); button.appendChild(text);
      button.appendChild(node('span', 'multiplier', '×' + (index + 1))); options.appendChild(button);
    }); content.appendChild(options);
  }
  el('new-button').addEventListener('click', chooseDifficulty);
  el('difficulty-button').addEventListener('click', chooseDifficulty);
  function confirm(title, message, buttonText, callback) {
    var content = openDialog(title); content.appendChild(node('p', 'intro', message));
    var actions = node('div', 'modal-actions'); actions.appendChild(action('Keep playing', 'secondary-button', closeDialog));
    actions.appendChild(action(buttonText, 'primary-button', function () { closeDialog(); callback(); })); content.appendChild(actions);
  }
  function showHint() {
    if (paused || game.finished) return;
    var multiplier = levels.indexOf(game.puzzle.difficulty) + 1;
    confirm('A little nudge?', 'Reveal a number in your selected square (or the next unfinished one). Each hint costs ' + (100 * multiplier) + ' points. You can always keep playing without one.', 'Reveal number', function () {
      tick(); var result = State.hint(game, game.selected);
      if (result.changed) {game.selected = result.index; render(); save(); animate(result.index, 'pop'); if (result.complete) finish();}
    });
  }
  function help() {
    var content = openDialog('A few simple rules.');
    content.appendChild(node('p', 'intro', 'A little logic is all you need. Take your time.'));
    function section(title, text) { var s = node('div', 'help-section'); s.appendChild(node('h3', '', title)); s.appendChild(node('p', '', text)); content.appendChild(s); }
    section('The puzzle', 'Fill every row, every column, and every 3 × 3 box with the numbers 1 to 9, without repeats. The dark numbers are clues and cannot be changed. Tap a square, then a number.');
    section('Your little toolkit', 'Notes lets you pencil in possibilities. Tap the same note twice to remove it. Correct answers tidy matching notes from their row, column, and box. Erase clears a square; Undo takes back your last move. Pause hides the board and stops the timer. Leaving the app pauses it too.');
    section('Points & personal bests', 'Each correct answer earns 50 points. Finishing earns 1,000 bonus points, plus up to 600 for time saved in the first 10 minutes. Wrong attempts cost 20; hints cost 100. Everything is multiplied by difficulty: Easy ×1, Medium ×2, Hard ×3, Expert ×4. Scores never drop below zero. Undo does not refund hints or mistakes. Turning off red highlighting does not remove mistake penalties. Top 10 completed games are saved separately for each level, ranked by points, then fastest time. There is no time limit or game-over penalty.');
    content.appendChild(node('p', 'privacy-note', 'Keyboard: arrow keys move, 1–9 enters a number, N toggles notes, Backspace/Delete erases, Ctrl/Cmd+Z undoes, and Space pauses. Safari → Share → Add to Home Screen gives this game its own icon. Keep using the same browser/home-screen app: Safari can keep their storage separately.'));
  }
  el('hint-button').addEventListener('click', showHint);
  el('help-button').addEventListener('click', help);
  function bestScores(level) {
    var content = openDialog('Your personal bests.');
    content.appendChild(node('p', 'intro', 'Little victories, worth keeping. Top 10 for each difficulty.'));
    var tabs = node('div', 'tabs'); tabs.setAttribute('aria-label', 'Leaderboard difficulty');
    levels.forEach(function (difficulty) {
      var tab = action(names[difficulty], 'tab' + (difficulty === level ? ' active' : ''), function () { bestScores(difficulty); });
      tab.setAttribute('aria-pressed', difficulty === level ? 'true' : 'false'); tabs.appendChild(tab);
    }); content.appendChild(tabs);
    var records = State.ranked(data.records, level);
    if (!records.length) content.appendChild(node('p', 'empty-scores', 'Your first ' + names[level].toLowerCase() + ' victory belongs here. Finish a puzzle to get started.'));
    else {
      var list = node('ol', 'score-list');
      records.forEach(function (record, index) {
        var row = node('li', 'score-row'); row.appendChild(node('span', 'rank', index + 1));
        var person = node('div', 'record-person'); person.appendChild(node('strong', '', record.name));
        person.appendChild(node('small', '', new Date(record.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) + ' · ' + record.hints + ' hints · ' + record.mistakes + ' mistakes'));
        row.appendChild(person);
        var score = node('div', 'record-score'); score.appendChild(node('strong', '', record.score.toLocaleString('en-US'))); score.appendChild(node('small', '', time(record.elapsedMs))); row.appendChild(score); list.appendChild(row);
      }); content.appendChild(list);
    }
    content.appendChild(node('p', 'privacy-note', 'This is a local leaderboard, saved only in this browser. Other devices do not share these scores. Clearing website data also clears your saved game and scores.'));
  }
  function celebrate() {
    if (!data.preferences.motion || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var container = el('celebration'); container.textContent = '';
    var colours = ['#78936d', '#b78036', '#c8d6ad', '#e3be81', '#517359'];
    for (var i = 0; i < 32; i++) {
      var piece = node('span', 'confetti'); piece.style.left = Math.random() * 100 + '%'; piece.style.backgroundColor = colours[i % colours.length]; piece.style.animationDelay = Math.random() * 0.65 + 's'; piece.style.animationDuration = 2.3 + Math.random() * 1.1 + 's'; container.appendChild(piece);
    }
    setTimeout(function () { container.textContent = ''; }, 4500);
  }
  function finish() {
    tick(); State.recordWin(data.records, game, data.preferences.name, Date.now()); render(); save();
    var content = openDialog('Beautifully done!'); el('modal-title').className = 'win-title';
    content.insertBefore(node('div', 'win-symbol', '✳'), content.firstChild);
    content.appendChild(node('p', 'intro win-title', 'A little patience. A little logic. A lovely victory.'));
    content.appendChild(node('div', 'win-score', State.score(game).toLocaleString('en-US')));
    content.appendChild(node('div', 'win-subtitle', names[game.puzzle.difficulty] + ' · points earned'));
    var details = node('div', 'win-details');
    [[time(game.elapsedMs), 'Time'], [game.mistakes, 'Mistakes'], [game.hints, 'Hints']].forEach(function (item) { var detail = node('div'); detail.appendChild(node('strong', '', item[0])); detail.appendChild(node('span', '', item[1])); details.appendChild(detail); }); content.appendChild(details);
    var actions = node('div', 'modal-actions'); actions.appendChild(action('Best scores', 'secondary-button', function () { bestScores(game.puzzle.difficulty); })); actions.appendChild(action('Another puzzle', 'primary-button', function () { chooseDifficulty(); })); content.appendChild(actions);
    celebrate();
  }
  function settings() {
    var content = openDialog('Make yourself at home.');
    content.appendChild(node('p', 'intro', 'A few little things to make the game yours.'));
    var nameLabel = node('label', 'name-label', 'Player name'); nameLabel.htmlFor = 'player-name'; content.appendChild(nameLabel);
    var nameInput = node('input', 'name-input'); nameInput.id = 'player-name'; nameInput.type = 'text'; nameInput.maxLength = 24; nameInput.value = data.preferences.name; content.appendChild(nameInput);
    function toggle(title, subtitle, checked, id) {
      var label = node('label', 'settings-row'), text = node('span', '', title); text.appendChild(node('small', '', subtitle)); label.appendChild(text);
      var input = node('input'); input.type = 'checkbox'; input.checked = checked; input.id = id; input.setAttribute('aria-label', title); label.appendChild(input); content.appendChild(label); return input;
    }
    var errors = toggle('Highlight mistakes', 'Wrong answers are gently marked in red.', data.preferences.errors, 'setting-errors');
    var motion = toggle('Animations', 'Soft transitions and a little celebration.', data.preferences.motion, 'setting-motion');
    content.appendChild(node('p', 'privacy-note', 'Your puzzle and best scores stay in this browser, on this device. Nothing is sent to a server. Avoid Private Browsing if you want to keep them.'));
    var actions = node('div', 'modal-actions'); actions.appendChild(action('Save settings', 'primary-button', function () {
      data.preferences.name = nameInput.value.trim().slice(0, 24) || 'Mum'; data.preferences.errors = errors.checked; data.preferences.motion = motion.checked;
      render(); save(); closeDialog(); toast('All set. Make yourself comfortable.');
    })); content.appendChild(actions);
  }
  el('modal-close').addEventListener('click', closeDialog);
  el('modal-backdrop').addEventListener('click', function (event) { if (event.target === el('modal-backdrop')) closeDialog(); });
  el('settings-button').addEventListener('click', settings);
  el('scores-button').addEventListener('click', function () { bestScores(game.puzzle.difficulty); });
  document.addEventListener('keydown', function (event) {
    if (!modalOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); return; }
    if (event.key === 'Tab') {
      var focusable = el('modal').querySelectorAll('button:not([disabled]), input, select, a[href], [tabindex="0"]');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === el('modal'))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === el('modal'))) { event.preventDefault(); first.focus(); }
    }
  });
  el('notes-button').addEventListener('click', function () {
    if (paused || game.finished) return;
    game.noteMode = !game.noteMode; render(); save();
    toast(game.noteMode ? 'Pencil notes on. Tap again to switch back to answers.' : 'Pencil notes off. Numbers are answers again.');
  });
  el('undo-button').addEventListener('click', function () { if (!paused && State.undo(game)) { render(); save(); } });
  el('erase-button').addEventListener('click', function () {
    if (paused) return;
    var result = State.place(game, game.selected, 0, false);
    if (result.changed) { render(); save(); }
  });
  document.addEventListener('keydown', function (event) {
    if (modalOpen || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    var key = event.key;
    if (key === ' ' && event.target.tagName !== 'BUTTON') { event.preventDefault(); setPaused(!paused); return; }
    if (key === ' ' && event.target.classList.contains('cell')) { event.preventDefault(); setPaused(!paused); return; }
    if (paused || game.finished) return;
    if (/^[1-9]$/.test(key) && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); enter(Number(key)); }
    else if (key === 'Backspace' || key === 'Delete') { event.preventDefault(); el('erase-button').click(); }
    else if (key.toLowerCase() === 'n' && !event.ctrlKey && !event.metaKey) { event.preventDefault(); el('notes-button').click(); }
    else if (key.toLowerCase() === 'z' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); el('undo-button').click(); }
    else if (key.indexOf('Arrow') === 0) {
      event.preventDefault(); var selected = game.selected, row = Math.floor(selected / 9), col = selected % 9;
      if (key === 'ArrowLeft') col = Math.max(0, col - 1);
      if (key === 'ArrowRight') col = Math.min(8, col + 1);
      if (key === 'ArrowUp') row = Math.max(0, row - 1);
      if (key === 'ArrowDown') row = Math.min(8, row + 1);
      select(row * 9 + col, true);
    }
  });
  window.setInterval(function () { tick(); if (!paused && !modalOpen && !game.finished) save(); }, 1000);
  window.addEventListener('pagehide', function () { tick(); save(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && !game.finished) setPaused(true); });
  window.addEventListener('blur', function () { if (!modalOpen && !game.finished) setPaused(true); });
}());
