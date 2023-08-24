#!/bin/bash

# Run this shell script to convert and copy all .js files in DIS source directory to DIS/js/*.js.txt. 

# 親ディレクトリを指定（例：'parent_folder'）
PARENT_DIR="$DIS_APPEND/source"

# 親ディレクトリ内のすべてのディレクトリをループ
for dir in "$PARENT_DIR"/*/; do
  # 各ディレクトリ内の.jsファイルを一つ上の階層にコピー
  for file in "$dir"*.js; do
		base_name=$(basename "$file")
    cp "$file" "$DIS_WORKSPACE"/js/"$base_name".txt
  done
done

echo "All .js files in source directory have been copied to DIS/js/."
