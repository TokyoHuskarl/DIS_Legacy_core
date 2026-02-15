# DIS:Legacy Core TPC Codebase Guide (AI-Oriented)

This document is designed as a **high-signal reference for AI/code agents** working on DIS:Legacy's TPC source.
It focuses on *where logic lives*, *how compile units are wired*, and *how to make safe edits without breaking unrelated systems*.

---

## 1. What this repository is

- This repository contains the TPC source of DIS:Legacy core logic (`source/`).
- The largest gameplay systems live in `source/Dracore/` as many module files split by domain (agent, battle, mission, UI, etc.).
- Compilation is done by running TPC (`tpc.exe`) over a set of module entry files from batch scripts.

Core compile orchestrators:
- `source/compile_all.bat`: full build pipeline.
- `source/Dracore/compile_core.bat`: Dracore gameplay modules.
- `source/preset_databases/compile_database.bat`: preset database modules.

---

## 2. Build & compile topology (important)

### 2.1 Full build

`source/compile_all.bat`:
1. Sets `MAKE_TYPE = 1` in `source/PSEUDO_ARG`.
2. Creates backups (`headers/MAKE_BACKUP_ALLE.tpc`).
3. Runs module compilers:
   - `Dracore/compile_core.bat`
   - `preset_databases/compile_database.bat`
   - `Toolbox/compile_toolbox.bat`

### 2.2 Dracore compile order (execution contract)

`source/Dracore/compile_core.bat` compiles in this order:
1. `module_core_Game_init.tpc`
2. `module_core_Game_ui_general.tpc`
3. `module_core_Game_items_general.tpc`
4. `module_core_Game_misc_general.tpc`
5. `module_core_Game_scripts_general.tpc`
6. `module_core_RTS_main.tpc`
7. `module_core_RTS_drawing.tpc`
8. `module_core_RTS_agent_general.tpc`
9. `module_core_RTS_control_general.tpc`
10. `module_core_RTS_ui_general.tpc`
11. `module_core_RTS_mission_general.tpc`
12. `module_core_RTS_cohort_general.tpc`
13. `module_core_RTS_battlesystem_general.tpc`
14. `module_core_RTS_sightsystem_general.tpc`
15. `module_core_RTS_pathfinding_general.tpc`

**Why this matters:**
- These files are primary entry points to the compiled LDB event graph.
- If a feature appears "missing", first check whether its entry module is in compile order.

---

## 3. Global configuration and memory contracts

### 3.1 `header_common.tpc` is the first file to understand

`source/headers/header_common.tpc` controls:
- Build mode switching via `MAKE_TYPE` and `PSEUDO_ARG`.
- Blueprint and output directory for TPC compile (`#directory`, `#blueprint.*`).
- Global constants (`Agents_Limit`, `TEAMSIZE_SYSTEM_LIMIT`, etc.).
- Shared addresses and var/switch contracts consumed by many modules.

If behavior looks globally inconsistent, debug here first.

### 3.2 Major shared headers

- `header_agent.tpc`
  - Agent CSV schema constants (`CSVELM_AGENT_*`).
  - Agent generation helpers and includes (`module_core_RTS_agent_generate_basic.tpc`, skill funcs, order funcs).
- `header_scripts.tpc`
  - JS bridge constants/queues and script execution flags.
- `header_battlesystem.tpc`, `header_drawing.tpc`, `header_ui.tpc`, `header_mission.tpc`, etc.
  - Domain-level function/macros and memory conventions.

**Rule of thumb:**
- If you need to edit shared pointer offsets, ID contracts, or CSV field indexes, do it in headers first, then check all consumers.

---

## 4. Dracore module map (where to edit)

### 4.1 Game-level modules (meta/system)

- `module_core_Game_init.tpc`
  - Initial memory/constant bootstrapping and startup setup.
- `module_core_Game_ui_general.tpc`
  - Includes UI submodules (`_ui_system`, `_ui_escape_menu`, `_ui_inventory`).
- `module_core_Game_items_general.tpc`
  - Item system core + item function includes.
- `module_core_Game_misc_general.tpc`
  - Lightweight misc/global event logic.
- `module_core_Game_scripts_general.tpc`
  - Script/dialog glue and script-adjacent event processing.

### 4.2 RTS runtime core

- `module_core_RTS_main.tpc`
  - High-frequency world loop and central per-frame behaviors.
  - Includes refresh/land behavior/projectile/effects helpers.
- `module_core_RTS_drawing.tpc`
  - Runtime unit drawing and animation paths.

### 4.3 Agents / AI / battle

- `module_core_RTS_agent_general.tpc`
  - Agent action events, spawn events, attack event wiring, AI casting/search entry points.
- `module_core_RTS_battlesystem_general.tpc`
  - Morale, hit checks, damage calculation, remove-agent flow.
- `module_core_RTS_ai_general.tpc`
  - Very small entry shim (actual logic is split to included files elsewhere).

### 4.4 Controls, UI, mission, formations, vision, pathfinding

- `module_core_RTS_control_general.tpc`
  - Keyboard/mouse/move-order/map-edit/player helper integration.
- `module_core_RTS_ui_general.tpc`
  - Minimap, central monitor, unit management, UI mouse handlers.
- `module_core_RTS_mission_general.tpc`
  - Mission init/map/weather/simple triggers and mission-level script hooks.
- `module_core_RTS_cohort_general.tpc`
  - Cohort / group behavior and related helpers.
- `module_core_RTS_sightsystem_general.tpc`
  - Vision/fog-related helpers and picture-edit linked logic.
- `module_core_RTS_pathfinding_general.tpc`
  - Pathfinding entry + algorithm include.

---

## 5. Event-centric architecture notes (CEV-heavy)

The codebase is CEV/event-driven. A typical pattern:
1. `cev .id(...)` defines an event entry.
2. Body calls helper functions/macros in included files.
3. Shared `v[]`, `s[]`, `t[]` addresses act as implicit interfaces.

Implications for AI edits:
- **Never assume local scope safety.** A `v[XXXX]` slot may be used by many files.
- Prefer existing wrappers/macros rather than direct ad-hoc rewrites.
- Preserve legacy CEV IDs unless migration is explicitly planned.

---

## 6. High-value edit playbooks

### 6.1 Add or tweak a unit parameter sourced from CSV/JSON

1. Inspect schema constants in `header_agent.tpc` (`CSVELM_AGENT_*`).
2. Inspect generation/import paths in:
   - `module_core_RTS_agent_generate_basic.tpc`
   - data references in `reference/ref_DIS_data.md`
3. Update parse logic and any downstream use sites (combat, UI, tooltip).
4. Sanity check spawn path (`cevID_Agent_Generate_Basic`, finish event).

### 6.2 Adjust combat formulas

Primary files:
- `module_core_RTS_battlesystem_damage_calculation.tpc`
- `module_core_RTS_battlesystem_hitchecks.tpc`
- `module_core_RTS_battlesystem_morale.tpc`

Then verify call chains from:
- `module_core_RTS_agent_general.tpc`
- `module_core_RTS_battlesystem_general.tpc`

### 6.3 Touch pathfinding behavior

Primary files:
- `module_core_RTS_pathfinding_general.tpc`
- `module_core_RTS_pathfinding_algorithm.tpc`
- `header_pathfinding.tpc`

Check movement callers in:
- `module_core_RTS_agent_moveorder.tpc`
- control modules that emit move orders.

### 6.4 UI behavior changes (RTS HUD/minimap/selection)

Primary files:
- `module_core_RTS_ui_general.tpc`
- `module_core_RTS_ui_minimap.tpc`
- `module_core_RTS_ui_mouse.tpc`
- `module_core_RTS_ui_central_monitor.tpc`

Also inspect interaction points in:
- `module_core_RTS_control_mouse.tpc`
- `module_core_RTS_control_selecting_agents.tpc`


## 6.5 Verified function/event index (no speculation)

This section lists only names/IDs that are directly confirmed in source files.
If a behavior is not explicit from source, it is intentionally omitted.

### A) Core frame loop and runtime managers (`module_core_RTS_main.tpc`)

Confirmed main loop events:
- `cev .id(18) "Main:Agent per1f"`
- `cev .id(17) "Main:Agent per2f"`
- `cev .id(16) "Main:Agent per3f"`
- `cev .id(15) "Main:Agent per6f"`

Confirmed runtime manager events:
- `cev .id(21) "Main:Projectiles Manager"`
- `cev .id(22) "Main:Normal Effect"`
- `cev .id(23) "Main:Particle Effect"`
- `cev .id(24) "Main:Gib Effect"`
- `cev .id(68) "Main:Agents Collision"`
- `cev .id(71) "Main:Frame Count"`

Confirmed helper functions/macros in this file:
- `macro_HPSPreg`
- `agent_sprite_RGB_check`
- `func_set_tileflag_in_square_range`
- `func_main_extract_agent_vars` / `func_main_save_agent_vars`
- `func_blink_set` / `func_blink_progress`
- `main_agent_footsound`
- `MAIN_agent_check_range`
- `agent_behavior_effect_and_motion_check`
- `MAIN_STATIC_register_globalqueue`

### B) Agent generation / combat action entrypoints (`module_core_RTS_agent_general.tpc`)

Confirmed agent/combat CEV entrypoints:
- `cev .id(11) "Agent:Search Target AI"`
- `cev .id(34) "AgentAct:MeleeAA"`
- `cev .id(36) "AgentAct:RangedAA_Shot"`
- `cev .id(cevID_Agent_Generate_Basic) "Agent:Spawn Basic"`
- `cev .id(cevID_Agent_Generate_Finish) "Agent:Spawn Finish"`

Confirmed legacy-compatible utility entrypoints still present:
- `cev .id(1740) "-Alert Order func v2v3"`
- `cev .id(1742) "-Def Order func v2v3"`
- `cev .id(2007) "LegMacro:SkillCDck"`
- `cev[2160] "GenWallprep"`
- `cev[410] "Adjustment:DIS Dragons"`

### C) Control/UI/Mission entrypoints

`module_core_RTS_control_general.tpc` (confirmed examples):
- Mouse/keyboard and selection: IDs `47`, `49`, `50`, `52`
- Skill key handlers: IDs `58` (Q), `59` (W), `60` (E), `61` (R)
- Move/build/search utilities: IDs `33`, `51`, `1901`, `2098`, `2099`, `795`, `796`, `797`

`module_core_RTS_ui_general.tpc` (confirmed examples):
- Common UI/minimap/monitor/unit panel: IDs `26`, `27`, `28`, `29`
- Mouse observer: ID `45`
- Description/log/resource helpers: IDs `70`, `84`, `199`, `792`, `1100`, `1101`, `1200`, `1924`, `1925`

`module_core_RTS_mission_general.tpc` (confirmed examples):
- Mission lifecycle: IDs `2` (init), `4` (start), `3` (end)
- Mission map/system: IDs `1800`, `1793`, `1795`, `1804`, `67`, `2133`, `2121`
- Script/JS bridge events present: IDs `1815`, `1830`

### D) Header-level helper functions/macros worth tracing

`header_common.tpc` includes widely reused helpers such as:
- `file_output_cooldown`, `func_force_crash`
- `func_extract_agent_vars`, `func_save_extracted_agent_vars`
- `macro_check_agent_is_killed`, `func_init_array`
- `macro_cord_diff`, `macro_cord_diff_abs`
- `func_general_camera_move`, `getQstr`, `readLangFile`

`header_agent.tpc` includes agent-related helpers/macros such as:
- `macro_SkillCDck`
- `macro_get_agent_MetaTeam_into_var`
- `get_agentName_to_inputstr`
- `macro_set_agent_AI_decision_Sub_WEP_Type`
- `save_agent_vars`

### E) How to expand this index safely

When extending this section, prefer this exact workflow:
1. Find symbol declaration (`cev` / `__fn`) in the primary module/header.
2. Confirm callsite(s) with `rg` before describing responsibility.
3. If intent is not obvious from code/comments, document only "name + location", not guessed semantics.

---

## 6.6 Legacy scope note (`raw_ldb_BETA4`)

- `raw_ldb_BETA4` is legacy and not used for current maintenance in this repository context.
- For AI/code-agent analysis, skip `raw_ldb_BETA4` and focus on active `source/` modules and headers documented above.

---


## 6.7 Development-status markers (explicitly stated in source)

This subsection records places where source comments explicitly signal transition/legacy state.
(Again: no inferred status beyond explicit text.)

- `module_core_RTS_mission_general.tpc` contains `OBSOLETE!!!!` comments near old script interpreter area.
- `module_core_RTS_agent_general.tpc` marks some legacy CEV blocks as `will be abolished soon(TM)`.
- `module_core_Game_scripts_general.tpc` notes `header_scripts_functions.tpc` include as `will be gone soon (TM)`.

How to use this information:
- Prefer stable entrypoints for new features unless you intentionally work on migration layers.
- If you must touch marked zones, keep changes minimal and annotate why they are still needed.

---

## 7. Safety checklist before committing changes

1. **Include graph check**
   - Confirm edited file is compiled by some entry module.
2. **Address contract check**
   - If you changed constants/addresses, scan all references.
3. **Legacy ID preservation**
   - Do not casually reassign CEV IDs or pointer head addresses.
4. **Compile script awareness**
   - If new module file is added, ensure it is included/compiled.
5. **Data compatibility**
   - For schema edits, keep backward compatibility or provide migration notes.

---

## 8. Fast navigation commands for future AI runs

Use from repository root:

- Find compile entry points:
  - `rg "call %tpc%" source/Dracore/compile_core.bat`
- Find CEV definitions in a module:
  - `rg "\bcev\b" source/Dracore/module_core_RTS_agent_general.tpc`
- Find variable/switch contracts by address token:
  - `rg "4532|4533|1071" source/Dracore source/headers`
- Find where a helper/macro is used:
  - `rg "macro_SkillCDck|func_generate_agent" source/Dracore source/headers`
- List include dependencies for a file:
  - `rg "^#include" source/Dracore/module_core_RTS_main.tpc`

---

## 9. Suggested "read order" for new AI agents

If the goal is robust edits (not just tiny patches), read in this sequence:
1. `source/compile_all.bat`
2. `source/Dracore/compile_core.bat`
3. `source/headers/header_common.tpc`
4. `source/headers/header_agent.tpc`
5. Target domain general module (e.g., `module_core_RTS_battlesystem_general.tpc`)
6. Included submodules actually containing formula/logic
7. `reference/ref_DIS_data.md` for data semantics

This read order gives maximal context with minimal wasted token budget.

---

## 10. Known structural realities (for planning)

- The codebase is intentionally legacy-compatible; duplicated/obsolete sections may remain.
- Some files include old comments indicating gradual replacement of legacy CEV blocks.
- Many systems rely on implicit memory layout over explicit typed interfaces.

**Practical consequence:**
- Favor incremental, well-scoped edits with explicit comments over broad refactors.
- When uncertain, add helper wrappers rather than rewriting pointer math globally.

---

## 11. Future improvements to this guide

Potential high-impact upgrades:
- Auto-generated include graph (`.dot`) and module dependency map.
- Auto-generated CEV index (ID -> file -> name).
- Address ownership table for critical `v[]` regions.
- A change-impact matrix ("if you touch X, verify Y/Z modules").

