@echo off

rem // TPC exe
set tpc="./../../tpc.exe"

rem //log directory
set log="./../../logs/log_"
rem ==================================================================================
echo *Compile DIS preset database* 
echo Making Backup.
call %tpc% "./../headers/MAKE_BACKUP.tpc" -en
echo; 

set target=module_preset_particles_general
echo Compiling preset particles. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_preset_statics_general
echo Compiling preset effects. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_preset_effects_general
echo Compiling preset effects. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

set target=module_preset_skills_general
echo Compiling preset skills. - %target%
call %tpc% "./"%target%".tpc" > %log%%target%".txt" -en
echo;

echo All compile process finished. Es ist vorbei.
pause
