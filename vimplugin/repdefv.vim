
" these settings rather should be written in .vimrc

" cd $DIS_APPEND

map <S-T><S-D> :Dab<CR>
map <S-T><S-T> :tabnew<CR>
map <S-T><S-C> :CurrentFileName<CR>
map <S-T><S-H> :Dh<CR>

function! Dstv()
		" Set the size of the split window (percentage of the screen height)
		let s:terminal_height_percentage = 20

		" Calculate the terminal window height as an integer
		let s:terminal_lines = (s:terminal_height_percentage * &lines) / 100

		" Open a new split terminal window
		execute "below " . s:terminal_lines . "split"
		term
endfunction

function! OpenTerminalSplit()
		" Set the size of the split window (percentage of the screen height)
		let s:terminal_height_percentage = 20

		" Calculate the terminal window height as an integer
		let s:terminal_lines = (s:terminal_height_percentage * &lines) / 100

		" Open a new split terminal window
		execute "below " . s:terminal_lines . "split"
		term
endfunction


function! Compile_DIS_core()
	cd ~/Dropbox/2003/DIS_Legacy/Append/source/Dracore/
	!bash sh_compile_core.sh
	echo "DIS Core system compile called."
endfunction

function! Copy_DIS_js()
	cd ~/Dropbox/2003/DIS_Legacy/Append/
	!bash copyalljs.sh
endfunction

function! FunctionKeyShortcutForDISCodeComp()
	if exists('b:current_syntax')
		if b:current_syntax == "tpc"
			call Compile_DIS_core()
		elseif  b:current_syntax == "javascript"
			call Copy_DIS_js()
		elseif  b:current_syntax == "markdown"
			tabnew %
			term glow %
		else
			echo "Hey, this doesn't seem a DIS code. check it out"
		endif
	else 
		echo "Your buffer doesn't even need syntax highlighting, call again after loading certain code file."
	endif 
endfunction

"if exists("b:current_syntax")
"  finish
"endif

function! DIS_testplay()
		!wine ~/Dropbox/2003/DIS_Legacy/DIS_Legacy TestPlay
endfunction

" Map a key (e.g., <F5>) to call the function
nnoremap <F5> :call OpenTerminalSplit()<CR>
nnoremap <F6> :call FunctionKeyShortcutForDISCodeComp()<CR>
nnoremap <F7> :call DIS_testplay()<CR>

command! CurrentFileName :call s:CFileName()
function! s:CFileName()
	let @* = expand('%:t')
	let @" = expand('%:t')
	call system('xclip -i -selection clipboard', @")
	echo "Current file name copied to clip board"
endfunction

" autocmd syntax for MP 
autocmd BufNewFile,BufRead *.js.txt set filetype=javascript
autocmd BufNewFile,BufRead *.json.txt set filetype=json



" run current buffer as shell script
command! -nargs=0 Sh call ExecSh()
function! ExecSh()
	!bash %
endfunction




" open TPC help
command! -nargs=0 Htpc call Help_tpc()
function! Help_tpc()
 tabnew ~/Dropbox/2003/DIS_Legacy/Append/readme.txt
endfunction

" open ref memo
command! -nargs=0 Href call Help_ref()
function! Help_ref()
 tabnew ~/Dropbox/2003/DIS_Legacy/Append/reference/memo.txt
endfunction


" open DIS Append Directory
command! -nargs=0 Dab call Open_DIS_Append()
function! Open_DIS_Append()
	cd ~/Dropbox/2003/DIS_Legacy/Append/
	tabnew ~/Dropbox/2003/DIS_Legacy/Append/ "$DIS_APPEND
endfunction

" open DIS Append Directory
command! -nargs=0 Dh call Open_DIS_header()
function! Open_DIS_header()
	cd ~/Dropbox/2003/DIS_Legacy/Append/source/headers/
	tabnew ~/Dropbox/2003/DIS_Legacy/Append/source/headers/
endfunction


"replace pics more easily
"
command! -nargs=* Sdefp call Repdefp(<f-args>)
function! Repdefp(linebegin,lineend,target,goal)
 let s:before = "pic\\[" . a:target ."\\]"
 let s:goal = "pic\\[" . a:goal ."\\]"
 "echo "replace this " . s:before . "with " . a:goal
 let s:i = a:linebegin
 for liner in getline(a:linebegin,a:lineend)
  let s:listr = liner
  let repl = substitute(liner, s:before, s:goal, "g")
  call setline(s:i,repl)
  let s:i += 1
 endfor
 "echo "replace finished"
endfunction

"replace deft more easily
"
command! -nargs=* Sdeft call Repdeft(<f-args>)
function! Repdeft(linebegin,lineend,target,goal)
 let s:before = "t\\[" . a:target ."\\]"
 "echo "replace this " . s:before . "with " . a:goal
 let s:i = a:linebegin
 for liner in getline(a:linebegin,a:lineend)
  let s:listr = liner
  let repl = substitute(liner, s:before, a:goal, "g")
  call setline(s:i,repl)
  let s:i += 1
 endfor
 "echo "replace finished"
endfunction



"replace defs more easily
"
command! -nargs=* Sdefs call Repdefs(<f-args>)
function! Repdefs(linebegin,lineend,target,goal)
 let s:before = "s\\[" . a:target ."\\]"
 "echo "replace this " . s:before . "with " . a:goal
 let s:i = a:linebegin
 for liner in getline(a:linebegin,a:lineend)
  let s:listr = liner
  let repl = substitute(liner, s:before, a:goal, "g")
  call setline(s:i,repl)
  let s:i += 1
 endfor
 "echo "replace finished"
endfunction

"replace defv more easily
"
command! -nargs=* Sdefv call Repdefv(<f-args>)
function! Repdefv(linebegin,lineend,target,goal)
 let s:before = "v\\[" . a:target ."\\]"
 "echo "replace this " . s:before . "with " . a:goal
 let s:i = a:linebegin
 for liner in getline(a:linebegin,a:lineend)
  let s:listr = liner
  let repl = substitute(liner, s:before, a:goal, "g")
  call setline(s:i,repl)
  let s:i += 1
 endfor

 "echo "replace finished"
endfunction


"set __id(hoo) more instantly
command! -nargs=* Pidw call Paste_id_word(<f-args>)
function! Paste_id_word(word)
    let s:text = "__id(" . a:word . ")"
    let cur_line_num = line('.')
    let cur_col_num = col('.')
    let orig_line = getline('.')
    let modified_line =
        \ strpart(orig_line, 0, cur_col_num - 1)
        \ . s:text
        \ . strpart(orig_line, cur_col_num - 1)
    " Replace the current line with the modified line.
    call setline(cur_line_num, modified_line)
    " Place cursor on the last character of the inserted text.
    call cursor(cur_line_num, cur_col_num + strlen(s:text))
endfunction


"set __id(v[n]) more instantly

command! -nargs=* Pidv call Paste_id_var(<f-args>)
function! Paste_id_var(word)
    let s:var = "v\[" . a:word ."\]"
    let s:text = "__id(" . s:var . ")"
    let cur_line_num = line('.')
    let cur_col_num = col('.')
    let orig_line = getline('.')
    let modified_line =
        \ strpart(orig_line, 0, cur_col_num - 1)
        \ . s:text
        \ . strpart(orig_line, cur_col_num - 1)
    " Replace the current line with the modified line.
    call setline(cur_line_num, modified_line)
    " Place cursor on the last character of the inserted text.
    call cursor(cur_line_num, cur_col_num + strlen(s:text))
endfunction

