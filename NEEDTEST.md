# Changes/Additions that need to be tested in BETA / ベータ版チェック項目

## Unexamined / そもそも試してすらいない
- 農民のお仕事リファクタリング

### js系
- RTSゲームのrestore処理を組み替えた
	- RTS.Preserveにマップ変数処理は一本化する
	- simple triggerの処理はどうなっとるか？

- プレイヤーデータの保存・復元機能(RTSmission.save()/restore())
  - 
			
### リファクタリング系
- 汗のパーティクル
- agent個別アクション等の最適化
	- func_CkIfSklCall()とskillAIの齟齬を統一する..した

### バグ修正系
- 徴用のバグ修正
- 初期配置農民の文化

## Something is wrong / 何かおかしい
- AEB
  - **AI Priority / AIの挙動**
    - 味方を殴ることがあった
      - **騎兵のAIがおかしい。建物をやたら優先して見るようになってる。**

## Suspicious / 怪しい
- AEB
  - Save/Loadで壊れないか？

## Seems okay / 大丈夫そう
- ``DIS.string.wrapText()`` [DIS_js_system_main.js]
  - 調整の余地はあるがエラーはなさそう。
- cavalry_idle_motion
  - 動きはする。問題は今後の馬と装飾品の分離に対応させるにあたりどうすべきか
- JSON兵士データの簡易多言語対応
  - 頭の悪い組み方なのと場合によっては継承で訳文が引き継がれることによって意図せぬ働きをしうる点に注意

