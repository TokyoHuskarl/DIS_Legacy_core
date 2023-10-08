@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================
IF NOT DEFINED argfile (set argfile="./../PSEUDO_ARG")
IF NOT DEFINED build ( 
	rem set arg
	echo def PSEUDO_ARG_SET = 1 > %argfile%
	echo def MAKE_TYPE  = 0 >> %argfile%
)
set target=module_core_RTS_control_general
echo Compiling RTS control. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;


set target=module_core_RTS_ui_general
echo Compiling RTS ui. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_core_Game_ui_general
echo Compiling Game ui. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

echo All compile process finished. Es ist vorbei.
pause
