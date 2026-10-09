'use strict';
const {test,expect} = require('@playwright/test');
const State = require('../../state.js');
function fixture() {
  const solution = Array.from({length:81}, (_, i) => (Math.floor(i / 9) * 3 + Math.floor(Math.floor(i / 9) / 3) + i % 9) % 9 + 1);
  const givens = solution.map((n,i) => i % 2 ? n : 0);
  return {givens, solution, id:'browser-fixture', difficulty:'easy'};
}
test.beforeEach(async ({page},testInfo) => {
  if (/fresh visitor|storage unavailable/.test(testInfo.title)) return;
  const save = {version:1,game:State.newGame(fixture(),1234),records:[],preferences:{name:'Mum',errors:true,motion:true}};
  if (testInfo.title.indexOf('finishing a puzzle') !== -1) {
    save.game.board = save.game.puzzle.solution.slice(); save.game.board[0] = 0;
    save.preferences.name = '<b>Mum</b>';
  }
  await page.addInitScript(raw => { if (!localStorage.getItem('sunday-sudoku.v1')) localStorage.setItem('sunday-sudoku.v1',raw); }, JSON.stringify(save));
});

test('a touch-friendly playable board loads without JavaScript errors', async ({page}) => {
  const errors=[]; page.on('pageerror',error => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading',{name:'Sunday Sudoku'})).toBeVisible();
  await page.locator('#resume-button').click();
  await expect(page.locator('.cell')).toHaveCount(81);
  await expect(page.locator('[data-number]')).toHaveCount(9);
  const box = await page.locator('.cell').first().boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(errors).toEqual([]);
});

test('pencil notes, undo, and entered numbers survive a reload', async ({page}) => {
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-cell="0"]').click();
  await page.locator('#notes-button').click();
  await expect(page.locator('#notes-button')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-number="3"]').click();
  await expect(page.locator('[data-cell="0"]')).toHaveAttribute('aria-label', /notes 3/);
  await page.reload(); await page.locator('#resume-button').click();
  await expect(page.locator('[data-cell="0"]')).toHaveAttribute('aria-label', /notes 3/);
  await page.getByRole('button',{name:'Undo',exact:true}).click();
  await expect(page.locator('[data-cell="0"]')).toHaveAttribute('aria-label', /empty/);
  await page.locator('#notes-button').click();
  await page.locator('[data-number="1"]').click();
  await page.reload(); await page.locator('#resume-button').click();
  await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sunday-sudoku.v1')));
  expect(saved.game.board[0]).toBe(1);
});

test('settings persist and dialogs trap keyboard focus', async ({page}) => {
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Player name').fill('Test Mum');
  await page.getByLabel('Animations').uncheck();
  await page.getByLabel('Highlight mistakes').uncheck();
  await page.getByRole('button',{name:'Save settings'}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('body')).toHaveClass('no-motion');
  await page.reload(); await page.locator('#resume-button').click();
  await page.locator('#settings-button').click();
  await expect(page.getByLabel('Player name')).toHaveValue('Test Mum');
  await expect(page.getByLabel('Highlight mistakes')).not.toBeChecked();
  await page.getByRole('button',{name:'Save settings'}).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#modal-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#settings-button')).toBeFocused();
});

test('finishing a puzzle celebrates and records exactly one local leaderboard entry', async ({page}) => {
  const errors=[]; page.on('pageerror',e => errors.push(e.message));
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-cell="0"]').click(); await page.locator('[data-number="1"]').click();
  await expect(page.getByRole('heading',{name:'Beautifully done!'})).toBeVisible();
  await expect(page.locator('.win-score')).not.toHaveText('0');
  await page.keyboard.press('Escape');
  await page.locator('#scores-button').click();
  await expect(page.locator('.score-row')).toHaveCount(1);
  await expect(page.locator('.record-person strong')).toHaveText('<b>Mum</b>');
  await expect(page.locator('.record-person b')).toHaveCount(0);
  await page.reload(); await page.locator('#scores-button').click();
  await expect(page.locator('.score-row')).toHaveCount(1);
  await page.getByRole('button',{name:'Expert',exact:true}).click();
  await expect(page.locator('.empty-scores')).toBeVisible();
  expect(errors).toEqual([]);
});

test('hints reveal a selected cell with an explicit cost and help explains the rules', async ({page}) => {
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-cell="0"]').click(); await page.locator('#hint-button').click();
  await expect(page.getByRole('heading',{name:'A little nudge?'})).toBeVisible();
  await expect(page.locator('.intro')).toContainText('100 points');
  await page.getByRole('button',{name:'Reveal number'}).click();
  await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sunday-sudoku.v1')));
  expect(saved.game.hints).toBe(1);
  await page.locator('#help-button').click();
  await expect(page.getByRole('heading',{name:'A few simple rules.'})).toBeVisible();
  await expect(page.locator('.help-section')).toHaveCount(3);
});

test('keyboard controls move selection, enter and erase numbers, undo, and pause', async ({page}) => {
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-cell="0"]').focus();
  await page.keyboard.press('1'); await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  await page.keyboard.press('Backspace'); await expect(page.locator('[data-cell="0"]')).toHaveText('');
  await page.keyboard.press('Control+z'); await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  await page.keyboard.press('ArrowRight'); await expect(page.locator('[data-cell="1"]')).toBeFocused();
  await page.keyboard.press('n'); await expect(page.locator('#notes-button')).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Space'); await expect(page.locator('#pause-cover')).toBeVisible();
  await page.keyboard.press('Space'); await expect(page.locator('#pause-cover')).not.toBeVisible();
});

test('new puzzles support all four levels and require confirmation before replacing progress', async ({page}) => {
  const errors=[]; page.on('pageerror',e => errors.push(e.message));
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-number="1"]').click();
  await page.getByRole('button',{name:'New puzzle',exact:true}).click();
  await expect(page.getByRole('heading',{name:'What feels right today?'})).toBeVisible();
  await expect(page.locator('.difficulty-option')).toHaveCount(4);
  await page.locator('[data-level="hard"]').click();
  await expect(page.getByRole('heading',{name:'Start a fresh puzzle?'})).toBeVisible();
  await page.getByRole('button',{name:'Keep playing'}).click();
  await expect(page.locator('#difficulty-label')).toHaveText('Easy');
  await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  await page.locator('#new-button').click(); await page.locator('[data-level="expert"]').click();
  await page.getByRole('button',{name:'Start new puzzle'}).click();
  await expect(page.locator('#difficulty-label')).toHaveText('Expert');
  for (const level of ['easy','medium','hard','expert']) {
    await page.locator('#difficulty-button').click(); await page.locator('[data-level="'+level+'"]').click();
    const saved=await page.evaluate(() => JSON.parse(localStorage.getItem('sunday-sudoku.v1')));
    expect(saved.game.puzzle.difficulty).toBe(level);
    expect(saved.game.puzzle.rating.difficulty).toBe(level);
    expect(saved.game.elapsedMs).toBeLessThan(1000);
    expect(saved.game.board).toEqual(saved.game.puzzle.givens);
  }
  expect(errors).toEqual([]);
});

test('closing a nested leaderboard restores focus to the menu button', async ({page}) => {
  await page.goto('./'); await page.locator('#scores-button').click();
  await page.getByRole('button',{name:'Hard',exact:true}).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#scores-button')).toBeFocused();
});

test('tablet menus expose accessible names even when their text is hidden', async ({page}) => {
  await page.goto('./');
  await expect(page.locator('#scores-button')).toHaveAccessibleName('Best scores');
  await expect(page.locator('#settings-button')).toHaveAccessibleName('Settings');
});

test('a fresh visitor gets a real unique easy puzzle without external scripts', async ({page}) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./'); await expect(page.locator('.cell')).toHaveCount(81);
  await expect(page.locator('#pause-cover')).not.toBeVisible();
  const saved=await page.evaluate(() => JSON.parse(localStorage.getItem('sunday-sudoku.v1')));
  const Core=require('../../engine.js');
  expect(Core.countSolutions(saved.game.puzzle.givens,2)).toBe(1);
  expect(Core.isValidComplete(saved.game.puzzle.solution)).toBe(true);
  expect(saved.game.puzzle.difficulty).toBe('easy');
  expect(errors).toEqual([]);
});
test('storage unavailable shows a warning but still allows play', async ({page}) => {
  await page.addInitScript(() => Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage denied');}}));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./'); await expect(page.locator('#save-status')).toContainText('Not saved');
  const empty=page.locator('.cell').filter({hasNot:page.locator('.digit')}).first();
  const index=await empty.getAttribute('data-cell');
  await empty.click(); await page.locator('[data-number="1"]').click();
  await expect(page.locator('[data-cell="'+index+'"]')).toHaveText('1');
  expect(errors).toEqual([]);
});
test('paused games and open dialogs do not accrue playing time', async ({page}) => {
  await page.clock.install(); await page.goto('./');
  const initial=await page.locator('#timer').textContent();
  await page.clock.fastForward(10000); await expect(page.locator('#timer')).toHaveText(initial);
  await page.locator('#resume-button').click(); await page.clock.fastForward(3000);
  const active=await page.locator('#timer').textContent(); expect(active).not.toBe(initial);
  await page.locator('#help-button').click(); await page.clock.fastForward(20000);
  await expect(page.locator('#timer')).toHaveText(active);
  await page.keyboard.press('Escape'); await page.locator('#pause-button').click();
  await page.clock.fastForward(20000); await expect(page.locator('#timer')).toHaveText(active);
});
test('portrait and landscape iPad layouts retain large cells with no horizontal overflow', async ({page}) => {
  for (const viewport of [{width:768,height:928},{width:1024,height:672},{width:1024,height:768}]) {
    await page.setViewportSize(viewport); await page.goto('./'); await page.locator('#resume-button').click();
    const metrics=await page.evaluate(() => {
      const cell=document.querySelector('.cell').getBoundingClientRect();
      const next=document.querySelector('#new-button').getBoundingClientRect();
      return {width:cell.width,height:cell.height,scroll:document.documentElement.scrollWidth,viewport:innerWidth,newBottom:next.bottom};
    });
    expect(metrics.width).toBeGreaterThanOrEqual(44); expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.viewport); expect(metrics.newBottom).toBeLessThan(viewport.height);
  }
});
test('the built game reloads offline and retains its saved move', async ({page,context}) => {
  test.skip(process.env.SITE_DIR !== 'dist', 'Offline shell is added by the production build');
  await page.goto('./'); await page.locator('#resume-button').click();
  await page.locator('[data-number="1"]').click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true); await page.reload(); await page.locator('#resume-button').click();
  await expect(page.locator('[data-cell="0"]')).toHaveText('1');
  await expect(page.locator('.cell')).toHaveCount(81);
  await context.setOffline(false);
});
