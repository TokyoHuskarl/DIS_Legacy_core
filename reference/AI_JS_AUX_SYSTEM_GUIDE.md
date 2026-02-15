# DIS:Legacy JS補助システム ガイド（AI/解析用）

この文書は、TPC本体とは別に存在する **JavaScript補助システム** を、
AI/コードエージェントが安全に参照するためのガイドです。

- 推測は書かず、`source/`配下の実コードで確認できる事実のみ記載します。
- TPC側の詳細設計全体は `AI_TPC_CODEBASE_GUIDE.md` を参照してください。

---

## 1. JS補助システムの役割（確認できる範囲）

- `source/Dracore/module_core_Game_scripts_functions.tpc` には、JSライブラリ読み込み/実行の関数があり、
  `NsGUI.js` と `DIS_js_system_main.js` を起動する `boot_DIS_js_system` が定義されています。
- 同ファイルには、`reboot_DIS_js_system`（boot configを読み込んでからJS再起動）や、
  `save_DIS_js_RTS_system`（`RTS.save()` 呼び出し）も定義されています。
- `source/Dracore/module_core_Game_scripts_general.tpc` の CEV 2041 は、
  JS側が書き込んだ `Str_CmdQueue` を分解し、TPC側のコマンドパッケージ処理を実行します。

要するに、**JSで組んだ命令列をTPCイベント系で実行する橋渡し** が主機能です。

---

## 2. TPC↔JSブリッジの中核

### 2.1 TPC側ヘッダ（共有アドレス・スイッチ）

`source/headers/header_scripts.tpc` では、以下が定義されています。

- `BOOL_CMD_RUN = 132`
- `Str_CmdQueue = 795`
- `BOOL_CMD_CALLING = 261`
- `JSSAVE_triggersQueue = 763`
- `dialogQueue = 785`
- `RUN_Radio_Dialog = 96`

また `DISAPI_JS_CMD_RUN` は、`BOOL_CMD_RUN` がOFFのときに `eval_js("Cmd.run()")` を呼びます。

### 2.2 ミッション中の実行ループ

`source/Dracore/module_core_RTS_mission_general.tpc` の CEV 1830（`JS Mission/CommandManager`）は、
RTS中かどうか・ポーズ中かどうかで分岐し、
- RTS進行中は `RTS.mission.run();` を `eval_js` 実行
- それ以外では `DISAPI_JS_CMD_RUN()`
を呼びます。

### 2.3 コマンド解釈側（TPC）

`source/Dracore/module_core_Game_scripts_general.tpc` の CEV 2041 は以下を行います。

1. `Str_CmdQueue` を `;` 区切りで分割
2. 各要素を `DIS_Cmd_callPackageTree` で実行
3. 実行後に `Str_CmdQueue` を空にし、`BOOL_CMD_RUN` をOFF
4. `eval_js("Cmd.ReturnQueue = [];")` でJS側の返却キューを初期化

---

## 3. JS本体ファイルの構成

## 3.1 `source/js/DIS_js_system_main.js`（中核）

ファイル先頭コメントで、
- 「DIS API」
- 「ゲームシステム再起動時に毎回ロードされるべき」
- 「他モジュール読み込みが難しいため重要オブジェクトを多く含む」
と説明されています。

同ファイルで確認できる主要要素：

- `TPCadr`（TPC側アドレス定義の一部）
- `VIRTUAL_ENV` 判定（`setv` 未定義時）
- `setv/getv/sett/gett/sets/gets` のスタブ
- `DATA_entity` を起点とする `DATA_*` クラス群
- `RTSmission`, `RTSmap`, `DIS_RTSplayer`, `RTStrigger` 等のクラス
- `Cmd` オブジェクト（CmdQueue/CmdSyncQ/ReturnQueue、`init()`、`run()`、`game`名前空間など）

特に `Cmd.run()` は、
- `Str_CmdOrder` 相当スロットへ命令文字列を書き込み
- `BOOL_CMD_RUN` 相当スイッチをON
- 実行後キュー更新とrunFlags初期化
を行う実装になっています。

## 3.2 `source/js/DISmoduleloader.js`（moduleinfo表示文字列）

- `t[520]` のJSONを `moduleinfo` として読み込み
- `getModuleInfoForTitle()` を付与
- パース失敗時はエラー文言を返すフォールバックを使用
- 最後に `sett(520, moduleinfo.getModuleInfoForTitle())`

## 3.3 `source/js/bootconfig.js` / 生成元

- `boot_config` オブジェクト（`module`, `bootmode`, `gore`, `particle_amount`, `autosave`, `exportlog`）が定義されています。
- TPC側の `source/headers/define_file_generation.tpc` には、
  `PATH_js_bootconfig = "..\user\boot_config.js"` と、生成用テンプレート `Gen_BootConfig` が存在します。

## 3.4 `source/js/scene/bootloading.js`

- `scene` オブジェクトに `name`, `text`, `loadsprite` を設定する、ブート直後向けの軽量シーン定義です。

## 3.5 `source/js/DIS_mapgenerator.js`

- `noise`（perlin/simplex）オブジェクトの存在を前提。
- `DISmapgen.generateElevationMap(width,height,scale,bias,leastElv)` を提供。
- `mapNoiseToElevation` でノイズ値を標高へ変換。
- `VIRTUAL_ENV` 時は試験用コードがあり、`RTS.map.generate` を試す分岐があります。

---

## 4. GUI系JS（現状）

## 4.1 `NsGUI.js`

- `NsGUI` モジュール内に UI種別/描画コマンド定数、`Ns_Presentation`、`UI_object` 等のクラスがあります。
- ただし wrapper群（`drawPic`, `drawStrPic`, `movePic`, `erasePic`）は空実装です。

## 4.2 `NsLib_GUI_init.js`

- `NsGUImgr` コメント、`Ns_Presentation`、`UI_object`、`Simple_Checkbox` などのクラスがあります。
- `NsGUI.js` と重複系の定義があり、保守時には利用箇所を先に特定してから編集するのが安全です。

---

## 5. ミッション/マップクラスで確認できる連携点

### 5.1 `RTSmission`

`source/js/DIS_js_system_main.js` の `RTSmission` では、
- `save()` でトリガキューとプレイヤー情報等を JSON 文字列として TPC文字列スロットへ保存
- `restore()` でそれらを `JSON.parse(gett(...))` で復元
- `run()` でフレーム進行し、`triggers.runTriggers()` が真なら `Cmd.run()` 実行

が確認できます。

### 5.2 `RTSmap`

`RTSmap` コンストラクタは、map info JSON が無い場合を `LEGACYMAP` として扱う分岐を持ちます。
JSONがある場合は `mapscript`, `dataextension`, `dependency`, `size`, `heightgen`, `terrainfile`, `tileset` を読み、
`mapscript` の各要素を `RTS.mission.Cmd.execScript(elm)` で実行します。

---

## 6. 補助スクリプト/周辺ファイル（現状把握）

- `source/Modules/Legacy/Data/csv2json.js` は `csvtojson` と `fs` を使う単体変換スクリプトです。
- `source/Modules/Legacy/scripts/module_loading.js` は空ファイル（0行）です。
- `source/Modules/Legacy/scripts/static_units.js` は実質空（2行、内容なし）です。
- `source/index.js` は多数のJSモジュールを `export *` で再公開します。
  （`./index.js` 自身の再exportも含まれている点に注意）

---


## 6.5 起動〜ミッション実行までの具体フロー（確認済み）

### A) ゲーム起動時（Game Init）

`module_core_Game_init.tpc` では、
1. `PATH_js_bootconfig` から boot config を読み込み、無ければ `Gen_BootConfig` で生成
2. 読み込んだJS文字列を `eval_js(inputstr)` で実行
3. `moduleinfo.json` を読み込み `Str_moduleinfo` に格納後、`DISmoduleloader.js` を実行

という順で、JS側の設定/モジュール情報を初期化しています。

### B) ミッション初期化

`module_core_RTS_mission_map_init.tpc` の `CEV_MISSION_INIT` では、
- `load_jslib("noisejs/perlin.js")`
- `execute_js("DIS_mapgenerator.js")`
- `eval_js("RTS.init()")`

が呼ばれ、マップ生成補助とRTS JS初期化が行われます。

### C) ミッション定義/マップ定義読み込み

同ファイルの `loadMissionDef` / `loadMapInfo` では、
- `missioninfo.json` を `RTS.setupMission(...)` へ
- `mapinfo.json` を `RTS.openMissionMapData(...)` へ
- 必要に応じて mission script を `eval_js(inputstr)` で実行

する流れが確認できます。

### D) 実行ループ

`module_core_RTS_mission_general.tpc` の CEV 1830 で `RTS.mission.run()` が毎フレーム系で呼ばれ、
`RTSmission.run()` 側では trigger 判定が真なら `Cmd.run()` を発行します。

---

## 6.6 開発中・過渡的と思われる要素（明示コメントベース）

以下は**コード内コメント/実装状態で明示されているもののみ**です。

- `source/js/config_memory_allocation.js`
  - ファイルコメントに `// NOT WORKING`。
- `source/Modules/Legacy/scripts/module_loading.js`
  - 実体が空ファイル（0行）。
- `source/Modules/Legacy/scripts/static_units.js`
  - 実体がほぼ空（2行）。
- `source/js/NsGUI.js`
  - wrapperの `drawPic/drawStrPic/movePic/erasePic` が空実装。
- `source/js/DIS_js_system_main.js`
  - `CmdRetLink` に `Shit class, none uses it` コメントあり。
  - `createMissionVar` には `This one will be abolished soon` コメントあり。
  - `THIS ONE WILL BE OBSOLETE` コメント付き要素あり。
- `source/Dracore/module_core_RTS_mission_general.tpc`
  - 先頭付近に `OBSOLETE!!!!` コメントが存在。
- `source/Dracore/module_core_Game_scripts_general.tpc`
  - `header_scripts_functions.tpc` includeに `will be gone soon (TM)` コメントあり。

運用上は、これらの箇所に対しては
- 新規機能追加先として選ぶ前に利用実態を確認
- 変更時は影響範囲を狭くし、撤去予定コメントの有無を再確認
するのが安全です。

---

## 6.7 Legacy map / modern map の分岐（JS観点）

- `RTSmap` コンストラクタは、map情報JSONが無い場合に `LEGACYMAP` 分岐を持ちます。
- `loadMissionDef` / `loadMapInfo` でも、JSON不在時に legacy 扱いへ分岐する処理があります。
- つまり、JS補助系は「JS定義がある新方式」と「legacy互換」の両系統を内包しています。

---

## 7. JS補助システムを追うときの実務手順（推測禁止版）

1. **TPC側トリガを見る**
   - `header_scripts.tpc` / `module_core_RTS_mission_general.tpc` / `module_core_Game_scripts_general.tpc`
2. **JS側実装を見る**
   - `DIS_js_system_main.js` の `Cmd`, `RTSmission`, `RTSmap` を優先
3. **アドレス整合を確認**
   - `BOOL_CMD_RUN`, `Str_CmdQueue` などのアドレス定義と、JS側の使用箇所を突き合わせる
4. **意図不明な箇所は断定しない**
   - コメントや呼び出し実態がない場合は「未使用/要追跡」として扱う

---

## 8. 参照用コマンド

```bash
rg -n "BOOL_CMD_RUN|Str_CmdQueue|DISAPI_JS_CMD_RUN" source/headers source/Dracore
rg -n "JS Mission/CommandManager|Script:DIS command interpriter" source/Dracore
rg -n "var Cmd|Cmd\.run\(|class RTSmission|class RTSmap" source/js/DIS_js_system_main.js
rg -n "moduleinfo|boot_config|scene =" source/js
```

