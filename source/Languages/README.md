# DIS Language System
  
## Rule
First of all, <span style="color: red; ">**DO NOT USE *,* COMMA IN DIS CSV FILE.**  </span>
  
Fileformat is strictly limited to utf-8.  
`{}<>$|,^&\` - These characters are reserved in DIS system so you shouldn't use casually.  
`^` means LF in DIS.  
`$;` will be replaced with `,` in the game.
`\v[n]` `\t[n]` will work as corresponding RM variable in the game (Exactly the same as RPGMaker default message system)  
### Color Tag System
- `\c[n]` changes colour of all words after that token.  
  This format is exactly the same as RPGMaker default. 
- Altanatively, you can use DIS original color tag system.  
  These tags will be automatically replaced with corresponding string.  
```
<white> -> "\c[0]"
<yellow> -> "\c[14]"
<ltgreen> -> "\c[1]"
<green> -> "\c[2]"
<ltred> -> "\c[5]"
<red> -> "\c[17]"
<purple> -> "\c[16]"
<ltpurple> -> "\c[7]"
<ltblue> -> "\c[10]"
<blue> -> "\c[11]"
<glay> -> "\c[4]"

<HP> -> "\c[12]HP\c[0]"
<AD> -> "\c[17]AD\c[0]"
<AP> -> "\c[16]AP\c[0]"
<AR> -> "\c[4]AR\c[0]"
<MR> -> "\c[16]MR\c[0]"
<HIT> -> "\c[5]HIT\c[0]"
<EVA> -> "\c[4]EVA\c[0]"
<WILL> -> "\c[0]WILL\c[0]"
<MS> -> "\c[10]MS\c[0]"
```


### Attention
Language system of DIS will be slightly changed in very near future, with development of language manager written in java script.  
