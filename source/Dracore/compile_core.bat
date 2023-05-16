@echo off

rem // TPC exe
IF NOT DEFINED tpc (set tpc="./../../tpc.exe")

rem //log directory
IF NOT DEFINED log (set log="./../../logs/log_compile_core")

rem //Current Directory
IF NOT DEFINED current (set current="./")
rem ==================================================================================

rem not alle
IF NOT DEFINED build ( 
	echo *Compile Dra Core* > %log%".txt"
	echo Making Backup.
	call %tpc% "./../headers/MAKE_BACKUP.tpc" -en
	echo; >> %log%".txt" 
)

set target=module_core_Game_init
echo Compiling Init Process. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_Game_ui_general
echo Compiling Game UI module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt" 

set target=module_core_Game_items_general
echo Compiling Game item module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt" 

set target=module_core_Game_misc_general
echo Compiling Game misc module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt" 

set target=module_core_Game_scripts_general
echo Compiling Game scripts module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_main
echo Compiling RTS Core Main. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_drawing
echo Compiling RTS Unit Drawing Process. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt" 

set target=module_core_RTS_agent_general
echo Compiling Agent management module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_control_general
echo Compiling RTS Control module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_ui_general
echo Compiling RTS UI module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_mission_general
echo Compiling Mission functions. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt" 

set target=module_core_RTS_cohort_general
echo Compiling RTS cohort manager. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_battlesystem_general
echo Compiling RTS battle system module. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_sightsystem_general
echo Compiling Sight System. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_core_RTS_pathfinding_general
echo Compiling Pathfinding System. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

rem not alle
IF NOT DEFINED build ( 
	echo Dracore compile process finished.
	pause
)
