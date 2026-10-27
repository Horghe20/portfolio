# Isometric Explainer — Architecture & Design Spec

## 1. Overview & Machine Statement

This document defines the specification for replacing the legacy block diagram (`NodeFlowchart.astro`) in Giorgio Di Cristofalo's portfolio hero section with an **Interactive Isometric Explainer Machine**, adhering strictly to the `isometric-explainer` specification.

### Canonical Statement (Rule 1)
> *"Una scheda di specifica requisiti viaggia lungo un carrello a binario attraverso quattro stazioni di lavorazione (Analisi & Vincoli, Architettura Core & Solver, Forge CI/CD, Gateway di Rilascio), e quel movimento rappresenta la trasformazione ingegneristica da bisogno di business a codice mission-critical verificato e rilasciato in produzione."*

---

## 2. Tier & Parts Budget (Rule 2)

- **Selected Tier**: **Figure** (~55 parts total, within 40–80 budget).
- **Assembly Breakdown**:
  - `Bench & Rails`: Basebed block, twin guide rails, end stops (6 parts).
  - `Carriage & Workpiece`: Moving platform, slider mounts, workpiece core block, dynamic status indicator (5 parts).
  - `Station 1 - MODEL & SPEC`: 2 structural upright columns, crossbar, vertical gauge probe, status light, pill label (6 parts).
  - `Station 2 - CORE & SOLVER`: 2 mounting pedestals, logic core block, tinted isometric glass dome, scanner needle, status light, pill label (8 parts).
  - `Station 3 - CI/CD FORGE`: Sturdy hydraulic press column, compression head piston, stamp anvil block, status light, pill label (7 parts).
  - `Station 4 - DEPLOY & OBSERVE`: Portal gateway arch (2 jambs, 1 lintel), optical laser sensor, output ramp, status light, pill label (7 parts).
  - `Annotations & Bench Shadows`: 4 cast shadows, 4 leader lines with pill badges, bench perspective grid (12 parts).

---

## 3. Station Mapping & Failure Modes (Rule 4)

| Index | Station Name | Pill Label | Engineering Purpose | Failure Mode (when broken via control) |
|---|---|---|---|---|
| 0 | **Modellazione** | `MODEL & SPEC` | Analisi dei vincoli di dominio, formalizzazione delle entità software e contratti dati. | *Specifiche ambigue: stallo alla partenza, assunzioni architetturali non verificate.* |
| 1 | **Core Engine** | `CORE & SOLVER` | Sviluppo architetturale (Django, Celery, OR-Tools, vettori kNN, integrazione AI tipizzata con validazione rigorosa). | *Collo di bottiglia: violazione vincoli matematici o timeout di elaborazione.* |
| 2 | **Automazione** | `CI/CD FORGE` | Collaudo con test unitari/integrazione, validazione contratti e impacchettamento container Docker. | *Regressione: la pressa rileva asserzioni fallite e blocca la build.* |
| 3 | **Produzione** | `DEPLOY & OBSERVE` | Gateway di rilascio con telemetria attiva, monitoraggio latenze, metriche e allarmi. | *Black box: assenza di osservabilità, mancata propagazione del traffico.* |

---

## 4. Pure Deterministic State Model (`src/lib/isometric/model.ts`)

### Contract
The state model has **no DOM, no window, and no clock**.
```ts
export interface SimConfig {
  brokenStation: null | 'model' | 'core' | 'forge' | 'deploy';
  labelsVisible: boolean;
  exploded: boolean;
}

export type StationStatus = 'idle' | 'active' | 'success' | 'failed';

export interface SimEvent {
  beat: number;
  progress: number; // 0.0 to 1.0 along the pipeline
  activeStationIndex: number | null;
  carriageX: number; // world units
  actuators: {
    probeY: number;      // Station 0 gauge (0=up, 1=down)
    coreScannerY: number;// Station 1 scanner (0=up, 1=down)
    forgePistonY: number;// Station 2 press (0=up, 1=down)
    deployGateAlpha: number; // Station 3 sensor beam (0 to 1)
  };
  stationStatuses: [StationStatus, StationStatus, StationStatus, StationStatus];
  workpieceState: 'raw' | 'modeled' | 'compiled' | 'verified' | 'deployed' | 'fault';
  simulatedTimeMs: number;
  readoutKey: string; // key in i18n
  isTerminal: boolean;
  isFailure: boolean;
}

export interface SimSummary {
  totalBeats: number;
  success: boolean;
  failureStation: string | null;
  simulatedLatencyMs: number;
  events: SimEvent[];
}
```

### Deterministic Timeline (`simulate(config)`)
1. **Beats 0-2**: Spawn raw payload at `MODEL & SPEC`. Gauge probe descends, models constraints.
2. **Beats 3-6**: Transit to `CORE & SOLVER`. Glass chamber lights up, scanner optimizes algorithms. (If Station 1 broken -> failure event at Beat 5).
3. **Beats 7-10**: Transit to `CI/CD FORGE`. Hydraulic press stamps and verifies test suite. (If Station 2 broken -> press rejects payload at Beat 9).
4. **Beats 11-13**: Transit to `DEPLOY & OBSERVE`. Gateway beam scans, production metric registers. (If Station 3 broken -> gateway locks shut at Beat 12).
5. **Beat 14**: Terminal state reached (Success or Failure).

---

## 5. Isometric Geometry & Projection Engine (`src/lib/isometric/geometry.ts`)

- **Camera**: Elevation $\theta = 30^\circ$, Isometric Azimuth $\phi = 30^\circ$ / standard isometric projection.
  $$X_{svg} = (X - Y) \cdot \cos(30^\circ)$$
  $$Y_{svg} = (X + Y) \cdot \sin(30^\circ) - Z$$
- **Depth Sorting**:
  $$\text{depthKey} = (X + Y) + Z \cdot 0.01$$
- **Solids (`inkSolid`)**:
  - Top face: Base tone / highlight (e.g. 15% lightness boost).
  - Right face: Mid tone (unshaded material).
  - Left face: Dark tone (15% shadow absorption).
  - Silhouette: $2.5\text{px}$ perimeter path stroke in contrast ink (`var(--color-border)` or solid dark ink).
  - Cast drop shadows on bench surface.
- **Explode Pose**:
  - Each assembly shifts along its explosion vector when `exploded = true` using damped spring values (stiffness: 64, damping: 14.2).

---

## 6. Component Architecture & UI Controls (`IsometricExplainer.astro`)

- **Toolbar Controls**:
  - **Run / Pause (▶ / ⏸)**
  - **Step (⏭)**
  - **Break / Repair Station dropdown or buttons (⚡ / 🛠)**
  - **Explode View toggle (⛶)**
  - **Labels toggle (🏷)** with `?labels=0` parameter check
  - **Reset (↺)**
- **SVG Stage**:
  - Scalable vector with `viewBox="0 0 920 480"`
  - `role="img"` with localized `aria-label`
  - Integrated in Hero replacing `NodeFlowchart`
- **Telemetry Footer**:
  - Real-time station activity readout
  - Metric counters (Simulated Execution Latency, Test Coverage, Pipeline State)
  - `aria-live="polite"` region for accessibility announcements
  - Mandatory disclaimer: *"Questa è una simulazione: le durate e le metriche rappresentano costi di esecuzione fissati, non benchmark fisici."*

---

## 7. Testing & Verification

1. **Deterministic State Model Tests (`src/lib/isometric/model.test.ts`)**:
   - Verify `simulate()` returns identical event sequences given the same config.
   - Verify all 4 broken station scenarios accurately halt at expected beats with correct failure flags.
   - Verify zero errors across all combinatorial configurations.
2. **Visual & Responsive Verification**:
   - Desktop and Mobile widths rendered without horizontal overflow.
   - Light and dark themes matching portfolio CSS variables.
   - Keyboard navigation working for all toolbar buttons.
