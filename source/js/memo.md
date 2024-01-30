# js組み上げ用メモ

##

## スキル登録
### 仕様
Parseされた後のユニット/武器データ文字列に置かれる数字はコール番号にする?
ptrs[]にはプリセットもカスタムも両方入れる。
カスタムのみカウントして……
ユニットへの登録時にIDを振り分けてあげる？＜ープリセットスキルと混同生じそう、危険では。
結局プリセット仕様を排除しないとどうしようもないのでは説
- 結局
  - データベース化されていないプリセット
	- プリセット
	- 中間のエンハンスド
	- カスタム
	の４つが生まれてくる……
	言語対応するときにデータベース化されていないプリセットは完全に消えるから、
	**その時にまた組み替える**
	これバグすごそう
- おそらく現状TPC側のID割り振りは説明文表示にしか使っていないため、
  組み替えてもよさそう

### DONE
- 負の数値のスキルが参照された場合の分岐を置いた
- コール番号とnumidを分離して混沌を作った
### TODO
- js側の処理を作ってスキルを組めるようにする

### sample
```json
"SKILL": {
	"throwing_axe": {
		"datatype": "preset",
		"name": "sample_",
		"name_jp": "見本",

		"cev": 1201
	},

	"sample_skill_custom": {
		"datatype": "enhanced",
		"name": "sample_2",
		"name_jp": "見本スクリプト付き",

		"skillType": "liner",
		"usage": "damage",
		"motionTime": 1,
		"extraAnimation": 0,

		"rangeMax": 32400,
		"rangeMin": 0,
		"SPcost": 0,
		"cooldown": 0,
		"skillBits": [],
		"castAIBits": [],
		"cev": 1201
	}
}
```

```
	Skill1_ID = 141 - this means cev id,
	Skill1_func = 142
	Skill1_type = 143 #0 = passive, 1 = liner, 2 = Point, 3 = Target, 4 = AoE ,5=self, 6=passive(?), 7=modeChange
	Skill1_usage = 144 # -1 = extra(bots never cast), 0 = damage, 1 = heal, 2 = buff, 3 = debuff, 4 = dash, 5 = blink , 6=CC
	Skill1_motiontime = 145
	Skill1_has_extramotion = 146 #101=Swipe weapon
	Skill1_cost = 147
	Skill1_cooldown = 148
	Skill1_targobj = 149
	Skill1_targx = 150
	Skill1_targy = 151
	Skill1_range_max = 152
	Skill1_range_min = 153
	Skill1_stack1 = 154 
	Skill1_basespellpower = 158 ????+[????%]
	Skill1_setting = 159 # 1:1=has_initial_proc
	Skill1_AutocastLockbit= 160 //1=lock or unlock 2:2=moving 3:4=not in meleecombat
```


