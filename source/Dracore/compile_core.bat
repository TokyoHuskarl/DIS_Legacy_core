@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================
echo *Compile Dra Core* 
echo Making Backup.
call %tpc% "./../headers/MAKE_BACKUP.tpc" -en
echo; 

set target=module_core_Game_init
echo Compiling Init Process. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_Game_ui_general
echo Compiling Game UI module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_Game_items_general
echo Compiling Game item module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_Game_misc_general
echo Compiling Game misc module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_Game_scripts_general
echo Compiling Game scripts module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_main
echo Compiling RTS Core Main. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_drawing
echo Compiling RTS Unit Drawing Process. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_RTS_agent_general
echo Compiling Agent management module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_control_general
echo Compiling RTS Control module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_ui_general
echo Compiling RTS UI module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_mission_general
echo Compiling Mission functions. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_RTS_cohort_general
echo Compiling RTS cohort manager. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_battlesystem_general
echo Compiling RTS battle system module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_sightsystem_general
echo Compiling Sight System. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_RTS_pathfinding_general
echo Compiling Pathfinding System. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

echo All compile process finished. Es ist vorbei.
pause
