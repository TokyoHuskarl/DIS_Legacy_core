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
IF NOT DEFINED log (set log="./../../logs/log_compile_preset_database")

rem //Current Directory
IF NOT DEFINED current (set current="./")
rem ==================================================================================

IF NOT DEFINED build (
	echo *Compile DIS preset database*  > %log%".txt"
	echo Making Backup.
	call %tpc% "./../headers/MAKE_BACKUP.tpc" -en
	echo; >> %log%".txt" 
)
set target=module_preset_buffs_general
echo Compiling preset buff - %target%  >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_preset_particles_general
echo Compiling preset particles. - %target%  >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_preset_statics_general
echo Compiling preset effects. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_preset_effects_general
echo Compiling preset effects. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

set target=module_preset_skills_general
echo Compiling preset skills. - %target% >> %log%".txt"
call %tpc% %current%%target%".tpc" -en >> %log%".txt"
echo; >> %log%".txt"

IF NOT DEFINED build ( 
	echo All compile process finished. Es ist vorbei. >> %log%".txt"
	pause
)
