@echo off

rem // TPC exe
IF NOT DEFINED tpc (set tpc="./../../tpc.exe")

rem //log directory
IF NOT DEFINED log (set log="./../../logs/log_compile_toolbox")

rem //Current Directory
IF NOT DEFINED current (set current="./")
rem ==================================================================================

IF NOT DEFINED build ( 
	echo *Compile DIS Toolbox* > %log%".txt"
)
set target=module_console_general
echo Compiling Console System. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"


IF NOT DEFINED build ( 
	echo All compile process finished. Es ist vorbei.
	pause
)
