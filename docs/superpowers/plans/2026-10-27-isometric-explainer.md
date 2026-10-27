# Isometric Explainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive isometric explainer machine component following the `isometric-explainer` specification and replace the legacy block flowchart in the portfolio Hero section.

**Architecture:** Pure deterministic TypeScript state model (`model.ts`) with no DOM and no clock driving SVG isometric rendering (`geometry.ts` with 30° elevation, 3-tone `inkSolid` materials, cast drop shadows, glass reflections, and pill labels), encapsulated in an Astro component (`IsometricExplainer.astro`) with toolbar controls, URL synchronization, and accessible telemetry.

**Tech Stack:** Astro 5, TypeScript, Node.js test runner (`node --test`), SVG, CSS variables.

**Spec:** `docs/superpowers/specs/2026-10-27-isometric-explainer-design.md`

## Global Constraints

- Elevation is exactly 30 degrees.
- Part count in the Figure tier: between 40 and 80 parts.
- State model is pure and deterministic: `simulate(config)` returns identical events given the same config.
- Single accent color at any given moment (`var(--color-accent)`), following the active station.
- Exactly one canonical machine statement: *"Una scheda di specifica requisiti viaggia lungo un carrello a binario attraverso quattro stazioni di lavorazione (Analisi & Vincoli, Architettura Core & Solver, Forge CI/CD, Gateway di Rilascio), e quel movimento rappresenta la trasformazione ingegneristica da bisogno di business a codice mission-critical verificato e rilasciato in produzione."*
- Mandatory simulation disclaimer: *"Questa è una simulazione: le durate e le metriche rappresentano costi di esecuzione fissati, non benchmark fisici."* / *"This is a simulation. Durations and metrics represent fixed execution costs, not hardware benchmarks."*
- Responsive: stacks on mobile without horizontal scrolling.

---

### Task 1: Type Definitions & Pure Deterministic State Model

**Files:**
- Create: `src/lib/isometric/types.ts`
- Create: `src/lib/isometric/model.ts`
- Test: `tests/isometric/model.test.ts`

**Interfaces:**
- Produces: `SimConfig`, `SimEvent`, `SimSummary`, `simulate(config: SimConfig): SimSummary`

- [ ] **Step 1: Write the failing test for the deterministic state model**

Create `tests/isometric/model.test.ts`:
```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from '../../src/lib/isometric/model.ts';
import type { SimConfig } from '../../src/lib/isometric/types.ts';

test('simulate() is pure and returns identical results for identical configs', () => {
  const config: SimConfig = {
    brokenStation: null,
    labelsVisible: true,
    exploded: false,
  };
  const run1 = simulate(config);
  const run2 = simulate(config);
  assert.deepStrictEqual(run1, run2);
  assert.equal(run1.success, true);
  assert.equal(run1.events.length > 10, true);
});

test('simulate() accurately simulates station failure when brokenStation is set', () => {
  const config: SimConfig = {
    brokenStation: 'forge',
    labelsVisible: true,
    exploded: false,
  };
  const result = simulate(config);
  assert.equal(result.success, false);
  assert.equal(result.failureStation, 'forge');
  const lastEvent = result.events[result.events.length - 1];
  assert.equal(lastEvent.isFailure, true);
  assert.equal(lastEvent.stationStatuses[2], 'failed');
});

test('simulate() combinatorial sweep produces deterministic outcomes without errors', () => {
  const stations: (SimConfig['brokenStation'])[] = [null, 'model', 'core', 'forge', 'deploy'];
  for (const st of stations) {
    for (const exploded of [false, true]) {
      const res = simulate({ brokenStation: st, labelsVisible: true, exploded });
      assert.equal(typeof res.totalBeats, 'number');
      assert.equal(res.events.length > 0, true);
      if (st === null) {
        assert.equal(res.success, true);
      } else {
        assert.equal(res.success, false);
        assert.equal(res.failureStation, st);
      }
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/isometric/model.test.ts`
Expected: FAIL (file or module not found)

- [ ] **Step 3: Implement `types.ts` and `model.ts`**

Create `src/lib/isometric/types.ts`:
```ts
export type StationId = 'model' | 'core' | 'forge' | 'deploy';

export interface SimConfig {
  brokenStation: StationId | null;
  labelsVisible: boolean;
  exploded: boolean;
}

export type StationStatus = 'idle' | 'active' | 'success' | 'failed';

export interface SimEvent {
  beat: number;
  progress: number; // 0.0 to 1.0
  activeStationIndex: number | null;
  carriageX: number; // in world coordinates along the rail
  actuators: {
    probeY: number;       // Station 0 (0=retracted, 1=contact)
    coreScannerY: number; // Station 1 (0=up, 1=scanning)
    forgePistonY: number; // Station 2 (0=up, 1=pressed)
    deployBeam: number;   // Station 3 (0=off, 1=active laser)
  };
  stationStatuses: [StationStatus, StationStatus, StationStatus, StationStatus];
  workpieceState: 'raw' | 'modeled' | 'compiled' | 'verified' | 'deployed' | 'fault';
  simulatedTimeMs: number;
  readoutKey: string;
  isTerminal: boolean;
  isFailure: boolean;
}

export interface SimSummary {
  totalBeats: number;
  success: boolean;
  failureStation: StationId | null;
  simulatedLatencyMs: number;
  events: SimEvent[];
}
```

Create `src/lib/isometric/model.ts` with pure deterministic timeline generator:
- Station 0 (`model`): beats 0 to 2
- Station 1 (`core`): beats 3 to 6
- Station 2 (`forge`): beats 7 to 10
- Station 3 (`deploy`): beats 11 to 13
- If `brokenStation === 'model'`, aborts at beat 2 with failure.
- If `brokenStation === 'core'`, aborts at beat 5 with failure.
- If `brokenStation === 'forge'`, aborts at beat 9 with failure.
- If `brokenStation === 'deploy'`, aborts at beat 12 with failure.
- Otherwise reaches beat 14 with success.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/isometric/model.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/isometric/types.ts src/lib/isometric/model.ts tests/isometric/model.test.ts
git commit -m "feat(isometric): implement pure deterministic state model and tests"
```

---

### Task 2: Isometric Geometry Engine & SVG Primitives

**Files:**
- Create: `src/lib/isometric/geometry.ts`
- Test: `tests/isometric/geometry.test.ts`

**Interfaces:**
- Consumes: `src/lib/isometric/types.ts`
- Produces:
  - `projectIso(x: number, y: number, z: number): { x: number; y: number; depth: number }`
  - `inkBox(x: number, y: number, z: number, w: number, d: number, h: number, options: BoxOptions): string`
  - `castShadow(x: number, y: number, w: number, d: number): string`
  - `pillLabel(text: string, x: number, y: number, z: number, active: boolean): string`

- [ ] **Step 1: Write test for isometric projection & inkBox generation**

Create `tests/isometric/geometry.test.ts`:
```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { projectIso, inkBox, castShadow } from '../../src/lib/isometric/geometry.ts';

test('projectIso projects 3D coordinates to 30° elevation isometric plane', () => {
  const origin = projectIso(0, 0, 0);
  assert.equal(origin.x, 0);
  assert.equal(origin.y, 0);

  const pt = projectIso(100, 100, 0);
  assert.equal(pt.x, 0); // (X - Y) * cos(30) == 0
  assert.ok(pt.y > 0);
});

test('inkBox generates SVG paths with top, left, right faces and silhouette', () => {
  const boxSvg = inkBox(0, 0, 0, 40, 40, 20, {
    fillTop: '#f0f0f0',
    fillLeft: '#d0d0d0',
    fillRight: '#e0e0e0',
    stroke: '#333333',
  });
  assert.ok(boxSvg.includes('<polygon'));
  assert.ok(boxSvg.includes('stroke="#333333"'));
});

test('castShadow generates drop shadow polygon on the ground plane', () => {
  const shadowSvg = castShadow(10, 10, 40, 40);
  assert.ok(shadowSvg.includes('<polygon'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/isometric/geometry.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/isometric/geometry.ts`**

Implement:
- Standard 30° elevation math:
  $$x_{2d} = (x - y) \cdot \frac{\sqrt{3}}{2}$$
  $$y_{2d} = (x + y) \cdot 0.5 - z$$
  $$\text{depth} = x + y + z \cdot 0.01$$
- `inkBox`: renders top face, front-left face, front-right face with distinct lighting tones, crisp inner strokes and heavy silhouette stroke.
- `castShadow`: calculates offset projected quad with soft warm gray fill.
- `glassDome`: renders translucent walls with specular reflection streaks (`<path d="..." stroke="rgba(255,255,255,0.7)" />`).
- `pillBadge`: renders pill shaped badge (`<rect rx="10" ...>` + text + leader connector line).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/isometric/geometry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/isometric/geometry.ts tests/isometric/geometry.test.ts
git commit -m "feat(isometric): implement isometric projection and inkSolid geometry engine"
```

---

### Task 3: Bilingual i18n Translations & Copy

**Files:**
- Modify: `src/i18n/translations.ts`

**Interfaces:**
- Consumes: translation schema
- Produces: keys under `t('hero.explainer.*')` in Italian and English

- [ ] **Step 1: Add translation keys for isometric explainer**

In `src/i18n/translations.ts`:
Add keys for `it` and `en`:
- `tag`: "SIMULATORE ISOMETRICO DELLA PIPELINE" / "ISOMETRIC PIPELINE SIMULATOR"
- `statement`: Canonical machine statement
- `simulationDisclaimer`: "Questa è una simulazione: le durate e le metriche rappresentano costi di esecuzione fissati, non benchmark fisici." / "This is a simulation. Durations and metrics represent fixed execution costs, not hardware benchmarks."
- Station names & subtitles:
  - `station0`: "1. Analisi & Vincoli" / "1. Analysis & Constraints" (`MODEL & SPEC`)
  - `station1`: "2. Core Engine & Solver" / "2. Core Engine & Solver" (`CORE & SOLVER`)
  - `station2`: "3. CI/CD Forge" / "3. CI/CD Forge" (`CI/CD FORGE`)
  - `station3`: "4. Deploy & Osservabilità" / "4. Deploy & Observability" (`DEPLOY & OBSERVE`)
- Readout messages for each beat (ingestion, analyzing, solving, compiling, testing, deployed, error states).
- Toolbar button labels & tooltip hints: Play, Pause, Step, Break, Repair, Explode, Labels, Reset.

- [ ] **Step 2: Verify TypeScript compiles without type errors**

Run: `npx astro check` or check imports.
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/i18n/translations.ts
git commit -m "feat(i18n): add comprehensive translations for isometric explainer machine"
```

---

### Task 4: Interactive Astro Component (`IsometricExplainer.astro`)

**Files:**
- Create: `src/components/IsometricExplainer.astro`
- Modify: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `src/lib/isometric/model.ts`, `src/lib/isometric/geometry.ts`, `src/i18n/*`
- Produces: Drop-in replacement for `NodeFlowchart.astro` in `Hero.astro`

- [ ] **Step 1: Build `IsometricExplainer.astro`**

Implement:
- Static SVG rendering generated with `geometry.ts` (Bench, Rails, Station Uprights, AI Glass Chamber, Hydraulic Press, Gateway Arch, Shadows).
- Dynamic SVG movers with `data-live` hooks (`#carriage-group`, `#probe-actuator`, `#scanner-actuator`, `#press-actuator`, `#gateway-beam`, status lamps).
- Upper Toolbar:
  - Play / Pause button
  - Step button
  - Break Station toggle dropdown (Tutto OK, Rompi Model, Rompi Core, Rompi Forge, Rompi Deploy)
  - Explode 3D Toggle
  - Labels Toggle
  - Reset button
- Lower Telemetry strip:
  - Live narrative status log (`id="explainer-readout"`)
  - Latency / step metrics display
  - "The big idea" summary
  - Simulation disclaimer
  - `aria-live="polite"` accessible announcement container
- Client-side deterministic timeline script:
  - Pre-computes `simulate(config)` on config change.
  - Smooth animation translation along keyframes.
  - URL parameter read/write (`?labels=0&broken=...&exploded=1`).
  - Full keyboard accessibility (Space=Play/Pause, Right=Step, R=Reset, E=Explode).
  - Clean touch handling on mobile.

- [ ] **Step 2: Integrate `IsometricExplainer.astro` into `Hero.astro`**

Replace `<NodeFlowchart highlightedAudience="all" />` with `<IsometricExplainer />`.

- [ ] **Step 3: Verify build with Astro**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/IsometricExplainer.astro src/components/Hero.astro
git commit -m "feat(hero): replace legacy flowchart with interactive isometric explainer machine"
```

---

### Task 5: End-to-End Verification & Visual Testing

**Files:**
- Verification only

- [ ] **Step 1: Run unit tests**

Run: `node --test tests/isometric/*.test.ts`
Expected: All tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Astro build succeeds cleanly.

- [ ] **Step 3: Visual inspection via browser subagent or local dev server**

Verify:
- Desktop view fits nicely in the Hero without clipping.
- Mobile view stacks cleanly with zero horizontal scroll.
- Clicking "Rompi Forge" triggers the red error state at Station 3 with descriptive telemetry.
- Explode view radially expands assemblies smoothly.
- Labels toggle hides/shows pill badges cleanly.
- Dark and light themes render beautifully with CSS variable tones.

- [ ] **Step 4: Final commit**

```bash
git commit -m "chore: complete isometric explainer verification and integration"
```
