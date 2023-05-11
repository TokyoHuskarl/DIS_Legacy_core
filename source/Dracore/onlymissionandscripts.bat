@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================


set target=module_core_RTS_mission_general
echo Compiling Mission functions. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo; 

set target=module_core_Game_scripts_general
echo Compiling Game scripts module. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

echo All compile process finished. Es ist vorbei.
pause
