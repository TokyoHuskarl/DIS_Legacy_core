" Vim syntax file
" Language:	DIS Script
" First Author:	Tokyo Huskarl
" Last Change:	
echo "it's incomplete"
let CheckDIS = getline(1)
if CheckDIS == '#!DIS_SCRIPT'
	echo "Loading DIS Script syntax!"
	let b:current_syntax = "DIS"
	syn region DIS_variables start=/\\v\[/ end=/\]/
	syn region DIS_variables start=/v:/
	syn region DIS_colour start=/\\c\[/ end=/\]/
	syn region DIS_strings start=/\\t\[/ end=/\]/	
	syn keyword DIS_Conditional if else elif
	syn keyword DIS_Define let
	syn region DIS_Fold start="{" end="}" transparent fold
	syn keyword DIS_Delimiter ,
	syn match DIS_Number "TRP_\w*" "STA_\w*" contained

	highlight link DIS_Number Number

	highlight link DIS_variables Number 
	highlight link DIS_strings String 
	highlight link DIS_colour Tag 
endif



