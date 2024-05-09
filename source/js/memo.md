# js組み上げ用メモ

## コマンド周り
### 問題点
- ｊｓグループ処理のうち，仮にユニット情報が変わって別のユニットになってしまっていたらどうするの？

## カスタムパーティクル
### 仕様
Event構想とは切り離して軽めに済ませる
### Simple
#### 古き良きOCCCの組み方を参考にする
```python
####################################################################################################################
#   Each particle system contains the following fields:
#  
#  1) Particle system id (string): used for referencing particle systems in other files.
#     The prefix psys_ is automatically added before each particle system id.
#  2) Particle system flags (int). See header_particle_systems.py for a list of available flags
#  3) mesh-name.
####
#  4) Num particles per second:    Number of particles emitted per second.
#  5) Particle Life:    Each particle lives this long (in seconds).
#  6) Damping:          How much particle's speed is lost due to friction.
#  7) Gravity strength: Effect of gravity. (Negative values make the particles float upwards.)
#  8) Turbulance size:  Size of random turbulance (in meters)
#  9) Turbulance strength: How much a particle is affected by turbulance.
####
# 10,11) Alpha keys :    Each attribute is controlled by two keys and 
# 12,13) Red keys   :    each key has two fields: (time, magnitude)
# 14,15) Green keys :    For example scale key (0.3,0.6) means 
# 16,17) Blue keys  :    scale of each particle will be 0.6 at the
# 18,19) Scale keys :    time 0.3 (where time=0 means creation and time=1 means end of the particle)
#
# The magnitudes are interpolated in between the two keys and remain constant beyond the keys.
# Except the alpha always starts from 0 at time 0.
####
# 20) Emit Box Size :   The dimension of the box particles are emitted from.
# 21) Emit velocity :   Particles are initially shot with this velocity.
# 22) Emit dir randomness
# 23) Particle rotation speed: Particles start to rotate with this (angular) speed (degrees per second).
# 24) Particle rotation damping: How quickly particles stop their rotation
####################################################################################################################
    ("occc_arrow_fire", psf_billboard_3d|psf_global_emit_dir|psf_always_emit|psf_randomize_size|psf_randomize_rotation, "prt_mesh_fire_1",
     100, 1.5, 0.2, 0.03, 10.0, 10.0,     #num_particles, life, damping, gravity_strength, turbulance_size, turbulance_strength
     (0.5, 0.8), (1, 0),        #alpha keys
     (0.5, 1.0), (1, 0.9),      #red keys
     (0.5, 0.7),(1, 0.3),       #green keys
     (0.5, 0.2), (1, 0.0),      #blue keys
     (0, 0.15),   (0.4, 0.3),   #scale keys
     (0.04, 0.04, 0.01),      #emit box size
     (0, 0, 0.5),               #emit velocity
     0.3,                       #emit dir randomness
     200,                       #rotation speed
     0.5                        #rotation damping
    ),
```

#### DIS式
mikan
```json
{
	"PARTICLE": {
		"black_smoke_building": {
			"datatype": "simple",
			"pattern": 0,
			"numPerFrame": 3,
			"frequency": 1,
			"lifetime": 6,

			"velocity": [0,0],
			"scale": [100,100],
			"rotationSpeed": 0,
			"rotationDamping": 0


		}
	}
}
```

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


