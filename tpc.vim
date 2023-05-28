" Vim syntax file
" Language:	TPC for RM2003 Maniacs
" First Author:	Tokyo Huskarl
" Last Change:	2023 Mar 24
" garbage syntax file lmao

" quit when a syntax file was already loaded
if exists("b:current_syntax")
  finish
endif

syn match tpcMetaVar "\$\S*" contains=tpcNumber
syn match tpcString "__str(\S*)" contains=tpcMetaVar
syn match tpcNumber "__id(\S*)" contains=tpcMetaVar

syn keyword tpcDelimiter ,

" syn match "\." tpcKeyword

syntax keyword tpcInclude #include include
syntax keyword tpcPreProc #brace #optimize #msg #copyMode #directory #blueprint #text2bin #bin2text #toCli #applyp #doNothing
syntax keyword tpcPreCondit __if
syntax keyword tpcDefine def defs defv deft
syntax keyword tpcConditional if else elif
syntax keyword tpcRepeat loop countUp countDown doWhile while foreach __loop 


" +@\S*+"
syn region tpcComment start=+\/\*+ end=+\*\/+ fold
"contains=tpcHighlight
syn match tpcComment /\/\/.*/
syn match tpcComment /@comment\s".*"/ contained

syn keyword tpcFunctions cev mev __fn break mep ev
 
syntax keyword tpcOperator copy sub add mul div muldiv divmul max min asg split cat rem ins exrep rep subs file join extract ToFile inStr


" syntax region tpcComment start=/@comment\s"/ end=/"/ 
" integer number
syntax match tpcNumber "\<\d\+\>"

syntax match tpcHighlight +.*\*\*\/+ contained



syntax region tpcString  start=+"+ end=+"+ contains=DIS_variables,DIS_colour,DIS_strings


syn match tpcCommands +@\S*+ contains=tpcConditional,tpcRepeat,tpcComment,tpcMetaVar
syn match tpcVar "v\[\S*\]" contains=tpcNumber,tpcMetaVar
syn match tpcChar "t\[\S*\]" contains=tpcNumber,tpcMetaVar
syn match tpcSwitch "s\[\S*\]" contains=tpcNumber,tpcMetaVar



"syntax region tpcVar start=/v\[/ end=/\]/ skip=+\[v\[.*\]+
"syntax region tpcChar start=/t\[/ end=/\]/
"syntax region tpcSwitch start=/s\[/ end=/\]/


syntax keyword tpcBool on off
syntax region tpcFold start="{" end="}" transparent fold 

"syntax region tpcFold start="\/\*" end="\*\/" transparent fold contained


syntax region DIS_variables start=/\\v\[/ end=/\]/
syntax region DIS_colour start=/\\c\[/ end=/\]/
syntax region DIS_strings start=/\\t\[/ end=/\]/


highlight link tpcInclude Include
highlight link tpcPreProc PreProc
highlight link tpcPreCondit PreCondit

highlight link tpcConditional Conditional
highlight link tpcRepeat Repeat
highlight link tpcOperator Operator
highlight link tpcDefine Define
highlight link tpcCommands Function
highlight link tpcFunctions Function
highlight link tpcNumber Number
highlight link tpcString String
highlight link tpcChar Type
highlight link tpcMetaVar Identifier 
"Number

highlight link tpcDelimiter Delimiter
highlight link tpcVar Type
highlight link tpcSwitch Type
highlight link tpcBool Boolean
highlight link tpcComment Comment
highlight link tpcHighlight Todo

highlight link tpcKeyword Keyword


highlight link DIS_lang_symbols Character
highlight link DIS_variables Number 
highlight link DIS_strings String 
highlight link DIS_colour Tag 





let b:current_syntax = "tpc"
