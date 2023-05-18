@echo off
cd /d %~dp0


rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================


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

set target=module_core_RTS_sightsystem_general
echo Compiling Sight System. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;


echo All compile process finished. Es ist vorbei.
pause
