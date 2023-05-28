@echo off
IF NOT DEFINED argfile (set argfile="./../PSEUDO_ARG")
IF NOT DEFINED build ( 
	rem set arg
	echo def PSEUDO_ARG_SET = 1 > %argfile%
	echo def MAKE_TYPE  = 0 >> %argfile%
)
rem // TPC exe
IF NOT DEFINED tpc (set tpc="./../../tpc.exe")

rem //log directory
IF NOT DEFINED log (set log="./../../logs/log_scenes")

rem //Current Directory
IF NOT DEFINED current (set current="./")
rem ==================================================================================

IF NOT DEFINED build ( 
	echo *Compile DIS Scenes* > %log%".txt"
)
set target=module_Scenes_Title_general
echo Compiling Title. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" >> %log%".txt"
echo; >> %log%".txt"


IF NOT DEFINED build ( 
	echo All compile process finished. Es ist vorbei.
	pause
)
