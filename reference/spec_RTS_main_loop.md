# RTSメインループ仕様書（初版）

## 1. 対象と前提
- 対象ファイル: `source/Dracore/module_core_RTS_main.tpc`。
- 本仕様は RTS モード (`Const_Is_RTS_Mode`) 中に常駐実行される CEV 群のうち、**メインループ相当の更新処理**を読解して整理したもの。
- ここでの「メインループ」は単一 while ではなく、フレーム粒度ごとに分割された並列 CEV（`per1f / per2f / per3f / per6f`）と、関連マネージャ CEV（投射物・エフェクト・衝突・フレームカウント）で構成される。

---

## 2. ループ構成（高レベル）
RTS 実行中、以下の CEV が並列で進行する。

- `cev 18: Main:Agent per1f`
  - 毎フレーム相当の最重処理。
  - 通常ユニットの行動更新、静的オブジェクト（建物など）更新、死体更新、描画対象登録、モートン空間リスト更新を担当。
- `cev 17: Main:Agent per2f`
  - 偶数/奇数インデックスを分割して、色フラッシュ系（`agent_sprite_RGB_check`）を処理。
- `cev 16: Main:Agent per3f`
  - 地形ビット参照や迷彩値など、やや低頻度でよいエージェント状態処理。
- `cev 15: Main:Agent per6f`
  - 主に静的エージェント（生産建物・タレット等）の重い管理処理。

併走マネージャ:
- `cev 21`: Projectile Manager
- `cev 22`: Normal Effect
- `cev 23`: Particle Effect
- `cev 24`: Gib Effect
- `cev 68`: Agents Collision
- `cev 71`: Frame Count

---

## 3. `per1f` の仕様（`cev 18`）

### 3.1 フレーム先頭の共通更新
- フレーム基準変数やサウンドロック (`g_SELockFrame`) を更新。
- マップ基準座標（参照原点）を取得し、相対座標→絶対座標変換の基準にする。
- モートン空間メモリ領域の初期コピーを行い、当フレームの空間登録準備を行う。

### 3.2 通常ユニット更新
- リスト `v[4532]` を先頭から走査。
- 各ユニットに `RTS_MAIN_LAND_AGENT_1f()` を適用。
  - 個々の移動・AI・アクションの主更新は本関数側に委譲。

### 3.3 静的オブジェクト更新（建物等）
- リスト `v[4533]` を走査。
- 主処理:
  - 移動する静的オブジェクトのみ地形情報再取得。
  - モートン座標を計算し、複数階層の空間バケットに登録。
  - 慣性・減衰付き座標更新（地形衝突を見て反映）。
  - 視界内判定後、描画対象リストに push。
  - 画面内フラグ（`AgentBits_FLAG_Drawn_in_screen`）を更新。

### 3.4 死体・残骸更新
- リスト `v[4531]` を走査。
- 建物残骸 (`StaticBits_FLAG_has_wreck_system`) の崩壊タイマー進行、粉塵エフェクト登録。
- 通常死体は落下物・透明化進行などを処理し、透明化完了で死体リストから除去。

### 3.5 描画登録の責務
- `per1f` は「更新」と同時に「描画候補抽出」も兼務。
- 視界/スクリーン範囲を満たしたオブジェクトを深度ソート用配列へ保存し、後段描画 CEV に引き渡す。

---

## 4. `per2f` の仕様（`cev 17`）
- エージェント配列を偶数・奇数に分けて処理し、1 回の負荷を半減。
- `agent_sprite_RGB_check()` の役割:
  - 盾フラッシュ値 (`agent_ShieldFlash`) を減衰。
  - `agent_FlashType` に応じて RGB を減算し、フラッシュ終了判定を行う。
- 見た目系（色反転/被弾フラッシュ）を軽量な周期処理に切り出している。

---

## 5. `per3f` の仕様（`cev 16`）
- 通常ユニットを走査し、地形ビット参照やプロセス迷彩値の再設定を実施。
- `per1f` に比べると優先度の低い状態補正・環境依存パラメータ調整を担当。
- 読解時点では「地形状態→迷彩/隠密系補正」の入口として機能している。

---

## 6. `per6f` の仕様（`cev 15`）
- 静的ユニット管理のハブ。
- 代表的責務:
  1. グローバルキュー UI の更新要求を立てる。
  2. 静的ユニットのミニマップ座標を更新。
  3. タレットの AA タイマー/ターゲット生存確認。
  4. 生産予約 (`v[770]`) の進行:
     - SP（生産力）蓄積
     - 技術状態に応じた補正
     - 完了時に spawn CEV (`cev 46`) 呼び出し
     - 生成ユニットへ初期命令（移動先、worker の作業対象、PF フラグ）を付与
- `per1f` に入れると重い建物系処理を 6f 周期に落として負荷制御している。

---

## 7. 併走マネージャ CEV の仕様
- `cev 21`: `MAIN_CEV_RTS_PROJECTILE_MANAGER()`
  - 飛び道具の進行・衝突判定側の管理入口。
- `cev 22/23/24`:
  - 通常エフェクト・パーティクル・Gib（破片）を別系統で更新。
- `cev 68`:
  - エージェント同士の衝突管理。
- `cev 71`:
  - フレームカウント進行（周期処理の土台）。

---

## 8. メインループの設計意図（読解結果）
- **負荷分散設計**: 全処理を毎フレームで回さず、`1f/2f/3f/6f` の層に分割。
- **データ局所性優先**: `func_main_extract_agent_vars` / `func_main_save_agent_vars` で 300 スロット単位のエージェントブロックをコピーして処理。
- **描画前処理内包**: ゲームロジック更新と同時に描画対象抽出まで終えることで、描画 CEV 側を単純化。
- **空間分割前提**: モートンコードを使った階層バケット登録で、検索・判定系の前処理を毎フレーム更新。

---

## 9. 既知の注意点
- `module_core_RTS_mission_simpletrigger.tpc` はファイル先頭コメント上「obsolete」とされ、現行の主ループ仕様の根拠には含めていない。
- 詳細ロジック（例: ユニット AI 本体）は `RTS_MAIN_LAND_AGENT_1f()` 側（`module_core_RTS_main_land_agent_behavior.tpc`）へ委譲されるため、次段で別仕様化が必要。

---

## 10. 次ステップ案
- `RTS_MAIN_LAND_AGENT_1f()` の責務分解（移動・索敵・攻撃・姿勢遷移）。
- `per1f` の「通常ユニット / STATIC / DEAD BODIES」それぞれのメモリ契約表（主要 `v[]` スロット対応表）作成。
- `per6f` の生産キュー遷移図（予約→蓄積→spawn→初期命令）を図式化。

---

## 11. 戦闘処理パイプライン（追加読解）

本節は「メインループ」読解を拡張し、RTS 内の戦闘判定・ダメージ計算・士気計算を **呼び出し単位**で整理したもの。

### 11.1 入口 CEV（BattleSystem）
- `module_core_RTS_battlesystem_general.tpc` が戦闘系の公開入口を束ねる。
- 主な CEV:
  - `cev 42`: 近接命中判定 `func_bs_melee_hit_check`
  - `cev 43`: 遠隔命中判定 `func_bs_ranged_hit_check`
  - `cev 35`: 精神攻撃命中判定 `func_bs_mind_hit_check`
  - `cev 40`: ダメージ計算 `func_damage_calculation`
  - `cev 41`: Kill 処理 `Kill_Agent`

### 11.2 実行順の概念モデル
1. 命中判定（近接/遠隔/精神）で `reg1` に hit/miss を確定。
2. 命中時にダメージ計算 CEV を呼び、HP/AR・副作用（フラッシュ、士気、バフ）を更新。
3. HP<=0 の場合は Ninelives 例外を判定し、最終的に kill イベントへ接続。

---

## 12. 命中計算式（HitCheck）

### 12.1 近接命中（`func_bs_melee_hit_check_wo_prep`）
- 攻撃命中率（clamp 前）:

`HitBase = agent_ProcessHIT + BackAttackBonus + 10 - victimEVA + 5 * ElevationDiff`

- 各要素:
  - `BackAttackBonus = +15`（攻撃者向きと被弾者向きが同一時）
  - `victimEVA = victim_ProcessEVA + Dodge補正`
  - `Dodge補正 = victim_ProcessMS >> 3`（Dodge パーク時）
  - `ElevationDiff = agent_getTerrainElevation - victim_getTerrainElevation`
- 最終命中率は `5..95` に clamp し、`rnd(1,100) <= HitRate` で命中。
- miss 時は追加で
  - 盾ブロック判定（`Temp3 >= 101 - victim_Shield_Value`）
  - 条件付きパリィ判定
    - 近接武器 (`victim_AAType==0`)
    - `CanParry` 持ち
    - `rnd(1,100) <= victim_ProcessHIT / (Duelist時2 : 通常3) + 16`

### 12.2 遠隔命中（`func_bs_ranged_hit_check`）
- まず `get_base_rangedEVA` で遠隔EVAを計算:
  - `reg1 = max(0, victim_ProcessEVA + Dodge補正)`
  - `reg1 >>= 2`（4分の1化）
  - Anticipation があれば `reg1 += 10 + reg1`
- 命中率（矢専用補正なし通常式）:

`RangedHit = clamp(1,99, agent_ProcessHIT + ranged_base_hit - (EVA+Shield補正後値) + ElevationBonus)`

- 補足:
  - `ranged_base_hit = 25`
  - 高低差補正 `+ 7 * min(ElevationDiff,3)`
  - 盾値は ShieldWall/被覆状態で加算され、背面から撃たれると回避値計算が悪化
  - Ambush 状態の被弾者には命中率半減（右シフト）

### 12.3 精神攻撃命中（`func_bs_mind_hit_check`）
- 基本式: `Temp1 = spellPower - victim_ProcessWill`
- `s[319]` 有効時、`Will>=150` もしくは mindless 系ビットで事実上免疫（大幅減算）。
- `rnd(1,100) <= Temp1` で成功。

---

## 13. ダメージ計算式（Damage Calculation）

`func_damage_calculation` は `raw_dmg`, `cal_type`, `attribution` を引数として受け取る。

### 13.1 事前無効化（nullifier）
- 魔法属性 (`cal_type==1`) かつ `magic_nullifying` なら計算スキップ。
- `Invincible` 目標も計算スキップ。

### 13.2 True Damage
- `cal_type==2` は防御計算を通さず、`victim_HP -= raw_dmg`。

### 13.3 通常ダメージの主式
- 内部倍率 `damage_multiplier` は初期値 100% 相当から開始し、特効/AABits/耐性で増減。
  - 対兵科特効（AntiInf/AntiCav 等）
  - 対建築 SUPER は極めて大きい加算
  - RangedDamageResist / HalveAllDamage で右シフト減衰
- 有効防御値:

`EffectiveArmor = DefenseStat * (100 - AR_penetration) / 100`

- 実ダメージ:

`reg_actual_dmg = raw_dmg * damage_multiplier / (100 + EffectiveArmor)`

- HPに通る分（AR吸収後）:

`reg_actual_dmg_after_armor = max( reg_actual_dmg - BaseAR*0.625*(1-pen), 0 )`

（実装は `BaseAR>>1 + BaseAR>>3` で 0.625 を近似）

- 最終的に Nimble 系の `victim_TakenDamageMultiplier` を適用後、`victim_HP` へ反映。

### 13.4 AR減少式
- 被弾で AR 自体も減少する。
- 概念式:

`BaseAR -= max(1, (reg_actual_dmg/2) * 100 / (100 + AR_effectiveness - BattleForged補正))`

### 13.5 回復（負色ポップ）
- `LEGV_PopColour < 0` 系統は回復扱い。
- bleed 免疫や overheal フラグで回復量が変化。

---

## 14. クリティカル・致死・キル時派生

### 14.1 クリティカル相当
- `damage_multiplier >= 200` をクリティカル扱いに近いフラグとして運用。
- この時 AR貫通が増幅（2倍、上限100）。

### 14.2 致死（fatality）判定
- HP0 以下時、Ninelives を先に確認。
- Ninelives 非発動時は fatality 判定:
  - 条件: `damage_to_hp >= 85`
  - 乱数式: おおむね `damage_to_hp/16` ベース
  - Headhunter/クリティカル状態で確率上乗せ

### 14.3 キル時報酬
- 攻撃側パークに応じて
  - BattleFlow: スキルCD短縮
  - Berserk: SP/HP回復
  - KillingFrenzy: 一時バフ付与

---

## 15. 士気（Morale）計算

### 15.1 士気悪化ロール
- ダメージ計算後、非死亡時に `func_bs_morale_check_victim` が走る。
- 入力 power は概ね

`power = min( ((damage_to_hp/8) + 15) * Demoralize補正, 100 )`

- ロール本体:

`success = rnd(0,99) <= max(0, power + min(-(1800 / -(will+8)) - 58, 24))`

- 成功時は `Morale += 1`（上限3）、3 到達で flee 演出。

### 15.2 士気回復
- `func_bs_morale_recover(agent,power)`:

`rnd(0,99) <= power + (Will/4)` で成功時 `Morale -= 1`（下限側へ回復）。

---

## 16. 追加読解で見えた設計ポイント
- 命中とダメージを明確分離し、ダメージ側に perk/objbit 相互作用を集中。
- AR（装甲）を「被弾で減る可変リソース」として扱い、長期戦で防御が崩れる設計。
- 士気式は `will` に対して非線形補正を入れており、高 will ユニットほど急激に崩れにくい。
- `damage_multiplier` の寄与先が多く、バランス調整時は **AABits と ObjBit の交点**を優先確認するのが有効。
