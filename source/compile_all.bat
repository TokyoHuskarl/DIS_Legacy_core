@echo off

rem // TPC exe
set tpc="./../tpc.exe"

rem //log directory
set log="./../logs/log_all_build"
rem //Alle :D
set build=1

rem ==================================================================================

rem 日付取得
echo %date% > %log%"_MAIN.txt"

rem 時間取得
echo %time% >> %log%"_MAIN.txt"


echo *Compile DIS LDB* >> %log%"_MAIN.txt"

echo Making Backup.
call %tpc% "./headers/MAKE_BACKUP_ALLE.tpc" -en >> %log%"_MAIN.txt"
echo;


echo *Compile Start - Attention, if you have bug you have to check by trying compiling each of them*  >> %log%"_MAIN.txt"

rem //current directory set 
set current="./Dracore/"
echo *Compile Dra Core* >> %log%"_MAIN.txt"
call "./Dracore/compile_core.bat"  >> %log%"_MAIN.txt"
echo *Dra core Compiled.*  >> %log%"_MAIN.txt"
echo;

rem //current directory set 
set current="./preset_databases/"
echo *Compile Preset Database* >> %log%"_MAIN.txt"
call "./preset_databases/compile_database.bat" >> %log%"_MAIN.txt"
echo *Preset Database Compiled.*  >> %log%"_MAIN.txt"
echo;

rem //current directory set 
set current="./Toolbox/"
echo *Compile DIS Toolbox* >> %log%"_MAIN.txt"
call "./Toolbox/compile_toolbox.bat" >> %log%"_MAIN.txt"
echo *DIS Toolbox Compiled.*  >> %log%"_MAIN.txt"
echo;




echo All compile process finished - IT'S OVER. >> %log%"_MAIN.txt"
pause

