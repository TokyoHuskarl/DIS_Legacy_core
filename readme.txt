


お試しだぞ！
仕様がころころ変わったりまるっとなかったことになったりするかもしれないぞ！！


ライセンス文はゲームエンジンからも参照できるためゲーム配布時には同梱しなくても大丈夫だと思います
（ウィンドウ左上アイコンクリック→ライセンス→QuickJS）




◆Script
    @js
    
    [引数]
    文字列              実行内容
    変数                戻り値を受け取る変数
    配列                戻り値を受け取る変数（複数）
    
    .run(a)             実行内容（文字列/文字列変数）
    .exec(a)            実行内容（文字列/文字列変数）


    戻り値を受け取るかどうかは任意
    
    ・受け取る変数が単体で戻り値が配列
    　配列の最初の要素が渡される
    
    ・受け取る変数が単体で戻り値が配列でない
    　値がそのまま渡される
    
    ・受け取る変数が複数で戻り値が配列
    　配列から受け取る変数の数だけ渡される
    
    ・受け取る変数が複数で戻り値が配列でない
    　受け取る変数のすべてに戻り値が渡される
    
    
    注意点とか
    ツクールの文字列変数で値を代入するときは参照コピーなため省メモリだが、
    js内でツクールの文字列変数と受け渡しを行うときは常に値コピーになる




・定義済み関数とか

    getv(a)             a番のツクールの変数を取得
    getv(a, b)          ツクールの変数をa番からb個取得（配列）
    getv([a, b])        ツクールの変数をa番からb番まで取得（配列）
    
    setv(a, b)          a番のツクールの変数にbを設定
    setv(a, [])         ツクールの変数にa番から順に配列の要素を設定
    
    let a = v[b]        let a = getv(b) と同じ
    let a = v[[b, c]]   let a = getv([b, c]) と同じ
    
    v[a] = b            setv(a, b) と同じ
    v[a] = [b, c]       setv(a, [b, c]) と同じ


    以下同様

    gets(), sets(), s[] スイッチの入出力
    gett(), sett(), t[] 文字列変数の入出力



TODO
    
・データベースを表すオブジェクト
　database.actor[].name　とかそんな感じ


・ゲームデータを表すオブジェクト
　gamedata or savedata 
　ピクチャはここ
　変数もここだけどよく使うからグローバルに置いた


・ゲームエンジンの一部処理を移行
　btl.calcSkillDamage() みたいにしてオーバーライド可能にしちゃう
◇概要
    TPC! TPC!
    
    最初の引数にソースファイルを渡して実行してください
    ツクール2003 + Maniac Patch のイベントコマンドや
    コモンイベントを生成するツールです
    
    文法はゆるくふわいです
    

◆起動オプション
    -en                     エラーログを怪しい英語で出力    
    -pop                    エラーログをメッセージボックスで表示
    
    

◆値の種類
    文字列                  "" または 「」 で括る
    数値                    10進数と16進数（0x***）
    配列                    [要素0, 要素1, ...]
    ブロック                { 要素0, 要素1, ... } または bl { 要素0, 要素1, ... }
    定数定義　              記号以外の文字と数値（先頭は不可）および_
    メタ変数                $定義名
    イベントコマンド        @コマンド名
    サブコマンド            .コマンド名
    変数                    v[id] または v:id
    スイッチ                s[id] または s:id
    文字列変数              t[id] または t:id
    変数操作式              `式


◆コメント
    //                      行コメント
    /**/                    範囲コメント

    
◆予約語
    def             
    defs             
    defv             
    deft             
    vname
    sname
    tname
    cev
    mev
    mep
    bl
    v
    s
    t
    gv
    gs
    gt
    item
    actor
    member
    ev
    self
    player
    boat
    ship
    airship
    enemy
    sys
    __fn
    __loop
    __if
    __id
    __str
    __defined



◆コモンイベント
    cev

    [引数]
    配列                イベントID
    数値                イベントID
    .id(a)              イベントID
    
    文字列              イベント名
    .name(a)            イベント名    
    
    .auto               開始条件 自動開始
    .parallel           開始条件 並列処理
    .beginBattle        開始条件 デフォ戦開始時
    .battleParallel     開始条件 デフォ戦で並列処理
    .beCalled           開始条件 呼び出されたとき（デフォルト）
    .cond(n)            イベント出現条件のスイッチ
    .ev(n)
    その他              実行内容


    [サンプル]
    cev 4, "qwe", .parallel, {      //コモンイベント[4] 名前=qwe  並列処理
        "msg"
    }
    

◆マップイベント
    mev
    
    [引数]
    配列                
    数値                
    .id(n)              イベントID
    
    文字列              
    .name(n)            イベント名
    
    .parent(n)
    .map(n)             配置するマップID
    .pos(x, y)          配置位置（マス）
    
    
    最後に指定したマップIDとイベントIDは記憶されます
    イベント作成時にマップIDの初期値は記憶されたものを引き継ぎます

    
◆マップイベントページ
    mep
    
    [引数]
    配列                
    数値                
    .id(n)              ページID
    
    .ev
    ブロック            イベントコマンド

    .parent             
    .mev                マップイベントID
    
    .grandParent
    .map                マップID
    
    .decision           開始条件 決定キーが押されたとき（デフォルト）
    .touched            開始条件 主人公から触れたとき
    .beTouched          開始条件 イベントから触れたとき
    .auto               開始条件 自動開始
    .parallel           開始条件 並列処理
    
    .body(a, b)         歩行グラフィックaとファイル内位置b
    .trans
    .transparent        歩行グラフィックを半透明にする
    
    .anim(*)            アニメーションの設定
        .normal         通常（デフォルト）
        .fixDir         向き固定
        .step           （通常または向き固定のとき）足踏みあり
        .fix            グラフィック完全固定
        .spin           4枚アニメ
        .noWalk         歩行動作無効
        
    .priority(*)        プライオリティタイプ
        .low            通常キャラの下（デフォルト）
        .middle         通常キャラと重ならない
        .high           通常キャラの上
        
    .disableOverlap     別のイベントと重ならない
    
    .dir(*)             イベントの向き
        .up             上
        .right          右
        .down           下（デフォルト）
        .left           左
        
    .pattern            グラフィックパターン
        .left               
        .middle         （デフォルト）
        .right
    
    .cond(*)            出現条件
        比較演算        変数lがr（と同値, 以上, 以下, より大きい, より小さい, 以外）
        
        .sw1(n)         スイッチnがオン
        .sw2(n)         スイッチnがオン
        .item(n)        アイテムnを所持
        .actor(n)       主人公nがパーティにいる
        .timer1(n)      タイマー1の残り秒数がn以下
        .timer2(n)      タイマー2の残り秒数がn以下
        
    .action(*)          動作
        .freq(n)        移動頻度
        .speed(n)       移動速度
        .repeat         動作を繰り返す
        .skippable      移動できない場合は無視（デフォルト）
        .unskippable    移動可否に関わらず無視しない
        
        .random         ランダム移動
        .vert           上下往復
        .horiz          左右往復
        .approach       主人公に近寄る
        .away           主人公から逃げる
        
        .custom(*)
        ブロック        移動ルート指定

        
    [移動ルート]
    .moveUp
    .moveRight
    .moveDown
    .moveLeft
    .moveUpperRight
    .moveLowerRight
    .moveUpperLeft
    .moveLowerLeft
    .moveRandom
    .moveToward
    .moveAway
    .moveForward
    .faceUp
    .faceRight
    .faceDown
    .faceLeft
    .turnRight
    .turnLeft
    .turnBack
    .turnSide
    .turnRandom
    .turnToward
    .turnAway
    .pause
    .beginJump
    .endJump
    .fixDir
    .unfixDir
    .speedUp
    .speedDown
    .freqUp
    .freqDown
    .switchOn(id)
    .switchOff(id)
    .setBody(file, idx)
    .se(file, vol, pitch, balance)
    .beginThrough
    .endThrough
    .pauseAnim
    .resumeAnim
    .transUp
    .transDown

    
    ページ作成時にマップIDとイベントIDの初期値は記憶されたものを引き継ぎます


◆スイッチ/変数名の設定
    sname/vname
    
    
    [引数]
    配列/数値           現在のID
    文字列              現在IDにつける名前
    
    .expand(a)          要素数aを最低限確保する
    .shrink             末尾に連なる空白名の要素を消す

    .pad(a)             現在IDからa個に空文字名を付ける
    .pad(a)             指定範囲aに空文字名を付ける

    .wipe               元々の名前を全てクリア
    .append             元々の名前をクリアしない（デフォルト）



◆コマンド記法
    @name.subname(arg1, arg2, ...)    
    @name.subname arg1, arg2, ...
    @name.subname arg1  arg2  ...
    @name.subname {
        arg1
        arg2
        ...
    }
    
    引数のなかにはさらに引数を取るものもあります
    
    @name.subname arg1(subarg1, ...), arg2
    
    
    コマンドの引数は原則として順不同（※例外あり）、
    引数の引数は順番固定です
    コマンドの引数のうち、不要なものは省略可能です
    
    
    引数の数が固定のサブコマンドは、あまった引数を返却します
    
    @timer.set 5.timer2
    
    上のコマンドは以下のように解釈されますが、
    
    @timer(.set(5, .timer2))
    
    返却により期待通りに値が設定されます
    
    @timer(.set(5), .timer2)
    
    
    配列を引数にとる場合、その引数は @name と .subname のあいだに記述できます
    
    @pic.erase [10]
    @pic[10].erase
    
    最後に記述した @name は記憶され、同じものを続けて使用するときは省略できます
    また、 @name と .subname のあいだに記述した引数も引き継がれます
    
    @pic[2].show "qwe"
    .move.pos(160, 120).time(6).wait    //@> ピクチャ移動: [2]
    .erase                              //@> ピクチャ消去: [2]
    
    
    同一の項目を複数回操作すると最後の変更で上書きされます
    
    @party.item[1].add(5).sub(3)        //@> アイテムの増減: item[1] -= 3
    

◇イベントコマンド
    @msg.show                   文章の表示    
    @msg.opt                    文章オプションの設定
    @msg.option                 文章オプションの設定
    @msg.face
    @msg.choice
    @msg.input
    @msg.inputNum
    @msg.hook                   
    
    @timer
    
    @party.money
    @party.item
    @party.member
    
    @actor.exp
    @actor.level
    @actor.param
    @actor.skill
    @actor.equip
    @actor.equipment
    @actor.hp
    @actor.mp
    @actor.state
    @actor.recoverAll
    @actor.damage
    @actor.name
    @actor.nickname
    @actor.face
    @actor.faceset
    @actor.body
    @actor.charset
    @actor.inputName
    @actor.class
    @actor.cmd
    @actor.multipleAct
    
    @player.setPos
    @player.getPos
    @player.trans
    @player.transparent
    
    @vehicle.body
    @vehicle.charset
    @vehicle.ride
    @vehicle.setPos
    
    @sys.bgm
    @sys.se
    @sys.skin
    @sys.transition
    @sys.call
    @sys.limitation
    @sys.gameover
    @sys.reset
    @sys.shutdown
    @sys.gameOpt
    @sys.gameOption
    @sys.wait
    @wait
    @sys.getInfo
    @sys.fullscreen
    @sys.partyMenu
    @sys.menuAccess
    @sys.loadMenu
    @sys.optionMenu
    
    @shop
    @inn
    
    @map.getPlayerPos
    @map.setPlayerPos
    @map.setVehiclePos
    @map.setEv
    @map.setEvPos
    @map.setEventPos
    @map.getTerrain
    @map.getEv
    @map.tileset
    @map.parallax
    @map.replaceTile
    @map.rewrite
    
    @scr.hide
    @scr.show
    @scr.tint
    @scr.flash
    @scr.shake
    @scr.scroll
    @scr.weather
    
    @btl.encounterRate
    @btl.begin
    @btl.atbMode
    @btl.hook
    @btl.atb
    @btl.cmdex
    @btl.getInfo
    @btl.forceEscape
    @btl.if
    @btl.cev
    @btl.abort
    @btl.backdrop
    @btl.anim
    
    @enemy.hp
    @enemy.mp
    @enemy.state
    @enemy.appear
    
    @pic.show
    @pic.move
    @pic.erase
    @pic.strpic
    @pic.getInfo
    @pic.setId
    @pic.setPixel
    @pic.drawTile
    
    @img.save
    
    @label.set
    @label.jump
    @goto
    
    @loop
    @countUp
    @countDown
    @while
    @doWhile
    @foreach
    @break
    @continue
    
    @bgm.play
    @bgm.stop
    @bgm.fadeout
    @bgm.store
    @bgm.restore
    
    @se.play
    @se.stop
    
    @movie.play
    
    @key.input
    @key.inputEx
    
    @anim.show
    
    @ev.setPos
    @ev.swap
    @ev.setAction
    @ev.setAnim
    @ev.flash
    @ev.execAction
    @ev.stopAction
    @ev.abort
    @ev.erase
    @ev.call
    @call
    
    @save.getInfo
    @save.save
    @save.load
    
    @gsave
    @mouse
    @comment
    @cmd
    @if
    v
    s
    t
    
    @raw
    
    
◆文章の表示
    @msg.show 
    
    [引数]
    文字列                  文章
    .br                     改行
    その他                  文字列に変換
    
    引数が複数与えられた場合は連結されます
    また、ソース中の以下の記述は文章表示と解釈されます
    
    単独の文字列            "txt" または 「文章」
    
    
    
◆文章オプションの設定
    @msg.opt
    
    [引数]
    .opaq                   通常ウィンドウ（デフォルト）
    .trans              
    .transparent            透明ウィンドウ
    .top                    上部配置
    .middle                 中央配置
    .bottom                 下部配置（デフォルト）
    .varyPos                主人公に合わせて配置を変更
    .allowEventMove         表示中にイベント移動を許可
    
    .size(a, b)             文章ウィンドウの横幅aと縦幅b　0で変更なし
    
    .font(a, b)             文章ウィンドウのフォント名aとサイズb
    
    
◆顔グラフィックの設定
    @msg.face
    
    [引数]
    文字列                  ファイル名
    文字列変数              ファイル名
    
    数値                    ファイル内インデックス
    変数                    ファイル内インデックス
    a..b                    アニメするインデックスa～b
    
    .left                   左側配置（デフォルト）
    .right                  右側配置
    .hrev               
    .hreverse               水平方向に反転
    .force                  文章表示中など動作が抑制される場面でも強制変更

    [アニメさせるときの引数]
    .interval(a, b, c)      待ち時間。基本フレームa, 乱数増減b, 乱数を加算に限定するフラグc
    .fpc(a, b, c)           1枚の表示時間。基本フレームa, 乱数増減b, 乱数を加算に限定するフラグc
    .once                   アニメをループしない
    .loopback(a)            指定範囲を終えたあと折り返す。折り返しでインターバルを設けるかのフラグa
    

◆選択肢の表示
    @msg.choice

    [引数]
    .case                   各選択肢
    .cancel                 キャンセルの挙動
    
    [caseの引数]   
    文字列                  選択肢のテキスト
    その他                  選択肢の実行内容
    
    [cancelの引数] 
    文字列                  任意の選択肢のテキスト
    数値                    任意の選択肢のインデックス
    .ignore                 無視（デフォルト）
    その他                  キャンセル時の実行内容
    

◆数値入力の処理
    @msg.input
    @msg.inputNum
    
    [引数]
    .digit(n)           桁数
    .dst(n)             結果を受け取る変数
    
    
◆文章処理の制御
    @msg.hook
    
    .e                  文中の\eを監視する
    .showing            ウィンドウ生成を監視する
    .closing            ウィンドウ破棄を監視する
    .blit               文字の描画を監視する
    
    .cev(a)             通知を受け取るコモンイベントa
    
    .sys(v[a], t[b])    システムからの引数を受け取る変数の先頭a, 文字列変数の先頭b
    .user(v[a], t[b])   ユーザーからの引数を受け取る変数の先頭a, 文字列変数の先頭b
    
    
    
◆タイマーの操作
    @timer

    [引数]
    .set(n)             秒数
    .start              開始
    .stop               停止
    .show               タイマーを表示
    .continueInBattle   戦闘中も継続
    .timer1             タイマー1を操作（デフォルト）
    .timer2             タイマー2を操作
    
    
◆所持金の増減
    @party.money
    
    [引数]
    .add(n)             増加値
    .sub(n)             減少値

    
◆アイテムの増減
    @party.item
    
    [引数]
    配列                アイテムID
    .add(n)             増加値
    .sub(n)             減少値


◆メンバーの入れ替え
    @party.member
    
    [引数]
    .add(n)             加入するアクター
    .sub(n)             離脱するアクター


◆経験値の増減
    @actor.exp
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             増加値
    .sub(n)             減少値
    .notify             レベルアップメッセージを表示


◆レベルの増減
    @actor.level
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             増加値
    .sub(n)             減少値
    .notify             レベルアップメッセージを表示


◆能力値の増減
    @actor.param
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             増加値
    .sub(n)             減少値
    .hp                 増減項目を最大HPにする
    .mp                 増減項目を最大MPにする
    .atk                増減項目を攻撃力にする
    .def                増減項目を防御力にする
    .mag                増減項目を精神力にする
    .spd                増減項目を敏捷性にする
    
    
◆特殊技能の増減
    @actor.skill
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             習得する特技ID
    .sub(n)             忘却する特技ID

    
◆装備の変更
    @actor.equipment
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             装備するアイテムID
    .removeWeapon       武器を外す
    .removeShield       盾を外す
    .removeHelm         兜を外す
    .removeArmor        鎧を外す
    .removeAccessory    装飾を外す
    .clear              全装備を外す
    

◆HPの増減
    @actor.hp

    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             増加値
    .sub(n)             減少値
    .possibleDie        操作による死亡を許可する    
    
◆MPの増減
    @actor.mp

    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             増加値
    .sub(n)             減少値


◆状態の変更
    @actor.state

    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .add(n)             付与する状態
    .sub(n)             解除する状態
  
  
◆全回復
    @actor.recoverAll
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    

◆ダメージの処理
    @actor.damage
    
    [引数]
    配列                対象のアクターID
    .all                対象をパーティメンバー全員にする
    .value(n)           基本ダメージ
    .defModifier(n)     防御力の影響度
    .magModifier(n)     精神力の影響度
    .variance(n)        分散度
    .dst(n)             ダメージ値を受け取る変数

    
◆主人公の名前変更
    @actor.name
    
    [引数]
    配列                対象のアクターID
    文字列              名前

    
◆主人公の肩書き変更
    @actor.nickname
    
    [引数]
    配列                対象のアクターID
    文字列              肩書き


◆主人公の歩行グラフィック変更
    @actor.body
    
    [引数]
    配列                対象のアクターID
    文字列              ファイル名
    数値                ファイル内インデックス
    .trans              半透明にする

◆主人公の顔グラフィック変更
    @actor.face
    
    [引数]
    配列                対象のアクターID
    文字列              ファイル名
    数値                ファイル内インデックス
    

◆乗り物のグラフィック変更
    @vehicle.body
    
    [引数]
    文字列              ファイル名
    数値                ファイル内インデックス
    .boat               小型船を対象にする
    .ship               大型船を対象にする
    .airship            飛行船を対象にする
    

◆システムBGMの変更
    @sys.bgm

    [引数]
    文字列              ファイル名
    .battle             戦闘BGMを対象にする
    .endBattle          バトル終了BGMを対象にする
    .inn                宿屋BGMを対象にする
    .boat               小型船BGMを対象にする
    .ship               大型船BGMを対象にする
    .airship            飛行船BGMを対象にする
    .gameover           ゲームオーバーBGMを対象にする
    .opt(a, b, c, d)    BGMの フェードイン時間、ボリューム、テンポ、バランスを設定する    

    
◆システム効果音の変更
    @sys.se
    
    [引数]
    .cursor             カーソルSEを対象にする
    .decision           決定SEを対象にする
    .cancel             キャンセルSEを対象にする
    .buzzer             ブザーSEを対象にする
    .escape             逃走SEを対象にする
    .enemyAttack        敵攻撃SEを対象にする
    .enemyDamage        敵ダメージSEを対象にする
    .actorDamage        味方ダメージSEを対象にする
    .avoid              回避SEを対象にする
    .defeat             撃退SEを対象にする
    .item               アイテム使用SEを対象にする
    .opt(a, b, c)       SEの ボリューム、テンポ、バランスを設定する    


◆システムグラフィックの変更
    @sys.skin
    
    [引数]
    文字列              ファイル名
    .stretch            拡大表示
    .tiled              並べて表示
    .gothic             ＭＳ ゴシック
    .mincho             ＭＳ 明朝
    
    
◆画面切り替え方式の変更
    @sys.transition
    
    [引数]
    数値                切り替え方式
    .transfer_hide      場所移動（消去）
    .transfer_show      場所移動（表示）
    .beginBattle_hide   戦闘開始（消去）
    .beginBattle_show   戦闘開始（表示）
    .endBattle_hide     戦闘終了（消去）
    .endBattle_show     戦闘終了（表示）


◆場所移動
◆記憶した場所に移動
    @map.setPlayer
    @player.setPos
    
    [引数]
    配列                マップID
    .pos(x, y)          座標
    .retain             プレイヤーの向きを維持する（定数指定時のみ、デフォルト）
    .up                 上を向く（定数指定時のみ）
    .right              右を向く（定数指定時のみ）
    .down               下を向く（定数指定時のみ）
    .left               左を向く（定数指定時のみ）

    
◆場所の記憶
    @map.getPlayerPos
    @map.getPlayer
    @player.getPos
    
    [引数]
    引数0               マップIDの格納変数
    引数1               x座標の格納変数
    引数2               y座標の格納変数

    
◆乗り物の乗降
    @vehicle.ride


◆乗り物の位置を設定
    @map.setVehicle
    @map.setVehiclePos
    @vehicle.setPos
    
    
    [引数]
    配列                マップID
    .pos(x, y)          座標
    .boat               小型船
    .ship               大型船
    .airship            飛行船
    .retain             向きを維持する（デフォルト）
    .up                 上を向く
    .right              右を向く
    .down               下を向く
    .left               左を向く
    

◆イベントの位置を設定
    @map.setEv
    @map.setEvPos
    @ev.setPos
    
    [引数]
    配列                イベントID
    .player             主人公
    .boat               小型船
    .ship               大型船
    .airship            飛行船
    .self               このイベント
    
    .pos(x, y)          座標
    
    .retain             向きを維持する（デフォルト）
    .up                 上を向く
    .right              右を向く
    .down               下を向く
    .left               左を向く
    .face(x)            x(上=0, 右, 下, 左)を向く
    
    
◆イベントの位置を交換
    @ev.swap
    
    [引数]
    配列                イベントID
    数値                交換対象ID
    .self               交換対象をこのイベントにする
    

◆指定位置の地形ID取得
    @map.getTerrain
    
    [引数]
    .pos(x, y)          座標
    .dst(n)             出力先

    
◆指定位置のイベントID取得
    @map.getEv
    
    [引数]
    .pos(x, y)          座標
    .dst(n)             出力先

    
◆画面の消去
    @scr.hide
    
    [引数]
    数値                消去方法
    .default            システムの切り替え方式に従う（デフォルト）


◆画面の表示
    @scr.show
    
    [引数]
    数値                表示方法
    .default            システムの切り替え方式に従う（デフォルト）


◆画面の色調変更
    @scr.tint
    
    [引数]
    .rgbs(r, g, b, s)   赤、緑、青、彩度
    .time(n)            変更にかける時間 n * 0.1 sec
    .wait               完了までウェイト


◆画面のフラッシュ
    @scr.flash
    
    [引数]
    .rgbv(r, g, b, v)   赤、緑、青、強さ
    .once(n)            一度だけ実行　時間 n * 0.1 sec
    .begin(n)           フラッシュ開始　時間 n * 0.1 sec
    .end                フラッシュ終了
    .wait               完了までウェイト

    
◆画面のシェイク
    @scr.shake
    
    [引数]
    .value(a, b)        強さ、速さ
    .once(n)            一度だけ実行 時間 n * 0.1 sec
    .begin(n)           シェイク開始　時間 n * 0.1 sec
    .end                シェイク終了
    .wait               完了までウェイト

    
◆画面のスクロール
    @scr.scroll
    
    [引数]
    .fix                固定
    .unfix              固定解除
    .restore            位置を戻す
    .shift(n)           nマスずらす
    .pxShift(h, v)      ピクセル単位で水平、垂直方向に指定値ずらす
    .set(x, y)          ピクセル単位で座標指定
    .up
    .right
    .down
    .left               操作が shift のときの方向
    .speed(n)           操作が shift/restore のとき　移動速度1~6
                        操作が pxShift/set のとき　1フレームの移動量 n * 0.001
    .time               操作が pxShift/set のとき　移動にかけるフレーム
    .wait               完了までウェイト
    .center             操作が set のとき　指定値を中心座標として扱う
    .relative           操作が set のとき　指定値を現在位置からの相対座標として扱う
    .legacy             旧仕様の座標設定処理を使う(非推奨)
    
◆画面のズーム

    @scr.zoom
    
    [引数]
    .pos x, y           座標(x, y)を中心に据える
    .rate a             拡大率a％　有効値は100以上
    .time a             移動にかけるフレーム
    .layer a            aまでのレイヤをズームの対象にする
    .wait               移動完了までウェイト

    ※レイヤ0で解除
    
    
◆天候エフェクトの設定
    @scr.weather
    
    [引数]
    .none               なし
    .rain               雨    
    .snow               雪
    .mist               霧
    .sandstorm          砂嵐
    .weak               エフェクトの強さ　弱
    .medium             エフェクトの強さ　中
    .strong             エフェクトの強さ　強
    

◆ピクチャ表示
    @pic.show
    
    [引数]
    配列                ピクチャID
    文字列              ファイル名
    文字列変数          ファイル名
    
    .pos(x, y)          座標
    .center             中心座標
    .topLeft            左上座標
    .bottomLeft         左下座標
    .topRight           右上座標
    .bottomRight        右下座標
    .top                上座標
    .bottom             下座標
    .left               左座標
    .right              右座標
    
    .scrollWithMap      マップスクロール連動
    .useChromakey       透過色あり
    .chromakey(n)       透過色の有無を指定
    
    .scale(n)           拡大率n%
    .scale2(a, b)       横の拡大率a%, 縦b%
    
    .trans(n)              
    .transparency(n)    透明度
    .rgbs(r, g, b, s)   色調
    
    .rotate(n)          回転エフェクト
    .wave(n)            波形エフェクト
    .angle(a, b)        角度指定エフェクト a / b
    
    .multi              乗算
    .add                加算
    .overlay            オーバーレイ
    
    .hrev
    .hreverse           水平方向に反転
    .vrev
    .vreverse           垂直方向に反転
    .hvrev
    .hvreverse          水平/垂直方向に反転
    
    .repl(a, b)         ファイル名末尾a字を変数bで置換
    
    .grid(a, b)         スプライトシートとしてa, bで分割
    .cell(n)            スプライトシートの表示ID
    
    .anim(n)          
    .animation(n)       スプライトシートをアニメーション表示(一枚あたりの表示フレームn)
    .rangeAnim(a, b, c) ID[b..c]でアニメーション(一枚あたりの表示フレームa)
    
    .once               アニメーションを1度だけ再生
    .repeat             アニメーションを繰り返し再生
    
    .mapLayer           フィールドでのレイヤー
    .battleLayer        戦闘中のレイヤー

    .eraseWhenTransfer  マップ移動時に消去
    .eraseWhenEndBattle 戦闘終了時に消去
    .affectedByTint     画面の色調の影響を受ける
    .affectedByFlash    画面のフラッシュの影響を受ける
    .affectedByShake    画面のシェイクの影響を受ける
  
  
◆ピクチャ移動
    @pic.move
    
    [引数]
    配列                ピクチャID
    
    .pos(x, y)          座標
    .center             中心座標
    .topLeft            左上座標
    .bottomLeft         左下座標
    .topRight           右上座標
    .bottomRight        右下座標
    .top                上座標
    .bottom             下座標
    .left               左座標
    .right              右座標
    
    .scale(n)           拡大率n%
    .scale2(a, b)       横の拡大率a%, 縦b%
    
    .trans(n)              
    .transparency(n)    透明度
    .rgbs(r, g, b, s)   色調（変数使用可）
    
    .rotate(n)          回転エフェクト
    .wave(n)            波形エフェクト
    .angle(a, b)        角度指定エフェクト a / b
    
    .multi              乗算
    .add                加算
    .overlay            オーバーレイ
    
    .hrev
    .hreverse           水平方向に反転
    .vrev
    .vreverse           垂直方向に反転
    .hvrev
    .hvreverse          水平/垂直方向に反転
    
    .time(n)            移動時間 n * 0.1 sec
    .wait               完了までウェイト
  
    .relative           座標、拡大率、透明度を相対値で指定
    .keepRgbs           色調の値を変更しない
    .keepEffect         特殊効果を変更しない
    .keepBlend          ブレンドモードを変更しない
    .keepFlip           反転状態を変更しない
    .keepTime           所要時間を変更しない
    
  
◆ピクチャ消去
    @pic.erase

    [引数]
    配列                ピクチャID
    .all                対象を全ピクチャにする
    

◆戦闘アニメの表示
    @anim.show
    
    [引数]
    配列                戦闘アニメID
    数値                対象のイベントID
    変数                対象のイベントID

    .target(n)          対象のイベントID
    .player             プレイヤー
    .boat               小型船
    .ship               大型船    
    .airship            飛行船
    .self               このイベント
    
    .picTarget(a)       ピクチャaに追従
    .pos(a, b)          指定座標(a, b)に表示
    .bind(a, b)         変数(a, b)の値に追従
    
    .buffer(a)          バッファaで再生
    
    .reverse(a)         反転の有無a
    .wait               完了までウェイト
    .tiled              画面全体に並べる

    ※picTarget/pos/bind は tiled と併用不可


◆主人公の透明状態変更
    @player.trans
    @player.transparent

    [引数]
    数値                数値で状態指定
    .on                 透明
    .off                解除
    

◆キャラクターのフラッシュ
    @ev.flash
    
    [引数]
    配列                イベントID
    .player             プレイヤー
    .boat               小型船
    .ship               大型船    
    .airship            飛行船
    .self               このイベント
    
    .rgbv(r, g, b, v)   赤、緑、青、強さ
    .time(n)            動作にかける時間　n * 0.1 sec
    .wait               完了までウェイト
    

◆キャラの動作指定
    @ev.setAction
    
    [引数]
    配列                イベントID
    
    .act
    ブロック            サブコマンド
    
    .player             プレイヤー
    .boat               小型船
    .ship               大型船    
    .airship            飛行船
    .self               このイベント
    
    .freq(n)            移動頻度
    .repeat             動作を繰り返す
    .skippable          移動できない場合は無視（デフォルト）
    .unskippable        移動可否に関わらず無視しない

    [サブコマンド]
    .moveUp
    .moveRight
    .moveDown
    .moveLeft
    .moveUpperRight
    .moveLowerRight
    .moveUpperLeft
    .moveLowerLeft
    .moveRandom
    .moveToward
    .moveAway
    .moveForward
    .faceUp
    .faceRight
    .faceDown
    .faceLeft
    .turnRight
    .turnLeft
    .turnBack
    .turnSide
    .turnRandom
    .turnToward
    .turnAway
    .pause
    .beginJump
    .endJump
    .fixDir
    .unfixDir
    .speedUp
    .speedDown
    .freqUp
    .freqDown
    .switchOn(id)
    .switchOff(id)
    .setBody(file, idx)
    .se(file, vol, pitch, balance)
    .beginThrough
    .endThrough
    .pauseAnim
    .resumeAnim
    .transUp
    .transDown
    

◆キャラの動作追加
    @ev.addAction
    
    [引数]
    .moveUp(n)
    .moveRight(n)
    .moveDown(n)
    .moveLeft(n)
    .moveUpperRight(n)
    .moveLowerRight(n)
    .moveUpperLeft(n)
    .moveLowerLeft(n)
    .moveRandom(n)
    .moveRandom(n)
    .moveToward(n)
    .moveAway(n)
    .moveForward(n)             それぞれにn歩移動
    .move(a, b)                 aにb歩移動
    
    .faceUp
    .faceRight
    .faceDown
    .faceLeft
    .turnRight
    .turnLeft
    .turnBack
    .turnSide
    .turnRandom
    .turnToward
    .turnAway
    .face(a)                    aを向く
    
    .pause
    
    .beginJump
    .endJump
    .jump (a), (b)              現在位置からx軸はa、y軸はbだけジャンプ
    
    .fixDir
    .unfixDir
    .setBody(file, idx)
    .se(file, vol, pitch, balance)
    .beginThrough
    .endThrough
    .pauseAnim
    .resumeAnim                 

    .speed(n)                   移動速度の設定（-3~2）
    .freq(n)                    移動頻度の設定（0~7）
    .switch(id, val)            スイッチID, 真偽値
    .trans(n)                   透明度の設定（0~7）
    
    
    [.move の引数a]
    00: 上に移動
    ...
    11: 前進


    [.face の引数a]
    00: 上を向く
    ...
    10: 主人公の逆を向く
    
    

◆指定動作の全実行
    @ev.execAction
    

◆指定動作の全解除
    @ev.stopAction

    
◆ウェイト
    @sys.wait
    @wait
    
    [引数]
    数値                時間 n * 0.1 sec
    変数                時間 n * 0.1 sec
    .input              時間の代わりにキー入力待機
    .frame              時間の単位をフレームにする
    

◆BGMの演奏
    @bgm.play
    
    [引数]
    文字列              ファイル名
    文字列変数          ファイル名
    .opt(a, b, c, d)    フェードイン時間、ボリューム、テンポ、バランス    

    
    @bgm.stop
    
    

◆BGMのフェードアウト
    @bgm.fadeout
    
    [引数]
    数値                フェードアウト時間
    

◆現在のBGM
    @bgm.store


◆記憶したBGMを演奏
    @bgm.restore

    
◆効果音の演奏
    @se.play
    
    [引数]
    文字列              ファイル名
    文字列変数          ファイル名
    .opt(a, b, c)       ボリューム、テンポ、バランス    


    @se.stop

    
◆ムービーの再生
    @movie.play
    
    [引数]
    文字列              ファイル名
    .pos(a, b)          座標
    .size(a, b)         表示サイズ

    
◆キー入力の処理
    @key.input
    
    [引数]
    .dst(n)             結果を受け取る変数
    .wait               押されるまで待つ
    .elapsed            押されるまでの時間を受け取る変数
    
    .decision           
    .cancel
    .number
    .symbol
    .shift
    .down
    .left
    .right
    .up
    
    .lclick
    .rclick
    .mclick
    .wheelDown
    .wheelUp


◆チップセットの変更
    @map.tileset
    
    [引数]
    数値                タイルセットID
    変数                タイルセットID
    

◆遠景の変更
    @map.parallax
    
    [引数]
    文字列              ファイル名
    .hloop              水平方向にループ
    .vloop              垂直方向にループ
    .hscroll(n)         水平方向に自動スクロール
    .vscroll(n)         垂直方向に自動スクロール

    
◆チップの置換
    @map.replaceTile
    
    [引数]
    配列                元のチップID
    数値                置き換えるチップID
    .lower              下層
    .upper              上層


◆敵出現歩数の変更
    @btl.encounterRate
    
    [引数]
    数値                歩数


◆セーブ画面の呼び出し（システム機能の呼び出し）
    @sys.call
    
    [引数]
    .saveMenu           セーブ画面
    .loadMenu           ロード画面    
    .partyMenu          パーティメニュー
    .optionMenu         オプションウィンドウ
    .licenseMenu        ライセンスウィンドウ    
    .debugMenu          デバッグウィンドウ    
    .toggleScreen       フルスクリーンモード切替
    .f12                ゲームリセット
    
    .pause              一時停止（デバッグウィンドウのみ）

    
◆セーブ禁止の変更（システム機能の制御）
    @sys.limitation
    
    [引数]
    .saveMenu           セーブ画面を禁止
    .partyMenu          パーティメニューを禁止
    .toggleScreen       スクリーン切り替え（F4）を禁止
    .optionMenu         オプションウィンドウ（F5）を禁止
    .debugMenu          デバッグウィンドウ（F9）を禁止
    .f12                ゲームリセット（F12）を禁止
    
    
    
◆ラベルの設定
    @label.set
    
    [引数]
    数値                ラベル番号
    文字列              ラベル名（番号を自動割り振り）
    
    
    以下の記述も可能
    
    (ラベル名):
    
    
◆指定ラベルへ飛ぶ
    @label.jump
    @goto
    
    [引数]
    数値                ラベル番号
    文字列              ラベル名（番号を自動割り振り）

    
◆繰り返し処理
    無限ループ/回数指定
    
    @loop
    
    [引数]
    数値                
    変数
    スイッチ            ループ回数
    .inf                無限ループ（デフォルト）
    .dst                インデックスを受け取る変数（回数指定時のみ）
    その他              ループ内容

    
    カウントアップ/カウントダウン
    
    @countUp / @countDown
    
    [引数]
    範囲                カウントする範囲
    .dst                インデックスを受け取る変数
    その他              ループ内容

    
    条件ループ
    
    @while / @doWhile
    
    [引数]
    比較演算            条件式（==, >=, <=, >, <, !=）
    .dst                インデックスを受け取る変数
    その他              ループ内容
    
    
    要素列挙
    
    @foreach
    
    [一時配列の場合の引数]
    配列                列挙する要素（定数、変数、変数番変数）
    .dst                要素、インデックスを受け取る変数
    その他              ループ内容
    
    [ポインタ配列の場合の引数]
    変数                配列の先頭 // 配列の先頭をさらにポインタで指定することはできない。 - TkHuskarl
    .cnt                要素数
    .dst                要素、インデックスを受け取る変数
    その他              ループ内容

    [マップイベントの場合の引数]
    .mev
    .dst                イベントID、インデックスを受け取る変数
    その他              ループ内容


◆繰り返し処理の中断
    @break
    
    [引数]
    数値                抜け出すブロックの数
    .level(n)           抜け出すブロックの数
    
    

◆繰り返しのスキップ
    @continue
    
    [引数]
    数値                抜け出すブロックの数
    .level(n)           抜け出すブロックの数
    
    

◆イベント処理の中断
    @ev.abort
    

◆イベントの一時消去
    @ev.erase
    
    
◆イベントの呼び出し
    @ev.call
    @call
    
    [引数]
    .cev(n)
    .cmn(n)
    .common(n)          コモンイベント ID
    .mev(a, b)
    .map(a, b)          マップイベント ID, ページ
    

◆注釈
    @comment
    
    [引数]
    文字列              コメント内容
    
    
◆ゲームオーバー
    @sys.gameover
    
    
◆タイトルへ戻す
    @sys.reset
    
    
◆シャットダウン
    @sys.shutdown
    
    
◆セーブ情報の取得
    @save.getInfo
    
    [引数]
    配列                セーブ番号
    .datetime(a, b)     日付、時刻を受け取る変数
    .leader(a, b)       先頭メンバーのレベル、HPを受け取る変数
    .level(a)           先頭メンバーのレベルを受け取る変数
    .hp(a)              先頭メンバーのHPを受け取る変数
    .name(a)            先頭メンバーの名前を受け取る文字列変数
    .face(a, b, c, d)   メンバーの顔グラフィックを描画するピクチャID
    
    
◆セーブの実行
    @save.save
    
    [引数]
    
    配列                セーブ番号
    .res(n)
    .result(n)          セーブの結果を受け取る変数
    
    
◆ロードの実行
    @save.load
    
    [引数]
    
    配列                セーブ番号
    .disableFileCheck   ファイル内容のチェックを無効化する
    .disableBlackout    ロード時の暗転を無効にする
    
    
◆マウス座標の取得/設定
    @mouse
    
    [引数]
    .getPos(a, b)       座標を受け取る変数
    .setPos(a, b)       設定する座標
    
    
◆文字列ピクチャの表示
    @pic.strpic
    
    [引数]
    配列                ピクチャID
    文字列              描画テキスト
    
    .pos(a, b)          表示位置
    .center             中心座標
    .topLeft            左上座標
    .bottomLeft         左下座標
    .topRight           右上座標
    .bottomRight        右下座標
    .top                上座標
    .bottom             下座標
    .left               左座標
    .right              右座標

    .scrollWithMap      マップスクロール連動
    .useChromakey       透過色あり
    .chromakey(n)       透過色の有無を設定
    
    .scale(n)           拡大率n%
    .scale2(a, b)       横の拡大率a%, 縦b%

    .trans(n)           透明度n%
    .rgbs(r, g, b, s)   色調
    
    .size(a, b)         ピクチャのサイズ
    .font(a, b)         フォント名、フォントサイズ
    .skin(a)            描画に使うグラフィックファイル名
    
    .noframe            ウィンドウの外枠を無効にする
    .noGradation        文字のグラデーションを無効にする
    .noShadow           文字の影を無効にする
    .noPadding          文字の外側の余白を無効にする
    
    .nobg               ウィンドウの背景を描画しない
    .stretch            拡大描画
    .tiled              並べて描画
    
    .bold               太字にする
    .charSpacing(n)     文字間隔
    .lineSpacing(n)     行間隔
    .spacing(a, b)      文字間隔/行間隔
    
    .rotate(n)          回転エフェクト
    .wave(n)            波形エフェクト
    .angle(a, b)        角度指定エフェクト a / b
    
    .multi              乗算
    .add                加算
    .overlay            オーバーレイ
    
    .hrev
    .hreverse           水平方向に反転
    .vrev
    .vreverse           垂直方向に反転
    .hvrev
    .hvreverse          水平/垂直方向に反転
    
    .mapLayer           フィールドでのレイヤー
    .battleLayer        戦闘中のレイヤー

    .eraseWhenTransfer  マップ移動時に消去
    .eraseWhenEndBattle 戦闘終了時に消去
    .affectedByTint     画面の色調の影響を受ける
    .affectedByFlash    画面のフラッシュの影響を受ける
    .affectedByShake    画面のシェイクの影響を受ける
    
    
◆ピクチャ情報の取得
    @pic.getInfo
    
    [矩形のときの引数]
    配列                        ピクチャID
    .baseRect(a, b, c, d)       拡大補正なしの矩形
    .currentRect(a, b, c, d)    現在の矩形
    .goalRect(a, b, c, d)       移動完了後の矩形
    
    .xywh                       矩形の値を x, y, w, h とする
    .ltrb                       矩形の値を left, top, right, bottom とする
    .cewh                       矩形の値を cx, cy, w, h とする
    
    [ピクセルのときの引数]
    配列                        ピクチャID
    .pixel(a, b, c, d)          取得する矩形(xywh)    
    
    .dst(a)                     結果の出力先
    .ignoreA                    ピクセルのα値を無視する
    .dynamic                    エフェクトありの値を取得
    .static                     エフェクトなしの値を取得（デフォルト）


◆ピクチャ編集
    @pic.setPixel
    
    [引数]
    配列                        ピクチャID
    .xywh(a, b, c, d)           変更する矩形    
    .src(a)                     ピクセル情報が格納された変数番号の先頭
    
    .opaq                       ピクセルのAを指定値にかかわらず常に0xFFとする
    .skipTrans
    .skipTransparent            透明なピクセルデータは適用しない


◆ピクチャ編集(タイル)
    @pic.drawTile
    
    [引数]
    配列                        ピクチャID
    .xywh(a, b, c, d)           変更する矩形    
    .src(a)                     タイルIDが格納された変数番号の先頭
    .lower                      下層を描画する
    .upper                      上層を描画する

    .single (n)                 単一のタイルnで描画する
    .range (n)                  指定範囲ぶんのタイルIDを変数nから読み取る

    .disableAutoTile            下層描画でオートタイル処理を無効にする
    .wipe                       描画前に指定範囲をクリアする

    .tilesetId (n)              描画に使うタイルセット
    .pattern (n)                アニメパターン
    
    ※タイルIDは「マップの書き換え」コマンドと同じ
    ※tilesetId に 0 指定で現在マップのものを使う
    ※パターンに -1 指定でマップと同じ状態のパターンを使う    

    
◆画像出力
    @img.save
    
    [引数]
    .screen                     ゲーム画面を対象にする
    .pic(a)                     ピクチャを対象にする
    
    .static                     (ピクチャのとき)色調・フラッシュを反映しない
    .dynamic                    (ピクチャのとき)色調・フラッシュを反映する
    
    .opaq                       (ピクチャのとき)全てのピクセルを不透明とする
    
    .dst(n)                     出力ファイル名
    
    
◆キー入力の処理EX
    @key.inputEx
    
    [引数]
    .keybd                      キーボードの状態を取得する
    .keybdWithBind              キーボードの状態をバインドありで取得する
    .keyCode(n)                 コードnのキー状態を取得する
    .joy                        ジョイパッドの状態を取得する
    .getBind                    ジョイパッドの割り当て状態を取得する
    .setBind                    ジョイパッドの割り当て状態を設定する
    
    .src(n)                     
    .dst(n)                     取得または設定に使う変数の先頭
    
    
◆マップの書き換え
    @map.rewrite
    
    [引数]
    .pos(a, b)                  書き換え位置の始点
    .size(a, b)                 書き換え範囲
    .xywh(a, b, c, d)           書き換え位置の始点と範囲
    .lower                      対象を下層レイヤーにする
    .upper                      対象を上層レイヤーにする
    .single(n)                  単一のタイルnで書き換える
    .range(n)                   指定範囲ぶんのタイルIDを変数nから読み取る
    .disableAutoTile            下層レイヤー書き換え時、オートタイル処理を無効にする


◆変数配列の操作
    コピー 
    v[tag1].copy(v[tag2], count)

    値を交換
    v[tag1].swap(v[tag2], count)

    昇順ソート
    v[tag1].sort(count)
    
    降順ソート
    v[tag1].sortDescending(count)
    
    シャッフル
    v[tag1].shuffle(count)
    
    値の列挙
    v[tag1].enum(beg, count)
    
    参照外し
    v[tag1].deref(v[tag2], count)
    
    二項演算
    v[tag1].***(v[tag2].count)
    
    .add
    .sub
    .mul
    .div
    .mod
    .or
    .and
    .xor
    .shl
    .shr
    
    [ソート/シャッフルオプション]
    .sync(a)                      連動して操作する配列の先頭a
    
    
◆共有セーブの操作
    開く/閉じる/保存/保存して閉じる
    @gsave.open
    @gsave.close
    @gsave.save
    @gsave.saveAndClose
    
    スイッチ/変数/文字列変数操作
    gs[a].***(s[b], count)
    gv[a].***(v[b], count)
    gt[a].***(t[b], count)
    
    copyto
    copyTo              共有セーブからコピー
    copyfrom
    copyfrom            共有セーブにコピー
    

◆ピクチャのID変更
    @pic.setId
    
    [引数]
    配列                ピクチャID
    
    .move(a, b)         aに長さbぶん移動
    .swap(a, b)         aと長さbぶんIDを交換
    .slide(a, b)        長さbぶんIDをaずらす
    
    .ignoreError        範囲外IDの操作をエラーにしない    



◆ゲームのオプション設定
    @sys.gameOpt
    
    [引数]
    .pauseWhenInactive      非アクティブ時一時停止
    .runWhenInactive        非アクティブ時継続して動作    
    .fatal(a, b, c)         FPS、テストプレイ、メッセージスキップをそれぞれ設定します
    .picLimit(n)            ピクチャIDの上限を設定する
    .animLimit(n)           戦闘アニメ表示数の上限を設定する
    .fullFrame              フレームスキップなし
    .oneFifth               5フレームに1度描画処理を飛ばす
    .oneThird               3フレームに1度描画処理を飛ばす    
    .oneHalf                2フレームに1度描画処理を飛ばす
    .mouse.disableMsgProcession(n) 
                            マウスでの文章ウィンドウ操作を制御(許可=0, 禁止)
    
    .btlOrigin                 デフォ戦画面の表示位置を指定
        .center             中心
        .topLeft            左上
        .bottomLeft         左下
        .topRight           右上
        .bottomRight        右下
        .top                上
        .bottom             下
        .left               左
        .right              右
    
    .winFaceSize(a, b)      文章ウィンドウの顔グラ横幅a, 縦幅b
    
    
    ※このコマンドの引数は項目が被るものを除いて適切に複数コマンドに分けられます
    

◆コマンドの呼び出し
    @cmd
    
    [引数]
    数値                コマンドコード
    文字列              コマンドの文字列引数
    配列                数値引数を直接指定する場合の各引数
    `[(expr), ...]      数値引数を計算式で指定する場合の各引数           
    .args(a, b)         数値引数を変数配列で指定する場合の変数の先頭aと要素数b

    


◆条件分岐
    @if 
    
    ・スイッチ
        s[n]
        
        [引数]
        .isOn                   スイッチがON（デフォルト）
        .isOff                  スイッチがOFF
        
    
    ・変数
        l (op) r
        
        [op]
        比較演算                変数比較（==, >=, <=, >, <, !=）
    
    
    ・文字列変数
        文字列変数 (op) 文字列
        
        [op]
        .eq                     lがrと同じ
        .neq                    lがr以外
        .contains               lがrを含む
        .notContains            lがrを含まない

        [引数]
        .ignoreCase             大文字小文字の違いを無視
    
    
    ・所持金
        .money
    
        [引数]
        .geq(n)                 所持金がn以上
        .leq(n)                 所持金がn以下
        
    
    ・タイマー１、２
        .timer1
        .timer2
        
        [引数]
        .geq(n)                 残り秒数がn以上
        .leq(n)                 残り秒数がn以下
    
    
    ・アイテム    
        .item
        
        [引数]
        配列                    アイテムID
        .exists                 アイテムを所持
        .notExists              アイテムを非所持
    
    
    ・主人公
        .actor
        
        [引数]
        配列                    主人公ID
        .isMember               主人公がパーティにいる
        .isNamed(n)             主人公の名前がn
        .level.geq(n)           主人公のレベルがn以上
        .hp.geq(n)              主人公のHPがn以上
        .hasSkill(n)            主人公が特殊技能nを使用できる
        .isEquip(n)             主人公がアイテムnを装備している
        .hasState(n)            主人公が状態nになっている
    
    
    ・キャラ
        .ev
        
        [引数]
        配列                    キャラID
        .player
        .boat
        .ship
        .airship
        .self                   特殊イベント
        
        [向きの場合の引数]
        .facingUp               上を向いている
        .facingRight            右を向いている
        .facingDown             下を向いている
        .facingLeft             左を向いている
        
        [存在確認の場合の引数]
        .exists
        
    
    ・乗り物
        .boat
        .ship
        .airship
        
        .isDriven               に乗っている
        
        
    ・式
        `expr                   任意の式
        
        
    ・その他
        .triggeredByDecision    決定キーで開始
        .bgmHasLooped           BGMが一周
        .saveExists             セーブが存在する
        .testPlay               テストプレイが有効
        .atbWaitMode            ATBウェイトが有効
        .fullscreen             フルスクリーン状態
        .rightAfterLoad         ロード直後
        .enableJoy              ジョイパッドが有効
        .active                 ウィンドウがアクティブ
        .canOutput              ファイル出力可能
        
    
    
    .elif(...)              それ以外の場合の条件分岐とそれを満たした場合の実行内容
    .else(n)                それ以外の場合の実行内容
    
    その他                  条件を満たした場合の実行内容
    

◆スイッチの操作
    s[n].on
    s[n].off
    s[n].toggle
    s[n] = 1
    s[n] = 0
    
    
◆変数の操作

    [操作内容]

    v[a] = b                代入   
    v[a] += b               加算    
    v[a] -= b               減算
    v[a] *= b               乗算
    v[a] /= b               除算
    v[a] %= b               剰余
    v[a] |= b               Or
    v[a] &= b               And
    v[a] ^= b               Xor
    v[a] <<= b              Shl
    v[a] >>= b              Shr
    
    [特殊オペランド]
    item[a].count           アイテムaの所持数
    item[a].equipCount      アイテムaの装備数
    actor[a].level          主人公aのレベル
    actor[a].exp            主人公aの現在経験値
    actor[a].hp             主人公aのHP
    actor[a].mp             主人公aのMP
    actor[a].mhp            主人公aの最大HP
    actor[a].mmp            主人公aの最大MP
    actor[a].atk            主人公aの攻撃力
    actor[a].def            主人公aの防御力
    actor[a].mag            主人公aの精神力
    actor[a].spd            主人公aの敏捷性
    actor[a].weapon         主人公aの武器ID
    actor[a].shield         主人公aの盾ID
    actor[a].armor          主人公aの鎧ID
    actor[a].helm           主人公aの兜ID
    actor[a].accessory      主人公aの装飾品ID   
    actor[a].id             主人公aのID
    actor[a].gauge          主人公aのATBゲージ
    actor[a].reqExp         主人公aの次レベルに必要な経験値
    member[a].***           パーティメンバーaの***（.actorと同じ）
    ev[a].mapId             イベントaのマップID
    ev[a].x                 イベントaのX座標
    ev[a].y                 イベントaのY座標
    ev[a].dir               イベントaの向き
    ev[a].scrx              イベントaの画面X
    ev[a].scry              イベントaの画面Y
    ev[a].id                イベントaのID
    enemy[a].hp             敵キャラaのHP
    enemy[a].mp             敵キャラaのMP
    enemy[a].mhp            敵キャラaの最大HP
    enemy[a].mmp            敵キャラaの最大MP
    enemy[a].atk            敵キャラaの攻撃力
    enemy[a].def            敵キャラaの防御力
    enemy[a].mag            キャラaの精神力
    enemy[a].spd            敵キャラaの敏捷性
    enemy[a].id             敵キャラaのID
    enemy[a].gauge          敵キャラaのATBゲージ
    sys.money               所持金
    sys.timer1              タイマー1の残り秒数
    sys.timer2              タイマー2の残り秒数
    sys.memberCount         パーティメンバーの人数
    sys.saveCount           セーブ回数
    sys.battleCount         戦闘回数
    sys.winCount            勝利回数
    sys.loseCount           敗北回数    
    sys.escapeCount         逃走回数
    sys.tick                MIDIの演奏位置
    sys.date                日付
    sys.time                時刻
    sys.frame               経過フレーム
    sys.version             マニアクスのバージョン
    rnd(a, b)               
    pow                     
    sqrt                    
    sin                     
    cos
    atan2
    min
    max
    abs
    clamp
    muldiv
    divmul
    between                 変数操作式で使える数学関数
    lerp(a, b, t, td)       a + (t / td) * (b - a)
    sum(id, cnt)            v[id]..v[id+cnt-1] の合計値     
    amin(id, cnt)           v[id]..v[id+cnt-1] の最小値
    amax(id, cnt)           v[id]..v[id+cnt-1] の最大値
    
    
◆文字列変数（代入、連結）
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .asg                    代入
    .cat                    連結
    
    [文字列のオペランド]
    文字列                  値
    .min(n)                 最低字数
    .extract                文字列内の変数展開
    
    [数値のオペランド]
    数値                    値
    .min(n)                 最低桁数
    
    [スイッチのオペランド]
    スイッチ                値
    .min(n)                 最低字数
    
    [名前のオペランド]
    .actor[a].name
    .skill[a].name
    .item[a].name
    .enemy[a].name
    .troop[a].name
    .terrain[a].name
    .element[a].name
    .state[a].name
    .anim[a].name
    .tileset[a].name
    .s[a].name
    .v[a].name              
    .t[a].name              
    .cev[a].name            
    .class[a].name          
    .anim2[a].name          
    .map[a].name            
    .mev[a].name            
    .member[a].name         データの種類
    .static                 データベースの値を取得
    .dynamic                ゲームデータの値を取得
    .extract                文字列内の変数展開
    
    [説明のオペランド]
    .actor[a].desc
    .skill[a].desc
    .item[a].desc
    .member[a].desc         データの種類
    .static                 データベースの値を取得
    .dynamic                ゲームデータの値を取得
    .extract                文字列内の変数展開
    
    [連結のオペランド]
    .cat(a, b, c)           文字列
    .extract                文字列内の変数展開
    
    [挿入のオペランド]
    .ins(a, b, c)           ベース文字列a、インデックスb、挿入文字列c
    .extract                文字列内の変数展開
    
    [部分削除のオペランド]
    .rem
    .remove(a, b, c)        ベース文字列a、インデックスb、文字数c
    .extract                文字列内の変数展開
    
    [置換のオペランド]
    .rep(a, b, c)           ベース文字列a、検索文字列b、置換文字列c
    .extract                文字列内の変数展開
    
    [置換(正規表現)のオペランド]
    .exrep(a, b, c)      
    .exRep(a, b, c)         ベース文字列a、検索語句b、置換文字列c
    .first                  最初にマッチした文字列だけ置換する
    .extract                文字列内の変数展開
    
    [切り取りのオペランド]
    .subs(a, b, c)          ベース文字列a、インデックスb、文字数c
    .extract                文字列内の変数展開
    
    [配列のオペランド]
    .join(a, b, c)          区切り文字a、先頭要素b、要素数c
    .extract                文字列内の変数展開
    
    [ファイルのオペランド]
    .file(a)                ファイル名a
    .sjis                   エンコードをshift-jisに設定
    .utf8                   エンコードをutf-8に設定
    .extract                文字列内の変数展開

    
◆文字列変数（数値化）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .toNum(a, *)            数値化して変数aに出力
    
    [*（任意）]
    .extract                文字列内の変数展開
    .hex                    16進数として変換
    
    
◆文字列変数（長さ取得）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .getLen(a)              長さを変数aに出力

    
◆文字列変数（検索）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .inStr(a, b, *)         文字列aの出現位置を変数bに出力
    
    [*（任意）]    
    .beg(a)                 検索開始位置（文字数）
    .extract                検索文字列内の変数展開
    .hex                    数値の展開時16進数として変換


◆文字列変数（正規表現で検索）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .exInStr(a, b, *)       検索語句aの出現位置を変数bに出力
    
    [*（任意）]    
    .beg(a)                 検索開始位置（文字数）
    .extract                検索文字列内の変数展開
    .hex                    数値の展開時16進数として変換


◆文字列変数（正規表現で抽出）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .exMatch(a, b, c, *)    検索語句aのキャプチャをb、出現位置をcに出力
    
    [*（任意）]    
    .beg(a)                 検索開始位置（文字数）
    .extract                検索文字列内の変数展開
    .hex                    数値の展開時16進数として変換


◆文字列変数（分割）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .split(a, b, c, *)      文字列aで分割した配列を文字列変数bに、分割数を変数cに出力
    
    [*（任意）]
    .extract                分割文字列内の変数展開
    .hex                    数値の展開時16進数として変換


◆文字列変数（ファイル出力）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .toFile(a, *)           対象をファイル名aに出力
    
    [*（任意）]
    .sjis                   エンコードをshift-jisに設定
    .utf8                   エンコードをutf-8に設定
    .extract                ファイル名文字列の変数展開
    .hex                    数値の展開時16進数として変換


    
◆文字列変数（1行切り出し）
    [操作対象]
    t[n]
    t[v[n]]
    t[a..b]
    t[v[a]..v[b]]

    [操作内容]
    .popLine(a, *)          切り出した行をaに出力
    
    [*（任意）]
    .extract                文字列の変数展開
    .hex                    数値の展開時16進数として変換


    
◆ゲーム情報の取得
    @sys.getInfo
    
    [共通の引数]
    変数                    結果の出力先
    .dst                    結果の出力先
    
    [マップサイズ]
    .mapSize                マップのw, hを取得    
    
    -> dst[0] ~ dst[1]
    
    
    [タイルID]
    .tiles(x, y, w, h)      マップ内矩形xywhのタイルIDを取得
    .lower                  下層を取得
    .upper                  上層を取得
    
    -> dst[0] ~ dst[w * h]
    
    
    [解像度]
    .winSize                ウィンドウのw, hを取得
    
    -> dst[0] ~ dst[1]
    
    
    [画面のピクセルデータ]
    .pixel(x, y, w, h)      マップ内矩形xywhのピクセルを取得
    .ignoreA                ピクセルのα値を無視する
    
    -> dst[0] ~ dst[w * h]
    
    
    [イベント情報]
    .interpreter.current(n) 実行中イベントの呼び出し階層n※を取得
    
    ・階層
        0:  実行中
        n>0: 呼び出し階層を遡る
        n<0: 最初のイベントから辿る
    
    ・出力内容
        dst[0]                  イベントの種類※
        dst[1]                  イベントID
        dst[2]                  ページID
        dst[3]                  開始条件※
        dst[4]                  実行中の行
    
    ・イベントの種類
        01: マップイベント
        02: コモンイベント
        04: バトルイベント
    
    ・呼び出し理由
        00: 決定キー
        01: 接触
        02: 被接触
        03: 自動開始
        04: 並列処理
        05: 呼び出し
        06: 戦闘開始
        07: 並列処理（戦闘中）
        
        
    [チップセットID]
    .tilesetId                  
    
    
    [顔グラ]
    .face
    
    .actor[n]                   アクターnを対象にする
    .win                        文章ウィンドウ設定を対象にする
    
    .static                     プロジェクトデータを取得する
    .dynamic                    実行中のデータを取得する

    .dst (a), (b)               ファイルの出力先 T[a]、インデックス V[b]
    
    
    [歩行グラ]
    .body                   
    
    .actor[n]               アクターnを対象にする
    .ev[n]                  マップイベントnを対象にする
    
    .static                 プロジェクトデータを取得する
    .dynamic                実行中のデータを取得する

    .dst (a), (b)           ファイルの出力先 T[a]、インデックス V[b]
    
    
    [カメラ位置]
    .camera
    

    [シェイク]
    .shake                  画面のシェイク値のx, y
    
    
    [BGM]
    .bgm

    .dst (a), (b)           ファイルの出力先 T[a]、フェードイン/ボリューム/テンポ/バランス V[b..b+3]
    

◆職業の変更
    @actor.class
    
    [引数]
    配列                    アクターID    
    数値                    職業ID
    変数                    職業ID
    
    .initLevel              レベルを1にする
    .keepLevel              レベルを維持する
    
    .keepSkill              特技を維持する
    .initSkill              特技をレベルに応じて修得
    .addSkill               特技を追加する
    
    .keepParams             能力値を維持する
    .halveParams            能力値を半分にする
    .level1Params           能力値をレベル1相当にする
    .initParams             能力値をレベルに応じた値にする
    
    .showMsg                レベルアップメッセージを表示



◆戦闘コマンドの変更
    @actor.cmd
    
    [引数]
    配列                    アクターID    
    数値                    コマンドID
    変数                    コマンドID

    .add                    コマンドを追加
    .sub                    コマンドを削除
    .all                    (削除のとき)全てのコマンドを指定



◆戦闘ウェイトの切り替え
    @btl.atbMode
    
    [引数]
    .toggle                 ウェイトのON/OFFを切り替える 

    
    
◆戦闘処理の制御
    @btl.hook
    
    [引数]
    .atb                    ATBゲージの増減
    .damagePop              ダメージポップ
    .targeting              ターゲティング
    .addState               状態付与
    .paramBuff              HP以外の能力値変動 を対象にする
    
    .none                   制御を解除する
    .cev(a)                 制御に用いるコモンイベント
    .var(a)                 制御に用いる変数の先頭



◆ATBゲージの操作
    @btl.atb
    
    [引数]
    配列                    (単体の場合)対象のID
    .actor                  対象をアクターにする
    .member                 対象をメンバーにする
    .party                  対象をパーティ全体にする
    .enemy                  対象を敵キャラにする
    .troop                  対象を敵全体にする
    
    .set(a)                 ゲージを設定する
    .add(a)                 ゲージを加算する
    .sub(a)                 ゲージを減算する
    
    .percent                値を割合にする    
    
    
    
◆戦闘コマンドの変更EX
    @btl.cmdex
    
    [引数]
    .change(a)              「チェンジ」コマンド
    .fight(a)               「戦う」コマンド
    .auto(a)                「自動」コマンド
    .escape(a)              「逃げる」コマンド
    .win(a)                 「勝利」コマンド
    .lose(a)                「敗北」コマンドを設定 (0で無効)
    
    
    
◆戦闘情報の取得
    @btl.getInfo

    [引数]
    .actor(a)               対象をアクターaにする
    .member(a)              対象をメンバーaにする
    .party                  対象をパーティ全体にする
    .enemy(a)               対象を敵キャラaにする
    .troop                  対象を敵全体にする
    
    .buff                   ステータス補正
    .state                  状態
    .element                属性
    .misc                   その他
    
    .list                   メンバー一覧
    .alive                  生存者一覧
    .canMove                行動可能者一覧
    
    .dst(a)                 出力変数の先頭
    
    
    
◆敵キャラのHPの増減
    @enemy.hp
    
    [引数]
    配列                    対象のID
    
    .add(a)                 増加
    .sub(a)                 減少
    
    .percent                値を割合にする
    .possibleDie            操作による死亡を許可する 
    
    
    
◆敵キャラのMPの増減
    @enemy.mp
    
    [引数]
    配列                    対象のID
    
    .add(a)                 増加
    .sub(a)                 減少
    
    

◆敵キャラの状態の変更
    @enemy.state
    
    [引数]
    配列                    対象のID
    
    .add(a)                 付与
    .sub(a)                 解除
    
    
    
◆敵キャラの出現
    @enemy.appear
    
    [引数]
    配列                    対象のID
    
    
    
◆戦闘背景の変更
    @btl.backdrop

    [引数]
    文字列                  対象ファイル



◆戦闘アニメの表示（戦闘中）
    @btl.anim
    
    [引数]
    配列                    アニメID

    .troop                  敵全体を対象にする
    .enemy(a)               敵キャラ単体aを対象にする
    .party                  味方全体を対象にする
    .actor(a)               味方単体aを対象にする
    
    .wait                   完了までウェイト    



◆連続攻撃
    @actor.multipleAct
    
    [引数]
    配列                    主人公ID
    .cmd(a)                 対象コマンド
    .times(a)               繰り返す回数
    
    

◆100%脱出
    @btl.forceEscape
    
    [引数]
    .party                  味方全体を対象にする
    .troop                  敵全体を対象にする
    .enemy(a)               敵単体aを対象にする
    
    .cancelIfSideAttack     サイドアタックでは逃げられない
    
    

◆条件分岐（戦闘中）
    @btl.if
    
    [引数]
    ・スイッチ
        s[n]
        
        [引数]
        .isOn                   スイッチがON（デフォルト）
        .isOff                  スイッチがOFF
        
    
    ・変数
        l (op) r
        
        [op]
        比較演算                変数比較（==, >=, <=, >, <, !=）
        
        
    ・主人公
        .actor
        
        配列                    主人公ID
        .canMove                ～が行動可能
        .use(a)                 ～がaを選択


    ・敵キャラ
        .enemy
        
        配列                    敵キャラ番号
        .canMove                ～が行動可能
        .isTarget               ～がターゲット
        .hasState(a)            状態aになっている

    
    .elif(...)                  それ以外の場合の条件分岐とそれを満たした場合の実行内容
    .else(n)                    それ以外の場合の実行内容
    
    その他                      条件を満たした場合の実行内容
    
    

◆コモンイベントの呼び出し
    @btl.cev
    
    [引数]
    数値
    変数                        イベントID
    
    

◆戦闘の中断
    @btl.abort



◆名前入力の処理
    @actor.inputName
    
    [引数]
    配列                        アクターID
    
    .kana                       初期状態でカタカナを選択
    .preset                     現在の名前を入力状態にする
    
    

◆戦闘の処理
    @btl.begin
    
    [引数]
    .troop                      出現する敵グループ
    
    .normal                     通常の戦闘形式
    .back_actor                 バックアタック（敵←味方）
    .back_enemy                 バックアタック（味方←敵）
    .side_actor                 サイドアタック（敵←味方）
    .side_enemy                 サイドアタック（味方←敵）
    
    .backdropFile(a)            戦闘背景のファイル名a   
    .backdropId(a)              戦闘背景の地形ID a   
    
    .shallow                    見下ろし型
    .deep                       奥行き型
    
    .disableEscape              逃走不可
    .enableEscape               逃走でイベント中断
    .enableGameover             敗北でゲームオーバー
    
    .preempt                    先制
    .disableFlash               フラッシュ無効
    
    .win                        勝利したときの分岐
    .lose                       敗北したときの分岐
    .escape                     逃げたときの分岐  
    


◆宿屋の処理
    @inn
    
    [引数]
    .msg(a)                     メッセージタイプ(0..2)
    .cost(a)                    価格
    
    .stay                       宿泊した時の分岐
    .leave                      宿泊しない時の分岐



◆お店の処理
    @shop
    
    [引数]
    数値                        アイテムID
    
    .msg(a)                     メッセージタイプ(0..2)
    
    .normal                     通常
    .buyOnly                    購入のみ
    .sellOnly                   売却のみ
    
    .goods(a, b)                アイテムIDを格納した変数の先頭a, 要素数b
    
    .transaction                売買したときの分岐
    .noTransaction              売買しないときの分岐
  

    
◆ロード画面の呼び出し
    @sys.loadMenu
    
    

◆オプション画面の呼び出し
    @sys.optionMenu
    
    

◆フルスクリーンモード切り替え
    @sys.fullscreen

    [引数]
    .toggle                     切り替え（デフォルト）



◆メニュー画面の呼び出し
    @sys.partyMenu
    
    
    
◆メニュー禁止の変更
    @sys.menuAccess
    
    [引数]
    .on                         許可する
    .off                        禁止する
    
    
    
◆その他
    @raw

    [引数]
    引数0をコマンドコード
    引数1を文字列引数
    引数2以降を数値引数とみなしてコマンドを生成
    
    
    
◇ディレクティブ
    どのような操作を実行するのかを指定します


◆操作
    いずれか1つを指定します

    #doNothing
    なにもしません（デフォルト）
    
    
    #apply
    ソースに記述のある項目に関連するファイルを読み込み、
    内容を更新します
    どこにも属さないコマンドは無視されます
    
    
    #toClip
    ソースに記述のある項目をクリップボードに出力します
    コモンイベント, マップイベント, イベントページのIDは無視されます
    
    
    #bin2text
    ゲームプロジェクトのデータをテキスト化します
    テキストはtpcではなく設計図に沿った独自形式です
    tpcのソースコードにコモンイベント等が含まれている場合、その変更を適用したうえで出力します        
    マップデータについては指定ファイル名の末尾にIDを4桁の数値で付与します
    ※不具合対策でバックアップを忘れずに
    
    
        [bin2textの引数]
        .db(n)                  変換したデータベースを出力するテキストファイルn
        .map(n)                 変換したマップデータを出力するテキストファイルn
        .tree(n)                変換したマップツリーを出力するテキストファイルn
        配列                    対象にするマップID


    #text2bin
    テキストからゲームプロジェクトデータを生成します
    テキストはtpcではなく設計図に沿った独自形式です
    tpcのソースコードにコモンイベント等が含まれている場合、その変更を適用したうえで出力します        
    マップデータについては指定ファイル名の末尾にIDを4桁の数値で付与します
    ※不具合対策でバックアップを忘れずに
    
        [text2binの引数]
        .db(n)                  生成したデータベースを出力するファイルn
        .map(n)                 生成したマップデータを出力するファイルn
        .tree(n)                生成したマップツリーを出力するファイルn
        配列                    対象にするマップID
        

◆設計図の読み込み
    #blueprint 
    
    [引数]
    .db(n)                  データベースの設計図ファイルnを読み込み
    .map(n)                 マップデータの設計図ファイルnを読み込み
    .tree(n)                マップツリーの設計図ファイルnを読み込み

    ファイルの更新やイベントコマンド以外のクリップ出力をおこなう際に必須です
    
    
◆ディレクトリの指定
    #directory

    [引数]
    文字列                  入出力に使うディレクトリ

    
    ファイルの更新をおこなう場合に必須です
    

◆ファイル重複時の操作設定
    #copyMode
    
    [引数]
    .backup                 バックアップを取って上書き（デフォルト）
    .force                  そのまま上書き
    
    
    バックアップは2003拡張エディタと同じ場所に取ります
    (指定ディレクトリ)/Backup/(日時).zip

    
◆ソースファイル読み込み
    #include "src"
    
    [引数]
    文字列                  読み込むファイル名
    
    
    記述した位置にソーステキストを追加します
    行頭以外に書くと失敗します
    

◆文章オプション
    #msg

    [引数]
    .none                   なし（デフォルト）
    .instant                全ての行頭に「\>」を付与
    
    
◆最適化
    #optimize

    [引数]
    数値                    最適化レベルを指定　デフォルトは0（なし）
    

    ※今のところは0（無効）と1以上（有効）の区別のみ
    
    
◆文法オプション
    #brace
    
    [引数]
    .does                   引数の一部を構成
    
      [引数]
      .not                  引数の一部を構成

        [引数]
        .represent          引数の一部を構成

          [引数]
          .the              引数の一部を構成

            [引数]
            .start          引数の一部を構成
    
              [引数]
              .of           引数の一部を構成
    
                [引数]
                .the        引数の一部を構成
        
                  [引数]
                  .argument      
                  .arguments      
                            ブレースを引数の開始記号と認識しない
                            設定時にはイベントコマンド名の省略記法が使用できません


◇メタ構文


◆定数定義
    def 
    
    任意の定義名に値を割り当てます

    値を省略すると数値とみなされ、初期値0からはじまり順に割り当てられます
    数値が指定されると以降のその値+1がデフォルト値になります
    
    イベントコマンド名など、定義しても上手く機能しない値があります
    
    
    [サンプル]
    def qwe = 33
    
    def {
        a = 6
        b               //b は 7
        c               //c は 8
        d = "aaa"
        e               //e は 9
    }

    
◆スイッチ/変数/文字列変数定義
    defs / defv / deft
    
    任意の定義名にツクールのスイッチ/変数/文字列変数を割り当てます
    基本は def と同じですが右辺には数値または範囲値しかおけず、省略時のデフォルト値は1です

    [サンプル]
    defv qwe = 10       //qwe は v[10]    
    
    

◆メタ変数
    $変数名
    

◆メタ関数
    __fn
    
    [引数]
    0番目がメタ関数名
    1番目から引数の数-1までが引数を受け取るメタ変数
    最後の引数が実行内容
    
    [サンプル]
    
    __fn qwe $a $b {
        @comment $b
        @msg.show $a
    }
    
    qwe("abcd" "efgh")
    
    
◆ループ
    __loop
    
    [引数（回数指定）]
    0番目が実行回数
    1番目がインデックスを受け取るメタ変数（省略可能）
    2番目以降が実行内容
    
    [引数（要素列挙）]
    0番目が列挙する要素を含んだ配列
    1番目が要素を受け取るメタ変数（省略可能）
    2番目がインデックスを受け取るメタ変数（省略可能）
    3番目以降が実行内容
    
    [サンプル]
    
    __loop 5 $i {
        @msg.face "Actor1" $i
    }
    
    __loop ["qwe" "rty" "uio"] $e {
        $e
    }

    __loop ["qwe" "rty" "uio"] $e $i {
        @msg.face $e $i
    }


◆条件分岐
    __if
    
    [引数]
    0番目が条件
    1番目が真のときの実行内容
    2番目は .elif または .else （省略可能）

    [.elif の引数]
    __if と同じ

    [.else の引数]
    0番目が実行内容
    
    [サンプル]
    
    __if qwe == 2 {
        "if"
    
    } .elif qwe == 3 {
        "elif"
        
    } .else {
        "else"
        
    }
    
    
◆ID取得

    __id
    
    [引数]
    ツクールの変数(v, s, t)
    
    
    
◆文字列化

    __str
    
    [引数]
    任意の値
    
    
    ※複数の引数は与えられた順にそのまま連結されます
    
    
◆定義チェック
    __defined
    
    与えられた引数が値を持った定義またはメタ変数かどうかを調べます

    [引数]
    任意の値






















    
