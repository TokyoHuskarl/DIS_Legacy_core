@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================


set target=module_core_RTS_pathfinding_general
echo Compiling RTS battle system. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;


echo All compile process finished. Es ist vorbei.
pause
