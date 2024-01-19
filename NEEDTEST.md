# Changes/Additions that need to be tested in BETA / ベータ版チェック項目

## Unexamined / そもそも試してすらいない
- 農民のお仕事リファクタリング

### js系
	
### リファクタリング系

### バグ修正系

## Something is wrong / 何かおかしい

- AEB
## Suspicious / 怪しい
- AEB
  - Save/Loadで壊れないか？
  - **AI Priority / AIの挙動**
    - 味方を殴ることがあった..
    - プライオリティの計算がめちゃめちゃだったのを直してみたが、これがどれだけ効くかは微妙なところ




## 一応動いているっぽいが、ちゃんと復元するところまでチェックする
- RTSゲームのrestore処理を組み替えた
	- RTS.Preserveにマップ変数処理は一本化する
	- simple triggerの処理はどうなっとるか？
- プレイヤーデータの保存・復元機能(RTSmission.save()/restore())


## Seems okay / 大丈夫そう
- ``DIS.string.wrapText()`` [DIS_js_system_main.js]
  - 調整の余地はあるがエラーはなさそう。
- cavalry_idle_motion
  - 動きはする。問題は今後の馬と装飾品の分離に対応させるにあたりどうすべきか
- JSON兵士データの簡易多言語対応
  - 頭の悪い組み方なのと場合によっては継承で訳文が引き継がれることによって意図せぬ働きをしうる点に注意
- agent個別アクション等の最適化
	- func_CkIfSklCall()とskillAIの齟齬を統一する..した

### リファクタリング系
- 汗のパーティクル

### 修正系
- 初期配置農民の文化
- 徴用のバグ修正
  - playerfunction系のメタ関数の組み方に注意
  