@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================

IF NOT DEFINED argfile (
	rem set arg
	set argfile="./../PSEUDO_ARG"
	echo def PSEUDO_ARG_SET = 1 > %argfile%
	echo def MAKE_TYPE  = 0 >> %argfile%
)

set target=module_core_RTS_pathfinding_general
echo Compiling RTS battle system. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;


echo All compile process finished. Es ist vorbei.
pause
