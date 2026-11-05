// Embedded into rig-demo.html by build-zubek.py, so file:// needs no fetch.
// This is a review tool, not production animation code or an audio lip-sync API.
(() => {
  'use strict';
  const stage = document.querySelector('#stage');
  const select = document.querySelector('#pose');
  const status = document.querySelector('#status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let busy = false;
  let pose = 'hello';
  const puppet = () => stage.querySelector('svg');
  const part = name => puppet().querySelector(`[data-part="${name}"]`);

  function setEyes(state) {
    for (const side of ['l', 'r']) {
      for (const node of part(`eye-${side}`).querySelectorAll('[data-state]')) {
        node.setAttribute('visibility', node.dataset.state === state ? 'visible' : 'hidden');
      }
      part(`lid-${side}`).setAttribute('visibility', state === 'closed' ? 'visible' : 'hidden');
    }
    puppet().dataset.eyes = state;
  }

  function setMouth(state) {
    for (const node of part('mouth').querySelectorAll('[data-state]')) {
      node.setAttribute('visibility', node.dataset.state === state ? 'visible' : 'hidden');
    }
    puppet().dataset.mouth = state;
  }

  function setPose(next) {
    if (busy) return;
    const template = document.getElementById(`template-${next}`);
    if (!template) throw new Error(`Unknown pose: ${next}`);
    pose = next;
    select.value = next;
    stage.replaceChildren(template.content.cloneNode(true));
    setEyes(puppet().dataset.defaultEyes);
    setMouth(puppet().dataset.defaultMouth);
    document.querySelector('#pivots').textContent = [...puppet().querySelectorAll('[data-part]')]
      .map(node => `${node.dataset.part.padEnd(10)} ${node.dataset.pivot}`).join('\n');
    status.textContent = `${next}: ${puppet().dataset.eyes} eyes, closed mouth. Ready.`;
  }

  async function animate(node, frames, duration, easing = 'ease-in-out') {
    node.style.transformBox = 'view-box';
    const [x, y] = node.dataset.pivot.split(' ').map(Number);
    node.style.transformOrigin = `${x}px ${y}px`;
    const animation = node.animate(frames, { duration, easing, fill: 'none' });
    try {
      await animation.finished;
    } finally {
      animation.cancel();
    }
  }

  // A neutral WAAPI clock: avoids timers, network and animation packages.
  async function hold(duration) {
    const clock = stage.animate([{ opacity: 1 }, { opacity: 1 }], { duration });
    try {
      await clock.finished;
    } finally {
      clock.cancel();
    }
  }

  async function blink() {
    const previous = puppet().dataset.eyes;
    if (previous === 'closed') {
      setEyes('open');
      await hold(180);
      setEyes('closed');
      return;
    }
    if (!reduced.matches) {
      await Promise.all(['l', 'r'].map(side => animate(part(`eye-${side}`), [
        { transform: 'scaleY(1)' }, { transform: 'scaleY(0.12)' },
      ], 75)));
    }
    setEyes('closed');
    await hold(85);
    setEyes(previous);
    if (!reduced.matches) {
      await Promise.all(['l', 'r'].map(side => animate(part(`eye-${side}`), [
        { transform: 'scaleY(0.12)' }, { transform: 'scaleY(1)' },
      ], 95)));
    }
  }

  async function talk() {
    for (const state of ['closed', 'open-s', 'open-l', 'open-s', 'closed', 'open-s', 'closed']) {
      setMouth(state);
      await hold(state === 'closed' ? 145 : 110);
    }
  }

  const messages = {
    blink: 'Blink complete; the previous eye expression was restored.',
    talk: 'Talk preview complete: closed / open-s / open-l / closed.',
    wave: 'Wave complete at the left shoulder pivot (139, 263).',
    tilt: 'Head tilt complete at the neck pivot (201, 270).',
    hop: 'Hop complete; the ground shadow stayed fixed.',
    happy: 'Happy eyes enabled. Blink restores this expression; Reset restores the pose.',
  };

  async function run(action) {
    if (busy) return;
    if (action === 'reset') {
      setPose(pose);
      return;
    }
    if (reduced.matches && ['wave', 'tilt', 'hop'].includes(action)) {
      status.textContent = 'Reduced motion is enabled. Transform motion stayed still; expression buttons remain available.';
      return;
    }
    busy = true;
    select.disabled = true;
    const buttons = [...document.querySelectorAll('[data-action]')];
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = `${action} preview…`;
    try {
      if (action === 'blink') await blink();
      else if (action === 'talk') await talk();
      else if (action === 'wave') await animate(part('arm-l'), [
        { transform: 'rotate(0deg)' }, { transform: 'rotate(-18deg)', offset: 0.2 },
        { transform: 'rotate(9deg)', offset: 0.4 }, { transform: 'rotate(-18deg)', offset: 0.6 },
        { transform: 'rotate(6deg)', offset: 0.8 }, { transform: 'rotate(0deg)' },
      ], 1100);
      else if (action === 'tilt') await animate(part('head'), [
        { transform: 'rotate(0deg)' }, { transform: 'rotate(-8deg)', offset: 0.35 },
        { transform: 'rotate(6deg)', offset: 0.7 }, { transform: 'rotate(0deg)' },
      ], 1000);
      else if (action === 'hop') await animate(puppet().querySelector('[data-rig="character"]'), [
        { transform: 'translateY(0px)' }, { transform: 'translateY(5px)', offset: 0.15 },
        { transform: 'translateY(-25px)', offset: 0.5 }, { transform: 'translateY(0px)' },
      ], 650, 'cubic-bezier(.3,0,.55,1)');
      else if (action === 'happy') setEyes('happy');
      else throw new Error(`Unknown action: ${action}`);
      status.textContent = messages[action];
    } catch (error) {
      status.textContent = `Preview could not complete: ${error.message}`;
      setEyes(puppet().dataset.defaultEyes);
      setMouth('closed');
      throw error;
    } finally {
      busy = false;
      select.disabled = false;
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  select.addEventListener('change', () => setPose(select.value));
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      run(button.dataset.action).catch(error => console.error(error));
    });
  });
  document.querySelectorAll('[data-background]').forEach(button => {
    button.addEventListener('click', () => {
      stage.classList.remove('paper', 'canvas', 'crimson');
      stage.classList.add(button.dataset.background);
    });
  });
  setPose('hello');
  // Small inspection surface for the browser verification script.
  window.zubekRigDemo = Object.freeze({
    run, setPose,
    getState: () => ({ pose, busy, eyes: puppet().dataset.eyes, mouth: puppet().dataset.mouth }),
  });
})();
