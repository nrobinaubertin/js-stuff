'use strict';

const DEFAULT_BASE_MS = 10 * 60 * 1000;
const DEFAULT_INC_MS  = 10 * 1000;

const state = {
    phase: 'idle',      // 'idle' | 'running' | 'paused' | 'over'
    active: null,       // 'top' | 'bottom' | null
    lastTickAt: null,
    intervalId: null,
    players: {
        top:    { timeMs: DEFAULT_BASE_MS, baseMs: DEFAULT_BASE_MS, incrementMs: DEFAULT_INC_MS, moves: 0 },
        bottom: { timeMs: DEFAULT_BASE_MS, baseMs: DEFAULT_BASE_MS, incrementMs: DEFAULT_INC_MS, moves: 0 },
    },
};

// --- Formatting ---

function formatTime(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
        return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    return m + ':' + String(s).padStart(2, '0');
}

function fitText(el) {
    const text = el.textContent;
    if (el.dataset.lastText === text) return;
    el.dataset.lastText = text;

    const container = el.parentElement;
    const maxW = container.clientWidth * 0.90;
    const maxH = container.clientHeight * 0.60;

    let lo = 8, hi = 500;
    el.style.fontSize = hi + 'px';
    while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = mid + 'px';
        if (el.scrollWidth <= maxW && el.offsetHeight <= maxH) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    el.style.fontSize = lo + 'px';
}

// --- DOM helpers ---

function getEl(id) { return document.getElementById(id); }

function setColorState(side, cls) {
    const area = getEl('player-' + side);
    area.classList.remove('state-idle', 'state-active', 'state-active-low', 'state-dead');
    area.classList.add(cls);
}

function render() {
    ['top', 'bottom'].forEach(function(side) {
        const p = state.players[side];

        // Time display
        const timeEl = getEl('time-' + side);
        timeEl.textContent = formatTime(p.timeMs);
        fitText(timeEl);

        // Move counter
        const movesEl = getEl('moves-' + side);
        movesEl.textContent = p.moves + (p.moves === 1 ? ' move' : ' moves');

        // Color state
        if (p.timeMs <= 0) {
            setColorState(side, 'state-dead');
        } else if (state.active === side && state.phase === 'running') {
            const low = p.timeMs <= p.baseMs * 0.1;
            setColorState(side, low ? 'state-active-low' : 'state-active');
        } else {
            setColorState(side, 'state-idle');
        }
    });

    // Pause button icon
    const pauseBtn = getEl('btn-pause');
    pauseBtn.innerHTML = state.phase === 'running' ? '&#9646;&#9646;' : '&#9654;';
}

// --- Game logic ---

function tick() {
    if (state.phase !== 'running') return;

    const now = Date.now();
    const dt = now - state.lastTickAt;
    state.lastTickAt = now;

    const p = state.players[state.active];
    p.timeMs = Math.max(0, p.timeMs - dt);

    if (p.timeMs <= 0) {
        state.phase = 'over';
    }

    render();
}

function startClock() {
    state.intervalId = setInterval(tick, 100);
}

function stopClock() {
    if (state.intervalId !== null) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
}

function endTurn(side) {
    const p = state.players[side];
    p.timeMs += p.incrementMs;
    p.moves += 1;
    state.active = side === 'top' ? 'bottom' : 'top';
    state.lastTickAt = Date.now();
    render();
}

function resetState(baseTop, incTop, baseBot, incBot) {
    stopClock();
    state.phase = 'idle';
    state.active = null;
    state.lastTickAt = null;
    state.players.top.baseMs       = baseTop;
    state.players.top.incrementMs  = incTop;
    state.players.top.timeMs       = baseTop;
    state.players.top.moves        = 0;
    state.players.bottom.baseMs    = baseBot;
    state.players.bottom.incrementMs = incBot;
    state.players.bottom.timeMs    = baseBot;
    state.players.bottom.moves     = 0;
    render();
    startClock();
}

function isInProgress() {
    return state.phase === 'running' || state.phase === 'paused' ||
        (state.phase === 'idle' && (state.players.top.moves > 0 || state.players.bottom.moves > 0));
}

// --- Custom confirm dialog ---

function customConfirm(message, onConfirm) {
    getEl('confirm-message').textContent = message;
    getEl('confirm-backdrop').classList.add('open');
    getEl('confirm-modal').classList.add('open');

    function close() {
        getEl('confirm-backdrop').classList.remove('open');
        getEl('confirm-modal').classList.remove('open');
        getEl('confirm-ok').removeEventListener('click', ok);
        getEl('confirm-cancel').removeEventListener('click', close);
        getEl('confirm-backdrop').removeEventListener('click', close);
    }
    function ok() { close(); onConfirm(); }

    getEl('confirm-ok').addEventListener('click', ok);
    getEl('confirm-cancel').addEventListener('click', close);
    getEl('confirm-backdrop').addEventListener('click', close);
}

// --- Event handlers ---

function handlePlayerTap(side) {
    if (state.phase === 'over') return;

    if (state.phase === 'idle') {
        // First tap starts the OTHER player's clock
        state.active = side === 'top' ? 'bottom' : 'top';
        state.phase = 'running';
        state.lastTickAt = Date.now();
        render();
        return;
    }

    if (state.phase === 'paused') return;
    if (state.phase === 'running' && state.active !== side) return;

    // It's your turn — end it
    endTurn(side);
}

function handlePause() {
    if (state.phase === 'running') {
        state.phase = 'paused';
        render();
    } else if (state.phase === 'paused') {
        state.phase = 'running';
        state.lastTickAt = Date.now();
        render();
    }
}

function handleReset() {
    customConfirm('Reset the clock?', function() {
        const pt = state.players.top;
        const pb = state.players.bottom;
        resetState(pt.baseMs, pt.incrementMs, pb.baseMs, pb.incrementMs);
    });
}

function handlePreset(baseMs, incMs) {
    function apply() {
        resetState(baseMs, incMs, baseMs, incMs);
        ['top', 'bottom'].forEach(function(side) {
            getEl('base-' + side).value = Math.round(baseMs / 60000);
            getEl('inc-'  + side).value = Math.round(incMs  / 1000);
        });
    }
    if (isInProgress()) {
        customConfirm('Apply preset and reset the clock?', apply);
    } else {
        apply();
    }
}

function closeSettings(side) {
    const panel = getEl('settings-' + side);
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    // Resume if we auto-paused on open and no other panel is open
    const otherSide = side === 'top' ? 'bottom' : 'top';
    if (state._pausedForSettings && !getEl('settings-' + otherSide).classList.contains('open')) {
        state.phase = 'running';
        state.lastTickAt = Date.now();
        state._pausedForSettings = false;
        render();
    }
}

function handleGear(side) {
    const panel = getEl('settings-' + side);
    const isOpen = panel.classList.contains('open');

    if (!isOpen) {
        // Populate inputs from state
        const p = state.players[side];
        getEl('base-' + side).value = Math.round(p.baseMs / 60000);
        getEl('inc-'  + side).value = Math.round(p.incrementMs / 1000);

        // Auto-pause
        if (state.phase === 'running') {
            state.phase = 'paused';
            state._pausedForSettings = true;
            render();
        }
        panel.classList.add('open');
    } else {
        closeSettings(side);
    }
}

function handleApply(side) {
    const baseMin = parseFloat(getEl('base-' + side).value) || 0;
    const incSec  = parseFloat(getEl('inc-'  + side).value) || 0;
    const baseMs  = Math.round(baseMin * 60000);
    const incMs   = Math.round(incSec  * 1000);

    const p = state.players[side];
    p.baseMs       = baseMs;
    p.incrementMs  = incMs;

    if (state.phase === 'idle' || state.phase === 'over') {
        p.timeMs = baseMs;
        p.moves  = 0;
    }

    closeSettings(side);
    render();
}

// --- Init ---

document.addEventListener('DOMContentLoaded', function() {
    // Player area taps
    ['top', 'bottom'].forEach(function(side) {
        getEl('player-' + side).addEventListener('click', function(e) {
            // Ignore clicks originating from gear button or settings panel
            if (e.target.closest('.gear-btn') || e.target.closest('.settings-panel')) return;
            handlePlayerTap(side);
        });

        getEl('gear-' + side).addEventListener('click', function(e) {
            e.stopPropagation();
            handleGear(side);
        });

        getEl('settings-' + side).addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Apply buttons
    document.querySelectorAll('.apply-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            handleApply(btn.dataset.side);
        });
    });

    // Close settings panel on outside click
    document.addEventListener('click', function(e) {
        ['top', 'bottom'].forEach(function(side) {
            if (!getEl('settings-' + side).classList.contains('open')) return;
            if (!e.target.closest('#settings-' + side) && !e.target.closest('#gear-' + side)) {
                closeSettings(side);
            }
        });
    });

    // Controls
    getEl('btn-pause').addEventListener('click', handlePause);
    getEl('btn-reset').addEventListener('click', handleReset);

    // Preset modal
    function openPresetModal() {
        getEl('preset-modal').classList.add('open');
        getEl('preset-backdrop').classList.add('open');
    }
    function closePresetModal() {
        getEl('preset-modal').classList.remove('open');
        getEl('preset-backdrop').classList.remove('open');
    }

    getEl('btn-presets').addEventListener('click', openPresetModal);
    getEl('preset-backdrop').addEventListener('click', closePresetModal);

    document.querySelectorAll('.preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            closePresetModal();
            handlePreset(parseInt(btn.dataset.base, 10), parseInt(btn.dataset.inc, 10));
        });
    });

    // Resize → refit text
    window.addEventListener('resize', function() {
        ['top', 'bottom'].forEach(function(side) {
            const el = getEl('time-' + side);
            delete el.dataset.lastText;
            fitText(el);
        });
    });

    // Initial render and start ticker
    render();
    startClock();
});
