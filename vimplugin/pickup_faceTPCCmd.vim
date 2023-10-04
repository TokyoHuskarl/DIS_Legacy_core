function! PickupLinesAndReplaceBuffer()
  " Store the lines that contain '@msg.face' here
  let pickedUpLines = []
  
  " Iterate over each line in the buffer
  for lnum in range(1, line('$'))
    let line = getline(lnum)
    
    " Check if the line contains '@msg.face'
    if line =~ '@msg\.face'
      call add(pickedUpLines, line)
    endif
  endfor
  
  " Delete all lines in the current buffer
  silent! execute "1,$delete _"
  
  " Insert the picked-up lines into the buffer
  call append(0, pickedUpLines)
endfunction


function! PickupLinesAndReplaceBuffer()
  " Use a dictionary to store unique lines that contain '@msg.face'
  let uniqueLines = {}
  
  " Iterate over each line in the buffer
  for lnum in range(1, line('$'))
    let line = getline(lnum)
    
    " Check if the line contains '@msg.face'
    if line =~ '@msg\.face'
      " Use the line itself as a key to store it uniquely
      let uniqueLines[line] = 1
    endif
  endfor
  
  " Delete all lines in the current buffer
  silent! execute "1,$delete _"
  
  " Insert the unique picked-up lines into the buffer
  call append(0, keys(uniqueLines))
endfunction


function! SortBySecondElement()
  " Read all lines into a list
  let lines = getline(1, '$')
  
  " Sort lines by the second element
  let sortedLines = sort(lines, 'CompareBySecondElement')
  
  " Delete all lines in the current buffer
  silent! execute "1,$delete _"
  
  " Insert the sorted lines back into the buffer
  call append(0, sortedLines)
endfunction

function! CompareBySecondElement(line1, line2)
  " Extract the second elements from each line
  let secondElem1 = matchstr(a:line1, '"\zs[^"]\+\ze",')
  let secondElem2 = matchstr(a:line2, '"\zs[^"]\+\ze",')
  
  " Convert to numbers for numerical comparison
  let num1 = str2nr(secondElem1)
  let num2 = str2nr(secondElem2)
  
  " Perform the comparison
  return num1 - num2
endfunction
