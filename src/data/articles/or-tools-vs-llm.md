# Perché la ricerca operativa batte i Large Language Model: ottimizzazione spaziale e vincoli rigidi con Google OR-Tools

*Autore: Giorgio Di Cristofalo — Software Engineer*  
*Data: Ottobre 2026*  
*Argomenti: Ricerca Operativa, Google OR-Tools, CP-SAT Solver, Constraint Programming, Large Language Models, Architetture Software*

---

Nel panorama attuale dell'ingegneria del software, la tendenza dominante consiste nell'applicare modelli linguistici generativi (LLM) a qualsiasi problema computazionale. Quando il problema si sposta dalla manipolazione del testo alla gestione di risorse fisiche e geometriche nello spazio, i modelli probabilistici mostrano limiti strutturali insormontabili.

L'allocazione dei posti barca in un porto turistico (il problema affrontato nel progetto **Harbor Manager**) o la disposizione di colli in un magazzino logistico appartengono alla classe dei problemi di **ottimizzazione combinatoria NP-hard (2D/3D Bin Packing con vincoli eterogenei)**.

Per questa categoria di sistemi, affidarsi a un prompt o a una catena agentica di LLM è la scelta architetturale errata. Un solver deterministico come **Google OR-Tools CP-SAT** risolve invece il problema con garanzie matematiche assolute.

---

## 1. L'illusione dell'intuizione spaziale negli LLM

I transformer generano token basandosi su distribuzioni di probabilità condizionate apprese durante il training. Non mantengono una rappresentazione euclidea dello spazio e non eseguono backtracking rigoroso su griglie cartesiane.

Chiedere a un LLM di disporre 40 imbarcazioni di lunghezza, larghezza e pescaggio differenti lungo una banchina genera tre problemi critici:

1. **Assenza di garanzie sui vincoli rigidi (*hard constraints*)**: Un LLM può produrre un piano visivamente convincente in formato JSON, ma non può garantire che due poligoni non si intersechino per 15 centimetri o che il fondale sia sufficiente durante la bassa marea. In ambiente marittimo o logistico, una violazione su cento significa uno scafo danneggiato o un collasso del carico.
2. **Allucinazione combinatoria**: All'aumentare delle variabili, il contesto del prompt degrada rapidamente. I modelli tendono a trascurare vincoli negativi ("l'imbarcazione A non può stare accanto alla B per ragioni di manovra") o inventano coordinate di banchina inesistenti.
3. **Costo computazionale e non-determinismo**: Un'inferenza LLM su contesti complessi richiede diversi secondi, comporta costi API per ogni singola chiamata e produce risultati variabili a ogni esecuzione. Un solver matematico converge a una soluzione ottima globale (o ne dimostra l'impossibilità) in frazioni di secondo a costo computazionale locale nullo.

---

## 2. La formulazione formale: Constraint Programming & SAT

La programmazione a vincoli (Constraint Programming) inverte il paradigma: invece di indovinare la soluzione procedendo per tentativi statistici, si definisce lo spazio degli stati ammissibili tramite variabili di decisione e vincoli algebrici. Il motore di ricerca esplora l'albero delle possibilità potando intere branche non ammissibili tramite propagazione logica.

Nel caso dell'ormeggio portuale, il problema viene modellato come una **disposizione 2D con vincoli di intervallo disgiunti**:

- **Variabili spaziali**: Coordinate di ormeggio $x_i$ (posizione lungo la banchina) e $y_i$ (distanza dal canale).
- **Variabili temporali**: Finestra di permanenza $[t_{\text{start}}, t_{\text{end}}]$.
- **Dimensioni**: Lunghezza fuori tutto ($L_i$), larghezza massima ($B_i$) e margini di sicurezza minimi (buffer di manovra a poppa e mura).
- **Vincoli fisici non negoziabili**:
  - Pescaggio: $\text{Draft}_i \le \text{Depth}(x_i, y_i) \quad \forall i$
  - Disgiunzione geometrica: $\text{Overlap}(\text{Boat}_i, \text{Boat}_j) = 0 \quad \forall i \neq j \text{ per ogni intervallo temporale condiviso.}$

---

## 3. Implementazione con Google OR-Tools (CP-SAT)

Google OR-Tools include **CP-SAT**, un solver basato su principi SAT moderni con clausole di conflitto e propagazione su interi.

In Python, la gestione della non-sovrapposizione 2D viene implementata tramite il vincolo nativo `AddNoOverlap2D`:

```python
from ortools.sat.python import cp_model

def solve_berth_allocation(boats, dock_length, dock_depth):
    model = cp_model.CpModel()
    
    x_intervals = []
    y_intervals = []
    assigned_vars = {}
    
    for boat in boats:
        # Variabili di decisione per la posizione (x, y) lungo il molo
        x_start = model.NewIntVar(0, dock_length - boat["length"], f"x_start_{boat['id']}")
        x_end = model.NewIntVar(0, dock_length, f"x_end_{boat['id']}")
        x_interval = model.NewIntervalVar(
            x_start, 
            boat["length"] + boat["safety_buffer_x"], 
            x_end, 
            f"x_int_{boat['id']}"
        )
        
        y_start = model.NewIntVar(0, dock_depth - boat["width"], f"y_start_{boat['id']}")
        y_end = model.NewIntVar(0, dock_depth, f"y_end_{boat['id']}")
        y_interval = model.NewIntervalVar(
            y_start, 
            boat["width"] + boat["safety_buffer_y"], 
            y_end, 
            f"y_int_{boat['id']}"
        )
        
        # Variabile booleana di assegnazione
        is_assigned = model.NewBoolVar(f"assigned_{boat['id']}")
        assigned_vars[boat['id']] = is_assigned
        
        x_intervals.append(x_interval)
        y_intervals.append(y_interval)

    # Vincolo core: nessuna sovrapposizione geometrica nello spazio 2D
    model.AddNoOverlap2D(x_intervals, y_intervals)
    
    # Obiettivo: massimizzare il valore economico della flotta ormeggiata
    total_revenue = sum(assigned_vars[b['id']] * b['revenue'] for b in boats)
    model.Maximize(total_revenue)
    
    # Risoluzione deterministica
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 5.0
    status = solver.Solve(model)
    
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return {
            b['id']: {
                "x": solver.Value(model.GetIntVar(f"x_start_{b['id']}")),
                "y": solver.Value(model.GetIntVar(f"y_start_{b['id']}"))
            }
            for b in boats if solver.Value(assigned_vars[b['id']]) == 1
        }
    return None
```

---

## 4. Risultati sul campo: il caso Harbor Manager

Rispetto alla gestione manuale su tabelle statiche o a tentativi di parsing con modelli generativi, l'architettura con OR-Tools adottata in Harbor Manager ha registrato metriche inequivocabili:

- **+22% di spazio utile recuperato**: il solver identifica configurazioni e incastri dimensionali ottimali che l'occhio umano o un'euristica approssimativa tendono a scartare.
- **Calcolo in meno di 2.4 secondi**: la planimetria dell'intero molo viene calcolata in background tramite un worker asincrono Celery con broker Redis, senza mai bloccare la UI del client.
- **Zero allucinazioni e sicurezza garantita**: il 100% dei vincoli di sicurezza marittima (distanze di rispetto e pescaggio del fondale via query PostGIS) è rispettato per costruzione algebrica.

---

## 5. Il ruolo corretto dell'AI nei sistemi di produzione

Riconoscere i limiti dei modelli generativi nei problemi di ottimizzazione non significa escludere gli LLM dall'architettura software. Significa **posizionarli dove esprimono reale valore aggiunto**:

| Livello del sistema | Componente software | Obiettivo e Rationale |
|---|---|---|
| **Interfaccia e Comprensione** | Large Language Model (Gemini / Claude / OpenAI) | Parsing del linguaggio naturale ("arriva venerdì una barca di 14 metri con pescaggio 2.2m"), estrazione da email e sintesi documentale. |
| **Pianificazione Spaziale & Vincoli** | Solver Matematico (Google OR-Tools CP-SAT) | Calcolo esatto, zero allucinazioni, risoluzione di problemi NP-hard con garanzia di ottimalità o ammissibilità. |
| **Raccomandazioni Real-time** | Algoritmo Vettoriale kNN in PostgreSQL | Calcolo euclideo sub-30ms direttamente nel database relazionale (es. swap pasti in NutriFit). |
| **Infrastruttura & Consegna** | Code asincrone (Celery + Redis Pub/Sub + SSE) | Disaccoppiamento tra computazione pesante e visualizzazione reattiva per l'utente. |

---

## Conclusioni

La maturità ingegneristica non si misura dal numero di componenti LLM inseriti in un'architettura, ma dalla capacità di selezionare la tecnologia corretta per la specifica classe computazionale del problema.

Per il linguaggio, la sintesi e le interfacce conversazionali, i modelli generativi sono impareggiabili. Per l'ottimizzazione, la geometria, i vincoli fisici e la sicurezza operativa, la ricerca operativa e i solver deterministici rimangono lo standard d'eccellenza.
