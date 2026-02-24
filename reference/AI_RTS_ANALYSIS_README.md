# AI向け README: RTS解析・仕様化ワークフロー

この文書は、DIS:Legacy Core の **RTS 部分を AI で読むときの実務メモ**です。
直近で作成した `reference/spec_RTS_main_loop.md`（main loop + 戦闘計算/士気）を土台に、
次にどこを読めばよいかを最短で辿れるようにしています。

---

## 1) まず最初に読むファイル

1. `reference/spec_RTS_main_loop.md`
   - 既存の読解結果（`per1f/per2f/per3f/per6f`、BattleSystem の命中/ダメージ/士気）
2. `reference/AI_TPC_CODEBASE_GUIDE.md`
   - コンパイル順、主要モジュール責務、編集時の注意
3. `source/Dracore/module_core_RTS_main.tpc`
   - 実装本体（イベント ID 18/17/16/15/21/22/23/24/68/71）

---

## 2) 戦闘計算を追う最短ルート

- 入口: `source/Dracore/module_core_RTS_battlesystem_general.tpc`
  - `cev 42/43/35/40/41` が命中→ダメージ→Kill の公開口
- 命中式: `source/Dracore/module_core_RTS_battlesystem_hitchecks.tpc`
  - 近接、遠隔、精神攻撃の式
- ダメージ式: `source/Dracore/module_core_RTS_battlesystem_damage_calculation.tpc`
  - AR/MR、貫通、倍率、nullifier、士気連携、Ninelives/fatality
- 士気式: `source/Dracore/module_core_RTS_battlesystem_morale.tpc`
  - 士気悪化/回復ロール
- 補助関数: `source/Dracore/module_core_RTS_battlesystem_functions.tpc`
  - ranged EVA 基本計算、buff 付与/除去

---

## 3) 読解時の実務ルール（AI向け）

- 仕様書には「概念式」を書き、必要時に実装式（bit 演算やシフト）を併記する。
- `v[]/s[]/t[]` は暗黙インターフェースなので、
  1 箇所で意味を決め打ちしない（呼び出し元/先の両側を見る）。
- `func_main_extract_agent_vars` / `func_main_save_agent_vars` 前後で、
  「バッファ値」か「実体メモリ」かを必ず区別する。
- バランス調整レビュー時は、次の順で確認すると事故が少ない。
  1. HitCheck（命中）
  2. Damage multiplier（特効・耐性）
  3. AR減衰
  4. Morale 連鎖

---

## 4) TPC言語リファレンスについて（重要メモ）

- TPC 処理系配布物には `readme.txt` が同梱される前提で、
  文法・コマンド仕様の一次参照として扱うこと。
- このリポジトリ内には `readme.txt` が存在しない場合があるため、
  **手元の tpc.exe 配布セット側の `readme.txt` を参照**すること。
- 本リポジトリの `README.md` にも、tpc.exe 取得手順と `readme.txt` への言及がある。

---

## 5) 次に仕様化すると良い対象

- `RTS_MAIN_LAND_AGENT_1f()` の責務分解（移動/索敵/攻撃/姿勢遷移）
- `v[4532]/v[4533]/v[4531]` 周辺のメモリ契約表（通常/静的/死体）
- `per6f` の生産キュー遷移図（予約→蓄積→spawn→初期命令）
- `AABits` × `BaseObjBit` の交差マトリクス（ダメージ倍率レビュー用）

