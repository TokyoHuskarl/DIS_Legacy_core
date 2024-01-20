
#!/bin/bash

# /source/js/ 以下のディレクトリ構造を保ったまま $DIS_WORKSPACE にコピーし、
# コピーした全ての .js と .json ファイルに .txt 拡張子を追加するスクリプト

# ソースディレクトリ（例：'/source/js'）
SOURCE_DIR="$DIS_APPEND/source/js"

# コピー先のワークスペースディレクトリ
DEST_DIR="$DIS_WORKSPACE/Scripts"

# $DIS_WORKSPACE/Scripts/以下のjsonとjsを一度全部消す
# ソースディレクトリ内の全ファイルを再帰的に処理
find "$DEST_DIR" -type f \( -name "*.js.txt" -o -name "*.json.txt" \) | while read -r file; do
    # コピー先のパスを生成（ディレクトリ構造を保持）
    dest_path="$DEST_DIR/${file#$SOURCE_DIR/}"
    dest_dir=$(dirname "$dest_path")

    # ファイルをコピーし、拡張子を .txt に変更
    rm "$file"
done
echo "old files under /Scripts/ removed."

# ソースディレクトリ内の全ファイルを再帰的に処理
find "$SOURCE_DIR" -type f \( -name "*.js" -o -name "*.json" \) | while read -r file; do
    # コピー先のパスを生成（ディレクトリ構造を保持）
    dest_path="$DEST_DIR/${file#$SOURCE_DIR/}"
    dest_dir=$(dirname "$dest_path")

    # 必要に応じてディレクトリを作成
    mkdir -p "$dest_dir"

    # ファイルをコピーし、拡張子を .txt に変更
    cp "$file" "${dest_path}.txt"
done

echo "All .js and .json files in $SOURCE_DIR have been copied to $DEST_DIR with .txt extension."
echo ""
echo | ls "$DIS_WORKSPACE/Scripts"

