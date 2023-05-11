//This text is basically machine translated by DeepL pro. - TkHuskarl

Outline
    TPC! TPC!


    
    Pass the source file as the first argument and run tpc.exe!
    This is a tool to generate event commands and common events for RPG Maker 2003 + Maniac Patch.
    This tool generates common events.


    
    Grammar is loose and fluffy.



    

◆Startup Options
    -en Output error log in suspicious English
    -pop Display the error log in a message box




    
    

◆Value Type
    String Enclosed by "" or 「」
    Numeric Decimal and hexadecimal (0x***)
    Array [element0, element1, ...]
    block { element0, element1, ... } or bl { element0, element1, ... }
    Constant Definition Non-symbolic characters and numbers (no leading) and _
    Metavariable $Definition name
    Event command @command_name
    Subcommands . @command_name
    Variable v[id] or v:id
    Switch s[id] or s:id
    String variable t[id] or t:id
    Variable operation expression `expression


◆ comments
    // line comment
    /**/ Range comment




    
◆ reserved words
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
    member
    player
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



◆Common Events
    cev

    [Arguments]
    Array Event ID
    Numeric Event ID
    .id(a) Event ID


    
    String Event name
    .name(a) Event name


    
    .auto Start condition Auto start
    .parallel Start Condition Parallel Processing
    .beginBattle Start Condition Default Battle Start
    .battleParallel Start Condition Parallel Processing in Default Battle
    .beCalled Start Condition When called (default)
    .cond(n) Switch for event appearance conditions
    .ev(n)
    Others Execution details


    [sample].
    cev 4, "qwe", .parallel, { //common event[4] name=qwe parallel processing
        "msg"
    }



    

◆map event
    mev


    
    [Arguments]
    Array
    Numeric value
    .id(n) Event ID


    
    String
    .name(n) Event name


    
    .parent(n)
    .map(n) Map ID to place
    .pos(x, y) Placement position (square)



    
    
    The last specified map ID and event ID will be stored.
    When creating an event, the initial value of the map ID is taken over from the stored map ID.




    
◆map event page
    mep


    
    [Arguments]
    Array
    Numeric value
    .id(n) Page ID


    
    .ev
    Block event command

    .parent
    .mev Map Event ID


    
    .grandParent
    .map Map ID


    
    .decision Start condition When the decision key is pressed (default)
    .touched Start condition When touched by the protagonist
    .beTouched Start condition When touched by an event
    .auto Start Condition Auto start
    .parallel Start condition Parallel processing


    
    .body(a, b) Walking graphic a and position in file b
    .trans
    .transparent Make the gait graphic translucent


    
    .anim(*) animation settings
        .normal Normal (default)
        .fixDir Fixed orientation
        .step (when normal or fixed orientation) with footstep
        .fix Graphics fully fixed
        .spin 4-picture animation
        .noWalk Disable walking motion


        
    .priority(*) priority type
        .low Below normal character (default)
        .middle Not overlapping the normal character
        .high Above normal character


        
    .disableOverlap Not overlap with another event


    
    .dir(*) Event orientation
        .up Up
        .right Right
        .down Down (default)
        .left Left


        
    .pattern Graphic pattern
        .left
        .middle (default)
        .right


    
    .cond(*) Appearance condition
        Comparison operation Variable l is equal to or greater than, less than or equal to, greater than or less than r


        
        .sw1(n) switch n is on
        .sw2(n) switch n is on
        .item(n) item n is in possession
        .actor(n) protagonist n is in the party
        .timer1(n) Timer1 has less than n seconds remaining
        .timer2(n) Remaining seconds of timer2 is less than n


        
    .action(*) movement
        .freq(n) Movement frequency
        .speed(n) movement speed
        .repeat Repeat action
        .skippable Ignore if unable to move (default)
        .unskippable Do not ignore regardless of whether it is possible to move or not


        
        .random Random move
        .vert up/down and back
        .horiz Left-right back and forth
        .approach Approaching the hero
        .away Running away from the hero


        
        .custom(*)
        Block move route specification




        
    [moveRoute]
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
    .turnAway
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




    
    The initial values of the map ID and event ID are taken over from the stored values when the page is created.


◆Set switch/variable names
    sname/vname



    
    
    [Arguments]
    Array/Numeric Current ID
    String Name for current ID


    
    .expand(a) Minimum number of elements a
    .shrink Erase elements with trailing blank names

    .pad(a) Append a blank character name to a from the current ID
    .pad(a) Append blank character name to the specified range a

    .wipe Clear all original names
    .append Do not clear original names (default)



◆Command Notation
    @name.subname(arg1, arg2, ...)
    subname arg1, arg2, ...
    @name.subname arg1 arg2 ...
    @name.subname {
        arg1
        arg2
        ...
    }


    
    Some arguments take additional arguments


    
    @name.subname arg1(subarg1, ...) , arg2



    
    
    In principle, the arguments of the commands are in no particular order (*exceptions apply),
    Arguments of arguments are fixed in order
    Arguments of commands can be omitted if they are not needed.



    
    
    A subcommand with a fixed number of arguments will return any leftover arguments


    
    @timer.set 5.timer2


    
    While the above command is interpreted as follows,


    
    @timer(.set(5, .timer2))


    
    Return will set the value as expected


    
    @timer(.set(5), .timer2)



    
    
    If an array is taken as an argument, the argument can be placed between @name and .subname


    
    @pic.erase [10].
    @pic[10].erase


    
    The last @name is remembered and can be omitted when the same @name is used again.
    Also, arguments between @name and .subname are inherited.


    
    @pic[2].show "qwe"
    .move.pos(160, 120).time(6).wait //@> Picture move: [2].
    .erase //@> picture erase: [2].



    
    
    If the same item is operated multiple times, the last change will overwrite it.


    
    @party.item[1].add(5).sub(3) //@> Increase/decrease of item: item[1] -= 3



    

◇Event commands
    @msg.show Show statement
    @msg.opt Set statement options
    @msg.option Set statement options
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
    gameOption
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


    
    @gsave.
    @mouse
    @comment
    @cmd
    @if
    v
    s
    t


    
    @raw



    
    
◆Show text
    @msg.show


    
    [Argument]
    String Text
    .br New line
    Others Convert to string


    
    If multiple arguments are given, they are concatenated.
    In addition, the following statements in the source are interpreted as text display


    
    Single string "txt" or "text




    
    
_ 
◆Setting text options
    @msg.opt


    
    [Argument]
    .opaq Normal window (default)
    .trans
    .transparent Transparent window
    .top Top placement
    .middle Center placement
    .bottom Bottom placement (default)
    .varyPos Change placement according to the protagonist
    .allowEventMove Allow events to move while displaying


    
    .size(a, b) Unchanged with the width a and height b 0 in the statement window


    
    .font(a, b) Font name a and size b in the statement window



    
    
◆Facial Graphics Settings
    @msg.face


    
    [Arguments]
    String File name
    String variable File name


    
    Numeric In-file Index
    Variable Index in file
    a..b Indexes a to b to be animated


    
    .left Left alignment (default)
    .right Right alignment (default)
    .hrev
    .hreverse Horizontally reversed
    .force Forced change even during text display or in situations where movement is inhibited

    [Arguments when animating].
    .interval(a, b, c) Wait time. Basic frame a, random number increase/decrease b, flag c to limit random number to addition
    .fpc(a, b, c) Display time of one piece. Basic frame a, random number increase/decrease b, flag c to limit random numbers to addition.
    .once Do not loop animation
    .loopback(a) Wrap back after the specified range. Flag a to indicate whether the loopback should have an interval.



    

◆Display of choices
    @msg.choice

    [Arguments]
    .case Each choice
    .cancel Cancellation behavior


    
    Argument of [case].
    String Text of the selection
    Other Execution details of the selection


    
    Arguments for [CANCEL].
    String Text of any choice
    Numeric Index of any choice
    .ignore Ignored (default)
    Others Execution details on cancel



    

◆Numeric input processing
    @msg.input
    @msg.inputNum


    
    [Argument]
    .digit(n) number of digits
    .dst(n) Variable to receive the result



    
    
◆Control of text processing
    @msg.hook


    
    .e Monitor \e in a statement
    .showing Monitoring window creation
    .closing Monitors window destruction
    .blit Monitor character drawing


    
    .cev(a) Common event a to receive notification


    
    .sys(v[a], t[b]) Variable head a that receives arguments from the system, string variable head b
    .user(v[a], t[b]) Variable head a that receives arguments from the user, string variable head b




    
    
    
◆Timer Operation
    @timer

    [Arguments]
    .set(n) Number of seconds
    .start start
    .stop stop
    .show Timer
    .continueInBattle Continue during battle
    .timer1 operate timer1 (default)
    .timer2 Operate timer2



    
    
◆Increase/decrease of money in your possession
    @party.money


    
    [Arguments]
    .add(n) increase value
    .sub(n) Decrease value




    
◆Increase/decrease of items
    @party.item


    
    [Argument]
    Array Item ID
    .add(n) Increased value
    .sub(n) Decrease value


◆Replacement of members
    @party.member


    
    [Arguments]
    .add(n) Actor to join
    .sub(n) Actor to leave


◆Experience
    @actor.exp


    
    [Arguments]
    Array Target actor ID
    .all Make the target all party members
    .add(n) increase value
    .sub(n) Decrease value
    .notify Display level-up message


◆Increase/decrease level
    @actor.level


    
    [Argument]
    Array Target actor ID
    .all Make the target all party members
    .add(n) increase value
    .sub(n) Decrease value
    .notify Display level-up message


◆Increase/decrease of ability value
    @actor.param


    
    [Arguments]
    Array Target actor ID
    .all Make the target all party members
    .add(n) increase value
    .sub(n) Decrease value
    .hp Set the increase/decrease item to the maximum HP
    .mp increase item to maximum MP
    .atk increase item to attack strength
    .def Increase item to Defense
    .mag increase or decrease mental capacity
    .spd Increase or decrease Agility



    
    
◆Increase/decrease of special skills
    @actor.skill


    
    [Argument]
    Array Target actor ID
    .all Make target all party members
    .add(n) Specialty ID to be learned
    .sub(n) Specialty ID to be forgotten




    
◆Change of equipment
    @actor.equipment


    
    [Arguments]
    Array Target actor ID
    .all Make the target all party members
    .add(n) Item ID to equip
    .removeWeapon Remove weapon
    .removeShield removeShield
    .removeHelm removeHelm
    .removeArmor Remove armor
    .removeAccessory Remove decoration
    .clear Remove all equipment



    

◆Increase/decrease of HP
    @actor.hp

    [Argument]
    Array Target actor ID
    .all Make the target all party members
    .add(n) increase value
    .sub(n) decrease value
    .possibleDie Allow death by operation


    
◆Increase/decrease of MP
    @actor.mp

    [Argument]
    Array Target actor ID
    .all Make the target all party members
    .add(n) increase value
    .sub(n) Decrease value


◆Change of state
    @actor.state

    [Argument]
    Array Target actor ID
    .all Make the target all party members
    .add(n) Add the state to be granted
    .sub(n) Release state



  
  
◆Recover All
    @actor.recoverAll


    
    [Argument]
    Array Target actor ID
    .all Target all party members



    

◆Damage handling
    @actor.damage


    
    [Argument]
    Array Target actor ID
    .all Target all party members
    .value(n) Base damage
    .defModifier(n) defensive modifier
    .magModifier(n) modifier of mental power
    .variance(n) dispersion
    .dst(n) Variable that receives the damage value




    
◆Change the name of the main character
    @actor.name


    
    [Argument]
    Array Target actor ID
    String Name




    
◆Change the title of the main character
    @actor.nickname


    
    [Argument]
    Array Target actor ID
    String Title


◆Changed walking graphic of the main character
    @actor.body


    
    [Arguments]
    Array Target actor ID
    String File name
    Numeric Index in file
    .trans Make translucent

◆Change of main character's face graphic
    @actor.face


    
    [Arguments]
    Array Target actor ID
    String File name
    Numeric Index in file



    

◆Vehicle graphic change
    @vehicle.body


    
    [Arguments]
    String File name
    Numeric Index in file
    .boat Targets small vessels
    .ship for large ships
    .airship For airships



    

◆Change of system BGM
    @sys.bgm

    [Arguments]
    String File name
    .battle BGM for battle
    .endBattle BGM for end of battle
    .inn Target the inn BGM
    .boat Target small ship BGM
    .ship Target large ship BGM
    .airship Target airship BGM
    .gameover Target game over BGM
    .opt(a, b, c, d) Set BGM fade-in time, volume, tempo, and balance




    
◆Change of system sound effects
    @sys.se


    
    [Arguments]
    .cursor Target cursor SE
    .decision Targets the decision SE.
    .cancel Cancel SE is targeted.
    .buzzer Buzzer SE target
    .escape Targets escape SE
    .enemyAttack targets enemy attack SEs
    .enemyDamage targets enemy damage SE
    .actorDamage targets friendly damage SE
    .avoid Targeting evasion SE
    .defeat Targets defeat SE
    .item Target item use SE
    .opt(a, b, c) Set SE volume, tempo, and balance


◆Modification of system graphics
    @sys.skin


    
    [Arguments]
    String File name
    .stretch Enlarged view
    .tiled Line up
    .gothic MS Gothic
    .mincho MS Mincho



    
    
◆Change of screen switching method
    @sys.transition


    
    [Argument]
    Numeric Switching method
    .transfer_hide Location move (delete)
    .transfer_show Move to location (show)
    .beginBattle_hide Start of battle (delete)
    .beginBattle_show Start of battle (display)
    .endBattle_hide End of battle (delete)
    .endBattle_show End of battle (show)


◆Move to location
◆Move to a memorized location
    @map.setPlayer
    @player.setPos


    
    [Arguments]
    Array Map ID
    .pos(x, y) coordinates
    .retain Keep player facing (only if constant specified, default)
    .up Face up (only when constant is specified)
    .right Face right (only when constant is specified)
    .down Face down (only when constant is specified)
    .left faces left (only when constant is specified)




    
◆Location Memory
    @map.getPlayerPos
    @map.getPlayer
    @player.getPos


    
    [Arguments]
    Argument 0 Stored variable of map ID
    Argument 1 Stored variable of x-coordinates
    Argument 2 Stored variable of y-coordinates




    
◆Vehicle boarding and exiting.
    @vehicle.ride


◆Set vehicle location
    @map.setVehicle
    @map.setVehiclePos
    @vehicle.setPos



    
    
    [Arguments]
    Array Map ID
    .pos(x, y) Coordinates
    .boat Small boat
    .ship Large ship
    .airship Airship
    .retain Keep facing (default)
    .up Look up
    .right Turn to the right
    .down Face down
    .left Face left



    

◆Set the event location
    @map.setEv
    @map.setEvPos
    @ev.setPos


    
    [Arguments]
    Array Event ID
    .player Main character
    .boat Small boat
    .ship Large ship
    .airship Airship
    .self This event


    
    .pos(x, y) Coordinates


    
    .retain Keep facing (default)
    .up Face up
    .right Face right
    .down Face down
    .left face left
    .face(x) face x(up=0, right, down, left)



    
    
◆Exchange event locations.
    @ev.swap


    
    [Arguments]
    Array Event ID
    Numeric Exchange target ID
    .self Make this event the target of exchange



    

◆Get Terrain ID of specified location
    @map.getTerrain


    
    [Argument]
    .pos(x, y) Coordinates
    .dst(n) Output destination




    
◆Get event ID of specified location
    @map.getEv


    
    [Argument]
    .pos(x, y) Coordinates
    .dst(n) Output destination




    
◆Clear Screen
    @scr.hide


    
    [Argument]
    Numeric Erase method
    .default Follow system switching method (default)


◆Show screen
    @scr.show


    
    [Argument]
    Numeric Display method
    .default Follow system switching method (default)


◆Change screen tint
    @scr.tint


    
    [Arguments]
    .rgbs(r, g, b, s) red, green, blue, saturation
    .time(n) Time to make changes n * 0.1 sec
    .wait Wait until completion


◆Screen flash
    @scr.flash


    
    [Arguments]
    .rgbv(r, g, b, v) red, green, blue, intensity
    .once(n) execute once Time n * 0.1 sec
    .begin(n) Start flashing Time n * 0.1 sec
    .end End of flash
    .wait Wait until completion




    
◆Screen Shake
    @scr.shake


    
    [Arguments]
    .value(a, b) Strength, speed
    .once(n) execute only once Time n * 0.1 sec
    .begin(n) Shake start time n * 0.1 sec
    .end End of shake
    .wait Wait until completion




    
◆Screen Scroll
    @scr.scroll


    
    [Argument]
    .fix Fixed
    .unfix Unfix
    .restore Restore position
    .shift(n) Shift n squares
    .pxShift(h, v) Shift the specified value horizontally or vertically in pixel units
    .set(x, y) Specify coordinates in pixels
    .up
    .right
    .down
    .left Direction when operation is shift
    .speed(n) When operation is shift/restore, movement speed 1~6
                        .speed(n) When the operation is shift/restore, movement speed 1~6
    .time When operation is pxShift/set, frames to move
    .wait Wait until completion
    .center When the operation is set, the specified value is treated as the center coordinate.
    .relative When the operation is set, the specified value is treated as the relative coordinate from the current position.


    
◆ Screen zoom

    @scr.zoom


    
    [Argument]
    .pos x, y coordinates (x, y) centered
    .rate a magnification rate a% Valid values are greater than or equal to 100
    .time a Frame to move
    .layer a Make layers up to a the target of zooming
    .wait Wait until the move is completed

    *Setting Layer 0 turns zoom off.



    
    
◆Setting weather effects
    @scr.weather


    
    [Arguments]
    .none None None
    .rain Rain
    .snow Snow
    .mist Fog
    .sandstorm Sandstorm
    .weak Effect strength weak
    .medium Effect strength medium
    .strong Effect strength strong



    

◆picture.show
    @pic.show


    
    [Arguments]
    Array Picture ID
    String File name
    String variable File name


    
    .pos(x, y) coordinates
    .center Center Center coordinates
    .topLeft Top left coordinate
    .bottomLeft bottom left coordinate
    .topRight top right coordinate
    .bottomRight bottom right coordinate
    .top Top top coordinates
    .bottom Bottom bottom coordinate
    .left Left Left coordinate
    .right Right coordinate


    
    .scrollWithMap map scrolling linked
    .useChromakey with chromakey
    .chromakey(n) with/without chromakey


    
    .scale(n) Scale n%.
    .scale2(a, b) horizontal scale a%, vertical b


    
    .trans(n)
    .transparency(n) transparency
    .rgbs(r, g, b, s) color tone


    
    .rotate(n) rotation effect
    .wave(n) Waveform effect
    .angle(a, b) Angle effect a / b


    
    .multi Multiply
    .add Add
    .overlay Overlay


    
    .hrev
    .hreverse Horizontally reverse
    .vrev
    .vreverse Vertically flipped
    .hvrev
    .hvreverse Horizontally/vertically flipped


    
    .repl(a, b) Replace the letter a at the end of the filename with the variable b


    
    .grid(a, b) Split by a, b as a sprite sheet
    .cell(n) Display ID of the sprite sheet


    
    .anim(n)
    .animation(n) Animates a sprite sheet (n frames per sheet)
    .rangeAnim(a, b, c) Animate with ID[b..c] (display frame a per sheet)


    
    .once Play animation only once
    .repeat Play animation repeatedly


    
    .mapLayer Layer in the field
    .battleLayer Layer in battle

    .eraseWhenTransfer Erase when the map is moved
    .eraseWhenEndBattle Erase when battle ends
    .affectedByTint affected by the color tone of the screen
    .affectedByFlash affected by screen flash
    .affectedByShake affected by the shake of the screen



  
  
◆pic.move
    @pic.move


    
    [Arguments]
    Array Picture ID


    
    .pos(x, y) coordinates
    .center Center Center coordinates
    .topLeft Top left coordinate
    .bottomLeft bottom left coordinate
    .topRight top right coordinate
    .bottomRight bottom right coordinate
    .top Top top coordinates
    .bottom Bottom bottom coordinate
    .left Left Left coordinate
    .right Right coordinate


    
    .scale(n) Scale n%.
    .scale2(a, b) horizontal scale a%, vertical b


    
    .trans(n)
    .transparency(n) transparency
    .rgbs(r, g, b, s) color tone (variables allowed)


    
    .rotate(n) rotation effect
    .wave(n) Waveform effect
    .angle(a, b) Angle effect a / b


    
    .multi Multiply
    .add Add
    .overlay Overlay


    
    .hrev
    .hreverse Horizontally reverse
    .vrev
    .vreverse Vertically flipped
    .hvrev
    .hvreverse Horizontally/vertically flipped


    
    .time(n) Movement time n * 0.1 sec
    .wait Wait for completion


  
    .relative Specify coordinates, magnification, and transparency as relative values
    .keepRgbs Do not change the color tone value
    .keepEffect Do not change special effects
    .keepBlend Do not change the blend mode
    .keepFlip Do not change the flip state
    .keepTime Do not change the time required



    
  
◆Pic.erase
    @pic.erase

    [Arguments]
    Array Picture ID
    .all Target all pictures



    

◆Combat animation show
    @anim.show


    
    [Arguments]
    Array Battle animation ID
    Numeric Target event ID
    Variable Target event ID

    .target(n) Target event ID
    .player player
    .boat Small ship
    .ship Large ship
    .airship Airship
    .self This event


    
    .picTarget(a) Follow picture a
    .pos(a, b) Display at the specified coordinates (a, b)
    .bind(a, b) Follow the value of variable (a, b)


    
    .buffer(a) Playback in buffer a


    
    .reverse(a) Reversal or not a
    .wait Wait until completion
    .tiled Arrange across the screen

    picTarget/pos/bind cannot be used with tiled


◆Changing the transparency state of the main character
    @player.trans
    @player.transparent

    [Argument]
    Numeric Specify the state by a numerical value
    .on Transparent
    .off Release



    

◆Character Flash
    @ev.flash


    
    [Arguments]
    Array Event ID
    .player player
    .boat Small ship
    .ship Large ship
    .airship Airship
    .self This event


    
    .rgbv(r, g, b, v) red, green, blue, intensity
    .time(n) time taken for the operation n * 0.1 sec
    .wait Wait until completion



    

◆Specify character actions
    @ev.setAction


    
    [Arguments]
    Array Event ID


    
    .act
    Block Subcommands


    
    .player player
    .boat Small ship
    .ship large ship
    .airship Airship
    .self This event


    
    .freq(n) Movement frequency
    .repeat Repeat operation
    .skippable Ignore if move not possible (default)
    .unskippable Do not ignore regardless of whether the move is possible or not

    [subcommand].
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
    .turnAway
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



    

◆Add character actions
    @ev.addAction


    
    [Arguments]
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
    .moveForward(n) move n steps to each
    .move(a, b) move b steps to a


    
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
    .face(a) a


    
    .pause


    
    .beginJump
    .endJump
    .jump (a), (b) Jump from the current position by a on the x-axis and b on the y-axis


    
    .fixDir
    .unfixDir
    .setBody(file, idx)
    .se(file, vol, pitch, balance)
    .beginThrough
    .endThrough
    .pauseAnim
    .resumeAnim

    .speed(n) Movement speed setting (-3~2)
    .freq(n) move frequency setting (0~7)
    .switch(id, val) switch ID, boolean
    .trans(n) transparency setting (0~7)



    
    
    [.move argument a].
    00: Move up
    ...
    11: move forward


    [.face argument a].
    00: face up
    ...
    10: face the opposite way of the main character




    
    

◆Execute all specified actions
    @ev.execAction



    

◆Release all specified actions
    @ev.stopAction




    
◆Wait
    @sys.wait
    @wait


    
    [Argument]
    Numeric Time n * 0.1 sec
    Variable Time n * 0.1 sec
    .input Wait for key input instead of time
    .frame unit of time in frames



    

◆BGM play
    @bgm.play


    
    [Arguments]
    String File name
    String variable File name
    .opt(a, b, c, d) Fade-in time, volume, tempo, balance




    
    @bgm.stop




    
    

◆BGM fadeout
    @bgm.fadeout


    
    [Argument]
    Numeric Fade-out time



    

◆Current BGM
    @bgm.store


◆Play memorized BGM
    @bgm.restore




    
◆Sound effects playing
    @se.play


    
    [Arguments]
    String File name
    String variable File name
    .opt(a, b, c) volume, tempo, balance


    @se.stop




    
◆Play Movie
    @movie.play


    
    [Arguments]
    String File name
    .pos(a, b) Coordinates
    .size(a, b) Display size




    
◆Key input processing
    @key.input


    
    [Arguments]
    .dst(n) Variable to receive the result
    .wait Wait until pressed
    .elapsed variable that receives the time until pressed


    
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


◆Change of chipset
    @map.tileset


    
    [Argument]
    Numeric Tileset ID
    Variable Tile set ID



    

◆Change of distant view
    @map.parallax


    
    [Arguments]
    String File name
    .hloop Loop horizontally
    .vloop Vertical loop
    .hscroll(n) Auto scroll horizontally
    .vscroll(n) Auto scroll vertically




    
◆ReplaceTile
    @map.replaceTile


    
    [Argument]
    Array Original chip ID
    Numeric Chip ID to be replaced
    .lower Lower Lower tier
    .upper Upper Upper layer


◆Change of the number of enemy appearance steps
    @btl.encounterRate


    
    [Argument]
    Numeric Number of steps


//Official TPC doesn't support these native RM commands - so if you want to use them you have to call via @raw command.
//From Jetrotal's refference. - TkHuskarl
◆ Set Teleportation Point ???????
@raw 11810, "", 0, 1, 0, 0, 0, 1     

@raw 11810, "", 1, 1, 9, 7, 0, 1

@raw 11810, "", 0, 1, 0, 0, 1, 1


◆ Teleportation On/Off ???????
@raw 11820, "", 0

@raw 11820, "", 1


◆ Set Escape Location ???????
@raw 11830, "", 1, 0, 0, 0, 1

@raw 11830, "", 1, 0, 0, 1, 1


◆ Change Escape Access ???????
@raw 11840, "", 0

@raw 11840, "", 1



◆Save screen call (system function call)
    @sys.call


    
    [Argument]
    .saveMenu save screen
    .loadMenu load screen
    .partyMenu party menu
    .optionMenu options window
    .licenseMenu license window
    .debugMenu Debug Window
    .toggleScreen Toggle full screen mode
    .f12 Game Reset


    
    .pause pause (debug window only)




    
◆Modification of save prohibition (control of system functions)
    @sys.limitation


    
    [Argument]
    .saveMenu Disables the save screen
    .partyMenu Disable party menu
    .toggleScreen Inhibit screen switching (F4)
    .optionMenu Disable option window (F5)
    .debugMenu Disable debug window (F9)
    .f12 Disable game reset (F12)




    
    
    
◆Setting labels
    @label.set


    
    [Argument]
    Numeric Label number
    String Label name (number is automatically assigned)



    
    
    The following statements are also possible


    
    (label name): (label name)



    
    
◆Jump to the specified label
    @label.jump
    @goto


    
    [Argument]
    Numeric Label number
    String Label name (number is automatically assigned)




    
◆Iterative processing
    Infinite loop/number of times specified


    
    @loop


    
    [Argument]
    Numeric
    Variable
    Switch Loop count
    .inf Infinite loop (default)
    .dst Variable to receive the index (only when specifying the number of times)
    Others Loop contents




    
    Count up/count down


    
    @countUp / @countDown


    
    [Argument]
    Range Range to count
    .dst Variable to receive the index
    Others Loop contents




    
    conditional loop


    
    @while / @doWhile


    
    [Argument]
    Comparison operations Conditional expressions (==, >=, <=, >, <, ! =)
    .dst Variable to receive index
    Others Loop contents



    
    
    element enumeration


### ◆ TPC | foreach <a id='TPC | foreach'></a>
    @foreach


    
    [Arguments for temporary arrays]
    Array Element to enumerate (constant, variable, variable-number variable)
    .dst Element, variable to receive index
    Others Loop contents


    
    [Arguments in the case of a pointer array]
    Variable Array head
    .cnt Number of elements
    .dst element, variable to receive the index
    Others Loop contents

    [Arguments for map events]
    .mev
    .dst Variable to receive event ID and index
    Others Loop contents


### ◆ Break Loop <a id='Break Loop'></a>
    @break


    
    [Arguments]
    Number Number of blocks to get out
    .level(n) Number of blocks to exit




    
    

### ◆ Continue <a id='Continue'></a>
    @continue


    
    [Arguments]
    Number Number of blocks to get out
    .level(n) Number of blocks to exit




    
    

### ◆ End Event Processing <a id='End Event Processing'></a>
    @ev.abort



    

### ◆ Erase Event <a id='Erase Event'></a>
    @ev.erase



    
    
◆ Calling Events
    @ev.call
    @call


    
    [Argument]
    .cev(n)
    .cmn(n)
    .common(n) Common event ID
    .mev(a, b)
    .map(a, b) map event ID, page



    

◆Notes
    @comment


    
    [Argument]
    String Comment Contents



    
    
◆Game Over
    @sys.gameover



    
    
◆Return to title
    @sys.reset



    
    
◆Shutdown
    @sys.shutdown



    
    
◆Get save information
    @save.getInfo


    
    [Argument]
    Array Save number
    .datetime(a, b) Variable that receives the date and time
    .leader(a, b) Variable that receives the level and HP of the first member
    .level(a) variable that receives the level of the first member
    .hp(a) Variable that receives the HP of the first member
    .name(a) String variable that receives the first member's name
    .face(a, b, c, d) Picture ID for drawing the member's face graphic



    
    
◆Execute save
    @save.save


    
    [Arguments]


    
    Array Save number
    .res(n)
    .result(n) Variable to receive the result of the save



    
    
◆Execute load
    @save.load


    
    [Arguments]


    
    Array SaveNumber
    .disableFileCheck Disable file content check
    .disableBlackout Disable blackout on load


//This one is also from Jetrotal's refference.
//Apparently it doesn't work I guess? - TkHuskarl
◆ MNC | End Load Processing (Do Nothing) ???????
@raw 3004, ""
    
    
◆Get/Set mouse coordinates
    @mouse


    
    [Arguments]
    .getPos(a, b) Variable that receives the coordinates
    .setPos(a, b) Coordinates to be set



    
    
◆String picture display
    @pic.strpic


    
    [Arguments]
    Array Picture ID
    String Drawing text


    
    .pos(a, b) Display position
    .center Center coordinates
    .topLeft Top left coordinate
    .bottomLeft bottom left coordinate
    .topRight Top right coordinate
    .bottomRight bottom right coordinate
    .top Top top coordinates
    .bottom Bottom bottom coordinate
    .left Left Left coordinate
    .right Right coordinate

    .scrollWithMap map scrolling linked
    .useChromakey with chromakey
    .chromakey(n) with/without transparency


    
    .scale(n) Scale n%.
    .scale2(a, b) horizontal scale a%, vertical b

    .trans(n) transparency n%.
    .rgbs(r, g, b, s) color tone


    
    .size(a, b) Picture size
    .font(a, b) font name, font size
    .skin(a) name of the graphics file to use for drawing


    
    .noframe Disable the outer frame of the window
    .noGradation Disable text gradient
    .noShadow Disable text shadow
    .noPadding Disable outer margins for text


    
    .nobg Do not draw window background
    .stretch Enlarge
    .tiled Draw side by side


    
    .bold Bold the text
    .charSpacing(n) character spacing
    .lineSpacing(n) line spacing
    .spacing(a, b) Character spacing/line spacing


    
    .rotate(n) rotation effect
    .wave(n) Waveform effect
    .angle(a, b) Angle effect a / b


    
    .multi Multiply
    .add Add
    .overlay Overlay


    
    .hrev
    .hreverse Horizontally reverse
    .vrev
    .vreverse Vertically flipped
    .hvrev
    .hvreverse Horizontally/vertically flipped


    
    .mapLayer Layer in the field
    .battleLayer Layer in battle

    .eraseWhenTransfer Erase when the map is moved
    .eraseWhenEndBattle Erase when battle ends
    .affectedByTint affected by the color tone of the screen
    .affectedByFlash affected by screen flash
    .affectedByShake affected by the shake of the screen



    
    
◆Get picture information
    @pic.getInfo


    
    [Argument for rectangle]
    Array Picture ID
    .baseRect(a, b, c, d) rectangle without scaling correction
    .currentRect(a, b, c, d) Current rectangle
    .goalRect(a, b, c, d) Rectangle after the move is completed


    
    .xywh rectangle with values x, y, w, h
    .ltrb set the rectangle values to left, top, right, bottom
    .cewh rectangle with values cx, cy, w, h


    
    [Argument in pixels]
    Array Picture ID
    .pixel(a, b, c, d) Rectangle to get (xywh)


    
    .dst(a) Output destination of the result
    .ignoreA Ignore alpha value of pixel
    .dynamic Get value with effect
    .static Get value without effect (default)


◆Picture Editing
    @pic.setPixel


    
    [Arguments]
    Array Picture ID
    .xywh(a, b, c, d) Rectangle to be changed
    .src(a) First variable number where pixel information is stored


    
    .opaq Always set pixel A to 0xFF regardless of the specified value
    .skipTrans
    .skipTransparent Transparent pixel data is not applied


◆Picture Editor (Tile)
    @pic.drawTile


    
    [Arguments]
    Array Picture ID
    .xywh(a, b, c, d) Rectangle to be changed
    .src(a) Beginning of variable number where tile ID is stored
    .lower Draw the lower layer
    .upper Draw the upper layer

    .single (n) draws a single tile n
    .range (n) reads tile IDs for a specified range from variable n

    .disableAutoTile Disables auto tiling for lower level drawing
    .wipe Clear specified area before drawing

    .tilesetId (n) tileset to use for drawing
    .pattern (n) animation pattern


    
    Tile ID is the same as the "Rewrite Map" command.
    If 0 is specified for tilesetId, the one in the current map is used.
    If -1 is specified for pattern, a pattern in the same state as that of the map is used.




    
◆Image output
    @img.save


    
    [Arguments]
    .screen Targets the game screen
    .pic(a) Target a picture


    
    .static (for a picture): does not reflect color tones and flashes
    .dynamic (for pictures) reflect color tones and flash


    
    .opaq (for pictures) make all pixels opaque


    
    .dst(n) Output file name



    
    
◆Key input processing EX
    @key.inputEx


    
    [Arguments]
    .keybdGet keyboard state
    .keybdWithBind Get the keyboard state with bind
    .keyCode(n) get the key status of code n
    .joy Get joypad state
    .getBind get joypad assignment state
    .setBind set the joypad assignment state


    
    .src(n)
    .dst(n) Beginning of variable used to get or set



    
    
◆Rewrite map
    @map.rewrite


    
    [Argument]
    .pos(a, b) Starting point of the rewriting position
    .size(a, b) Rewriting range
    .xywh(a, b, c, d) Starting point and range of rewriting position
    .lower Make the target a lower layer
    .upper Make the target the upper layer
    .single(n) rewrite in a single tile n
    .range(n) Read tile IDs for the specified range from variable n
    .disableAutoTile Disable auto tiling when rewriting the lower layer


◆Variable Array Operations
    copy(v[tag1].copy(v[tag2], count)
    v[tag1].copy(v[tag2], count)

    Swap values
    v[tag1].swap(v[tag2], count)

    Ascending sort
    v[tag1].sort(count)


    
    Sort in descending order
    v[tag1].sortDescending(count)


    
    Shuffle
    v[tag1].shuffle(count)


    
    Enumeration of values
    v[tag1].enum(beg, count)


    
    deref(v[tag1].deref(v[tag2], count))
    v[tag1].deref(v[tag2], count)


    
    Binary operations
    v[tag1]. ***(v[tag2].count)


    
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


    
    [Sort/Shuffle Options]
    .sync(a) Head of array a to operate in tandem



    
    
◆Shared Save Operations
    Open/Close/Save/Save and Close
    @gsave.open
    @gsave.close
    @gsave.save
    @gsave.saveAndClose


    
    Switch/Variable/String Variable Operations
    gs[a]. ***(s[b], count)
    gv[a]. ***(v[b], count)
    gt[a]. ***(t[b], count)


    
    copyto
    copyTo Copy from shared save
    copyfrom
    copyfrom Copy to shared save



    

◆Change picture ID
    @pic.setId


    
    [Arguments]
    Array Picture ID


    
    .move(a, b) Move length b to a
    .swap(a, b) Swap IDs by length b with a
    .slide(a, b) Shift ID by length b to a


    
    .ignoreError Do not make errors on out-of-range ID operations



◆Game Option Setting
    @sys.gameOpt


    
    [Arguments].
    .pauseWhenInactive Pause when inactive
    .runWhenInactive Continuously run when inactive
    .fatal(a, b, c) set FPS, test play, message skip respectively
    .picLimit(n) set picture ID limit
    .animLimit(n) Sets the upper limit for the number of battle animations displayed
    .fullFrame No frame skip
    .oneFifth Skip drawing process once every 5 frames
    .oneThird Skip drawing process once every 3 frames
    .oneHalf Skip drawing once every two frames
    .mouse.disableMsgProcession(n)
                            Control the operation of the text window with the mouse (enable=0, disable=0)


    
    .btlOrigin Specifies the display position of the default battle screen
        .center Center Center
        .topLeft Top left
        .bottomLeft Bottom left
        .topRight Top right
        .bottomRight bottom right
        .top top
        .bottom bottom
        .left left
        .right right


    
    .winFaceSize(a, b) Face gras width a, height b in the statement window



    
    
    The arguments of this command are properly divided into multiple commands, except for those that cover the same item.



    

◆Calling commands
    @cmd


    
    [Argument]
    Numeric Command code
    String String argument of the command
    Array Each argument when a numeric argument is specified directly
    `[(expr), ...]' is a numerical argument.      Arguments when specifying numerical arguments as formulas
    .args(a, b) First a and number of elements b of a variable when specifying a numerical argument as an array of variables






    


◆Conditional Branching
    @if


    
    Switch
        s[n].


        
        [Argument]
        .isOn switch is ON (default)
        .isOff switch is OFF



        
    
    Variables
        l (op) r


        
        [op].
        Comparison operations Variable comparisons (==, >=, <=, >, <, ! =)



    
    
     
    
    Money in your possession
        .money


    
        [argument].
        .geq(n) money in hand is greater than or equal to n
        .leq(n) money in hand is less than n



        
    
    Timer1, Timer2
        .timer1
        .timer2


        
        [Arguments]
        .geq(n) Remaining seconds are greater than or equal to n
        .leq(n) Remaining seconds less than n



    
    
    Item
        .item


        
        [Argument]
        Array Item ID
        .exists Possesses the item
        .notExists Item is not in possession



    
    
    .actor
        .actor


        
        [Arguments]
        Array Main character ID
        .isMember protagonist is in the party
        .isNamed(n) Protagonist's name is n
        .level.geq(n) Protagonist's level is n or more
        .hp.geq(n) protagonist's HP is greater than or equal to n
        .hasSkill(n) The hero can use special skill n
        .isEquip(n) Main character has item n
        .hasState(n) protagonist is in state n



    
    
    Character
        .ev


        
        [Arguments]
        Array Character ID
        .player
        .boat
        .ship
        .airship
        .self Special events


        
        [argument for orientation].
        .facingUp facing up
        .facingRight facing right
        .facingDown facing down
        .facingLeft Facing left


        
        [Arguments for existence checks]
        .exists



        
    
    Vehicles
        .boat
        .ship
        .airship


        
        .isDriven on



        
        
    Expression.
        `expr any expression

	//You really should beware of forgetting `. This can be major reason of bugs.
	//Even if you didn't add `, tpc converting often superficially succeeds, but actual process of the Branching will be broken. - TkHuskarl 



        
        
    Others
        .triggeredByDecision Start with decision key
        .bgmHasLooped BGM goes around
        .saveExists Save exists
        .testPlay Test play is enabled
        .atbWaitMode ATB weight is enabled
        .fullscreen Full screen state
        .rightAfterLoad Immediately after loading
        .enableJoy Joypad is enabled
        .active Window is active
        .canOutput File output enabled




        
    
    
    .elif(...)              Conditional branch for the other cases and what to do if it is satisfied
    .else(n) Execution in the other case


    
    Others Execution details when conditions are met


### ◆ TPC | If stringVar <a id='TPC | If stringVar'></a>
    String Variables
        String Variable (op) String


        
        [op]
        .eq l equal to r
        .neq l is not r
        .contains l contains r
        .notContains l does not contain r

        [Argument]
        .ignoreCase Ignore case



    

◆Operation of switches
    s[n].on
    s[n].off
    s[n].toggle
    s[n] = 1
    s[n] = 0



    
    
◆Variable operations

    [operation details].

    v[a] = b assignment
    v[a] += b addition
    v[a] -= b subtract
    v[a] *= b multiplication
    v[a] /= b division
    v[a] %= b Surplus
    v[a] |= b Or
    v[a] &= b And
    v[a] ^= b Xor
    v[a] <<= b Shl
    v[a] >>= b Shr


    
    [special operand].
    item[a].count Number of item a in possession
    item[a].equipCount number of item a equipped
    actor[a].level Level of protagonist a
    actor[a].exp Current experience of protagonist a
    actor[a].hp HP of protagonist a
    actor[a].mp MP of protagonist a
    actor[a].mhp Main character a's maximum HP
    actor[a].mmp Main character a's maximum MP
    actor[a].atk Attack power of protagonist a
    actor[a].def Main character a's defense
    actor[a].mag Main character a's mental power
    actor[a].spd Main character a's agility
    actor[a].weapon Weapon ID of hero a
    actor[a].shield Main character a's shield ID
    actor[a].armor Main character a's armor ID
    actor[a].helm ID of hero a's helmet
    actor[a].accessory ID of hero a's ornament
    actor[a].id ID of hero a
    actor[a].gauge main character a's ATB gauge
    actor[a].reqExp experience required for the next level of protagonist a
    member[a]. *** *** of party member a (same as .actor)
    ev[a].mapId map ID of event a
    ev[a].x X coordinate of event a
    ev[a].y Y coordinate of event a
    ev[a].dir Orientation of event a
    ev[a].scrx event a's screen X
    ev[a].scry Screen Y coordinate of event a
    ev[a].id ID of event a
    enemy[a].hp HP of enemy character a
    enemy[a].mp MP of the enemy character a
    enemy[a].mhp Maximum HP of enemy character a
    enemy[a].mmp Maximum MP of enemy character a
    enemy[a].atk Attack power of enemy character a
    enemy[a].def Defense of enemy character a
    enemy[a].mag Mental Strength of character a
    enemy[a].spd Agility of enemy character a
    enemy[a].id ID of enemy character a
    enemy[a].gauge ATB gauge of enemy character a
    sys.money Money possessed
    sys.timer1 Remaining seconds of timer 1
    sys.timer2 Remaining seconds of timer2
    sys.memberCount number of party members
    sys.saveCount number of saves
    sys.battleCount battle count
    sys.winCount number of victories
    sys.loseCount Defeat Count
    sys.escapeCount escape count
    sys.tick MIDI playing position
    sys.date date
    sys.time Time
    sys.frame Elapsed frames
    sys.version version of maniacs
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
    between Mathematical functions that can be used in variable manipulation expressions
    lerp(a, b, t, td) a + (t / td) * (b - a)
    sum(id, cnt) v[id]. Sum of v[id+cnt-1].
    amin(id, cnt) v[id]. Minimum value of .v[id+cnt-1].
    amax(id, cnt) the minimum value of v[id]. Maximum value of .v[id+cnt-1].



    
    
◆String variable (assignment, concatenation)
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation details].
    .asg assignment
    .cat concatenation



    /*
    Apparently tpc has no sign to express LF such as "\n" (because in RM2003, the combination works to show actor's name)
    So if you want to use LF, you must manually set a string variable as LF token with this assigning operation:
    t[1] .asg"
"
    You cannot inserting indents or something between "".
    -TkHuskarl
    */

    
    [string operand]
    String Value
    .min(n) Minimum number of characters
    .extract Variable expansion in string


    
    [Numeric operand]
    Numeric Value
    .min(n) Minimum number of digits


    
    [switch operand]
    Switch Value
    .min(n) Minimum number of characters


    
    [operand of name].
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
    .member[a].name Data type
    .static Get database value
    .dynamic Get game data values
    .extract Variable expansion in string


    
    [operand of description].
    .actor[a].desc
    .skill[a].desc
    .item[a].desc
    .member[a].desc Data type
    .static Get database value
    .dynamic Get game data values
    .extract Variable expansion in string


    
    [operands of concatenation].
    .cat(a, b, c) string
    .extract Variable expansion in string


    
    [operand of insertion].
    .ins(a, b, c) base string a, index b, insert string c
    .extract Variable expansion in string


    
    [operand for partial deletion].
    .rem
    .remove(a, b, c) base string a, index b, number of characters c
    .extract Variable expansion in string


    
    [operands of substitution].
    .rep(a, b, c) base string a, search string b, replacement string c
    .extract Variable expansion in string


    
    operand of [replacement (regular expression)].
    .exrep(a, b, c)
    .exRep(a, b, c) base string a, search phrase b, replacement string c
    .first Replace only the first matched string
    .extract Variable expansion in string


    
    [operand of cut].
    .subs(a, b, c) base string a, index b, number of characters c
    .extract Variable expansion in string


    
    [array operands].
    .join(a, b, c) delimiter a, first element b, number of elements c
    .extract Variable expansion in string


    
    [operand of file].
    .file(a) filename a
    .sjis Set encoding to shift-jis
    .utf8 Set encoding to utf-8
    .extract Variable expansion in string




    
(cont.) Character string variable (numericalization)<br>

    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .toNum(a, *) Numericize and output to variable a


    
    [* (optional)]
    .extract Variable expansion in string
    .hex Convert as hexadecimal number



    
    
(cont.) Character string variable (get length)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .getLen(a) Outputs the length to variable a




    
(cont.) Character string variable (search)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .inStr(a, b, *) Outputs the position of occurrence of string a to variable b


    //This command returns -1 to variable b when string a was not found. - TkHuskarl  
    
    [*(optional)]
    .beg(a) Search start position (number of characters)
    .extract Variable expansion in search string
    .hex Convert as hexadecimal when expanding numbers


(cont.) Character string variable (search by regular expression)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .exInStr(a, b, *) Outputs the position of occurrence of search phrase a to variable b

    //This command returns -1 to variable b when string a was not found. - TkHuskarl

    
    [*(optional)]
    .beg(a) Search start position (number of characters)
    .extract Variable expansion in search string
    .hex Convert as hexadecimal when expanding numbers


(cont.) Character string variable (extracted by regular expression)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .exMatch(a, b, c, *) Output capture of search phrase a to b and position of occurrence to c


    
    [*(optional)]
    .beg(a) Search start position (number of characters)
    .extract Variable expansion in search string
    .hex Convert as hexadecimal when expanding numbers


(cont.) String variable (split)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation details].
    .split(a, b, c, *) Outputs the array split by string a to string variable b and the number of splits to variable c


    
    [* (optional)]
    .extract Variable expansion within a split string
    .hex Convert as hexadecimal when expanding numbers


(cont.) Character string variable (file output)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .toFile(a, *) Outputs the target to file name a

    //Basically files will be exported at "Gamedirectory/Text/a.txt", so if you want to export somewhere out of Text directory, set a like this:.toFile(../{your_directory_path}/a)
    //You cannot export files outside Game directory.
    //Also, the default encoding seems sjis so you should set .utf8 option unless you're japanese - TkHuskarl 

    
    [* (optional)]
    .sjis Set encoding to shift-jis
    .utf8 Set encoding to utf-8
    .extract Variable expansion of filename strings
    .hex Convert as hexadecimal when expanding numbers






    
(cont.) Character string variable (cut out one line)<br>
    [operation target].
    t[n]]
    t[v[n]]
    t[a..b].
    t[v[a]. .v[b]]

    [operation description].
    .popLine(a, *) Output the clipped line to a


    
    [* (optional)]
    .extract String variable expansion
    .hex Convert as hexadecimal when expanding numbers






    
◆Game information acquisition
    @sys.getInfo


    
    [Common Arguments]
    Variables Result Output Destination
    .dst Result Output Destination


    
    [mapSize]
    .mapSize Get w, h of map


    
    -> dst[0] ~ dst[1].



    
    
    [tileid]
    .tiles(x, y, w, h) get tile ID of rectangle xywh in map
    .lower Get the lower layer
    .upper Get the upper layer


    
    -> dst[0] ~ dst[w * h]



    
    
    [Resolution]
    .winSize Get window w, h


    
    -> dst[0] ~ dst[1].



    
    
    [screen pixel data].
    .pixel(x, y, w, h) Get pixels of rectangle xywh in map
    .ignoreA Ignore the alpha value of the pixel


    
    -> dst[0] ~ dst[w * h]



    
    
    [event information].
    .interpreter.current(n) Get the calling hierarchy n* of the running event


    
    Hierarchy
        0: Executing
        n>0: Traversing the call hierarchy
        n<0: Trace back from the first event


    
    Output contents
        dst[0] Type of event* (event type)
        dst[1] Event ID
        dst[2] Page ID
        dst[3] Start Condition* dst[4] Executing Row
        dst[4] Row being executed


    
    Types of Events
        01: Map Event
        02: Common Event
        04: Battle Event


    
    Reason for call
        00: Decision key
        01: Contacted
        02: Contacted
        03: Auto start
        04: Parallel Processing
        05: Call
        06: Combat start
        07: Parallel processing (during combat)



        
        
    [Chipset ID]
    .tilesetId



    
    
    [face glass].
    .face


    
    .actor[n] target the actor n
    .win Target the sentence window setting


    
    .static Get project data
    .dynamic Get running data

    .dst (a), (b) Output destination of file T[a], index V[b]



    
    
    [Walking Grass]
    .body


    
    .actor[n] target an actor n
    .ev[n] target map event n


    
    .static Get project data
    .dynamic Get running data

    .dst (a), (b) Output destination of file T[a], index V[b]



    
    
    [camera position].
    .camera



    

    [Shake]
    .shake x, y of shake value on screen



    
    
    [BGM]
    .bgm

    .dst (a), (b) file output to T[a], fade-in/volume/tempo/balance V[b..b+3].



    

◆Change of occupation
    @actor.class


    
    [Arguments]
    Array Actor ID
    Numeric Occupation ID
    Variable Occupation ID


    
    .initLevel level to 1
    .keepLevel level


    
    .keepSkill Maintain the special skill
    .initSkill Acquire special skills based on level
    .addSkill Adding a skill


    
    .keepParams Keep the capability value
    .halveParams halve the capability value
    .level1Params Set the ability value to the level 1 equivalent
    .initParams Set the capability value to the value corresponding to the level


    
    .showMsg Show level-up message



◆Change of combat commands
    @actor.cmd


    
    [Arguments]
    Array Actor ID
    Numeric Command ID
    Variable Command ID

    Add .add command
    .sub remove command
    .all (for deletion) Specify all commands



◆Switching combat weights
    @btl.atbMode


    
    [Arguments]
    .toggle Turns the weight on and off





    
    
◆Control of combat processing
    @btl.hook


    
    [Arguments]
    .atb ATB Gauge increase/decrease
    .damagePop damage pop
    .targeting Targeting
    .addState state
    .paramBuff Targeting changes in ability values other than HP


    
    .none Release control
    .cev(a) Common event used for control
    .var(a) Beginning of variable used for control



◆ATB Gauge Operation
    @btl.atb


    
    [Argument]
    Array (if standalone) ID of the target
    .actor Make the target an actor
    .member Target is a member
    .party Target is the whole party
    .enemy Target is the enemy character
    .troop Target is the entire enemy


    
    .set(a) set the gauge
    .add(a) add a gauge
    .sub(a) Subtracts a gauge


    
    .percent value as a percentage




    
    
    
◆Combat Command Change EX
    @btl.cmdex


    
    [Arguments]
    .change(a) "change" command
    .fight(a) "fight" command
    .auto(a) "auto" command
    .escape(a) "escape" command
    .win(a) "win" command
    .lose(a) Set "lose" command (0 to disable)




    
    
    
◆Get battle information
    @btl.getInfo

    [Arguments]
    .actor(a) Make the target an actor a
    .member(a) target is member a
    .party (a) target is the whole party
    .enemy(a) target is the enemy character a
    .troop(a) target is the enemy as a whole


    
    .buff status correction
    .state state
    .element Attributes
    .misc Other


    
    .list Member List
    .alive List of Survivors
    .canMove List of those who can move


    
    .dst(a) Beginning of output variable




    
    
    
◆Increase/decrease of HP of enemy characters
    @enemy.hp


    
    [Argument]
    Array Target ID


    
    .add(a) increase
    .sub(a) decrease


    
    .make the .percent value a percentage
    .possibleDie Allow death by operation




    
    
    
◆Increase/decrease of MP of enemy characters
    @enemy.mp


    
    [Argument]
    Array Target ID


    
    .add(a) increase
    .sub(a) decrease




    
    

◆Changing the state of an enemy character
    @enemy.state


    
    [Argument]
    Array Target ID


    
    .add(a) add
    .sub(a) cancel




    
    
    
◆Enemy Character Appearance
    @enemy.appear


    
    [Argument]
    Array Target ID




    
    
    
◆Change of battle background
    @btl.backdrop

    [Argument]
    String Target file



◆Display of battle animation (during battle)
    @btl.anim


    
    [Arguments]
    Array Animation ID

    .troop Targets the entire enemy
    .enemy(a) targets a single enemy character a
    .party(a) targets an ally
    .actor(a) target an ally


    
    .wait Wait until completion



◆Consecutive Attacks
    @actor.multipleAct


    
    [Arguments]
    Array Main character ID
    .cmd(a) Target command
    .times(a) Number of iterations




    
    

◆100% Escape
    @btl.forceEscape


    
    [Arguments]
    .party Targets all allies
    .troop Targets all enemies
    .enemy(a) Target a single enemy


    
    .cancelIfSideAttack Can't get away with side attack




    
    

◆Conditional Branching (in battle)
    @btl.if


    
    [Arguments]
    Switch
        s[n].


        
        [Argument]
        .isOn switch is ON (default)
        .isOff switch is OFF



        
    
    Variables
        l (op) r


        
        [op].
        Comparison operations Variable comparisons (==, >=, <=, >, <, ! =)



        
        
    .actor
        .actor


        
        Array Main character ID
        .canMove ~ can act
        .use(a) ~ selects a


    Enemy Character
        .enemy


        
        Array Enemy Character Number
        .canMove ~ can act
        .isTarget ~ is the target
        .hasState(a) ~ is in state a




    
    .elif(...)                  Conditional branch for the other cases and what to do if it is satisfied
    .else(n) Execution in the other case


    
    Others Execution details when conditions are met




    
    

◆Calling Common Events
    @btl.cev


    
    [Argument]
    Numeric value
    Variable Event ID




    
    

◆Combat Abort
    @btl.abort



◆Processing of name input
    @actor.inputName


    
    [Arguments]
    Array Actor ID


    
    .kana Select katakana as initial state
    .preset Current name as input state




    
    

◆Combat handling
    @btl.begin


    
    [Arguments]
    .troop Enemy group to appear


    
    .normal Normal combat format
    .back_actor Back attack (enemy←friend)
    .back_enemy Back attack (ally←enemy)
    .side_actor Side attack (enemy←enemy)
    .side_enemy Side attack (ally←enemy)


    
    .backdropFile(a) File name of the battle background a
    .backdropId(a) Terrain ID of the battle background a


    
    .shallow Looking down type
    .deep Depth type


    
    .disableEscape Escape not possible
    .enableEscape Event interrupted by escape
    .enableGameover Game over on defeat


    
    .preempt Preempt
    .disableFlash Flash Disable


    
    .win Branch when winning
    .lose Branch when defeated
    .escape Branch when escaped




    


◆Housekeeper processing
    @inn


    
    [Arguments]
    .msg(a) message type(0..2)
    .cost(a) price


    
    .stay Branch when staying
    .leave Branch when not staying



◆Shop processing
    @shop


    
    [Argument]
    Numeric Item ID


    
    .msg(a) Message type (0..2)


    
    .normal Normal Normal
    .buyOnly Buy only
    .sellOnly Sell Only


    
    .goods(a, b) Head a of variable storing item ID, number of elements b


    
    .transaction Branch when buying or selling
    .noTransaction Branch when no transaction




  

    
◆Call up the load screen
    @sys.loadMenu




    
    

◆Call up the option screen
    @sys.optionMenu




    
    

◆Fullscreen mode switching
    @sys.fullscreen

    [Arguments]
    .toggle Toggle (default)



◆Call up the menu screen
    @sys.partyMenu




    
    
    
◆Menu prohibition change
    @sys.menuAccess


    
    [Arguments]
    .on Allow
    .off Prohibit




    
    
    
◆Others
    @raw

    [Argument]
    Argument 0 is the command code
    Argument 1 is considered a string argument
    Argument 2 and subsequent arguments are considered numerical arguments, and the command is generated.




    
    
    
◇Directive
    Specifies what kind of operation to perform


◆Operation
    Specify one of the following

    #doNothing
    Do nothing (default)



    
    
    #apply
    Reads the file related to the item described in the source,
    and update the contents.
    Commands that do not belong anywhere are ignored.



    
    
    #toClip
    Outputs the item described in the source to the clipboard
    Common events, map events, and event page IDs are ignored.



    
    
    #bin2text
    Converts game project data to text
    The text is in its own format according to the blueprint, not tpc
    If the tpc source code includes common events, etc., the changes will be applied before output.
    For map data, an ID is appended to the end of the specified file name as a 4-digit number.
    Don't forget to back up your map data to prevent problems.



    
    
        [Arguments of bin2text]
        .db(n) Text file n to output converted database
        .map(n) Text file n to output converted map data
        .tree(n) Text file n to output converted map tree
        Array Target map ID


    #text2bin
    Generate game project data from text
    The text is in its own format according to the blueprint, not tpc
    If the tpc source code includes common events, etc., these changes are applied before output.
    For map data, a 4-digit ID is appended to the end of the specified file name.
    Don't forget to back up your map data to prevent problems.


    
        Arguments for [text2bin].
        .db(n) File n to output the generated database
        .map(n) File n to output the generated map data
        .tree(n) File n to output the generated map tree
        Array Target map IDs



        

◆Reading blueprints
    #blueprint


    
    [Arguments]
    .db(n) reads database blueprint file n
    .map(n) reads map data blueprint file n
    .tree(n) reads in blueprint file n for map tree

    Required when updating files and outputting clips other than event commands.



    
    
◆Directory specification
    #directory

    [Arguments]
    String Directory to be used for input/output




    
    Required when updating files



    

◆Setting of operation for duplicated files
    #copyMode


    
    [Arguments]
    .backup Backup and overwrite (default)
    .force overwrite as is



    
    
    Backups are taken in the same location as the 2003 Extended Editor
    (specified directory)/Backup/(date/time).zip




    
◆source file loading
    #include "src"


    
    [Arguments]
    String File name to be read



    
    
    Adds the source text at the described position.
    Fails if written anywhere but at the beginning of the line.



    

◆sentence options
    #msg

    [Arguments]
    .none None (default)
    .instant Append "\>" to the beginning of every line



    
    
◆optimize
    #optimize

    [Arguments]
    Numeric Specifies optimization level Default is 0 (none)



    

    For now, only 0 (invalid) and 1 or more (valid) are distinguished.



    
    
◆grammar options
    #brace


    
    [Arguments]
    Composes part of the .does argument


    
      [Argument]
      .not Compose part of the argument

        [Argument]
        .represent Compose part of the argument

          [Argument]
          .the argument forms part of the argument

            [Arguments]
            Composes part of the .start argument.


    
              [Argument]
              .of argument part of the composition


    
                [Argument]
                .the argument forms part of the argument


        
                  [. argument]
                  .argument
                  .arguments
                            Braces are not recognized as argument start symbols
                            Event command name abbreviation notation cannot be used when setting


◇ Meta syntax


◆constant definitions
    def


    
    Assigns a value to any definition name

    If a value is omitted, it is assumed to be a number and assigned sequentially, starting with the initial value of 0.
    If a number is specified, it will be the default value +1 thereafter.


    
    Some values, such as event command names, do not work well even if defined



    
    
    [SAMPLE]
    def qwe = 33


    
    def {
        a = 6
        b //b is 7
        c //c is 8
        d = "aaa"
        e //e is 9
    }




    
◆switch / variable / string variable definition
    defs / defv / deft


    
    Assigns any switch/variable/string variable to an arbitrary definition name.
    Basically the same as def, but the right-hand side can only contain numbers or range values, and the default value is 1 when omitted.

    [sample].
    defv qwe = 10 //qwe is v[10]




    
    

◆Meta Variables
    $Variable Name



    

◆ metafunctions
    __fn


    
    [Arguments]
    Zero is the metafunction name.
    The first through the number of arguments-1 are meta variables that receive arguments
    The last argument is the content of execution


    
    [SAMPLE]


    
    __fn qwe $a $b {
        @comment $b
        @msg.show $a
    }


    
    qwe("abcd" "efgh")



    
    
◆loop
    __loop


    
    [Argument (number of times specified)]
    0-th is the number of executions
    The first is a metavariable that receives the index (optional)
    The second and subsequent numbers are the execution details.


    
    [Argument (element enumeration)]
    Array whose 0th argument is the array containing the elements to be enumerated
    1st is a metavariable (optional) that receives the elements
    The second is a metavariable that takes an index (optional)
    The third and following are the execution details


    
    [SAMPLE]


    
    __loop 5 $i {
        @msg.face "Actor1" $i
    }


    
    __loop ["qwe" "rty" "uio"] $e {
        $e
    }

    __loop ["qwe" "rty" "uio"] $e $i {
        @msg.face $e $i
    }


◆Conditional Branching
    __if


    
    [Argument]
    Zero is the condition
    1st is what is executed when the first is true
    Second is .elif or .else (optional)

    [.elif arguments].
    Same as __if

    [.else argument].
    0th is the execution content


    
    [SAMPLE]


    
    __if qwe == 2 {
        "if".


    
    } .elif qwe == 3 {
        "elif".


        
    } .else {
        "else".


        
    }



    
    
◆ID acquisition

    __id


    
    [Arguments]
    Variables of RPG Maker (v, s, t)

    /*Sometimes you have to use Metavariables with this acquisition. This is the example:
    
    __fn samplefunc $string $variable {

    //You cannot use metavariable argument as a particular type  - these lines below will be invalid 
    $string .asg "Henlo"
    $variable += 1

    //Instead you have to write like this:
    t[__id($string)] .asg "Henlo"
    v[__id($variable)] +=1

    }


    - TkHuskarl*/


    
    
    
◆String

    __str


    
    [Argument]
    Arbitrary value



    
    
    Multiple arguments are concatenated in the order they are given.



    
    
◆Definition Check
    __defined


    
    Checks if a given argument is a definition or metavariable with a value

    [Argument]
    Arbitrary value



