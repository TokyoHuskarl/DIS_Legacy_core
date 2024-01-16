# TPC tools
## ctags.conf
### 日本語
単なるctags用の設定ファイルです  
`def {aaa = 241...}`に対応していないゴミ  
#### How to use
1. ホームディレクトリに突っ込む  
2.cd to your project root dir  
3.コンソールにこれを打つ `ctags --languages=tpc --exclude=.git --options=$HOME/ctags.conf -R`  
4.tagsというファイルにdef系と\_\_fnが抜き出されて保存されます やったね  
### English
A very simple ctag config file for tpc language.  
it doesn't process `def {aaa = 241...}`  
#### How to use
1.Rename it to .ctags and put it to your home dir  
2.cd to your project root dir  
3.run `ctags --languages=tpc --exclude=.git --options=$HOME/.ctags -R`  
4.you get tags file at the directory where you are. yay
