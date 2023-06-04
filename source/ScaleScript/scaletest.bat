@echo off


rem // TPC exe
IF NOT DEFINED tpc (set tpc="./../../tpc.exe")

rem //log directory
IF NOT DEFINED log (set log="./../../logs/log_compile_toolbox")

rem //Current Directory
IF NOT DEFINED current (set current="./")
rem ==================================================================================

set target=test
echo test. 
call %tpc% %current%%target%".tpc" -en

set target=header_scalescript
echo test. 
call %tpc% %current%%target%".tpc" -en



IF NOT DEFINED build ( 
	echo All compile process finished. Es ist vorbei.
	pause
)
