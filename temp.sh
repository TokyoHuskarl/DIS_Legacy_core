DEST_DIR_MOD="../Modules"
find "$DEST_DIR_MOD" -type f \( -name "*.js" -o -name "*.json" \) | while read -r file; do
    # 拡張子を .txt に変更
    echo mv "$file" "$file.txt"
done
echo "file copy done."
