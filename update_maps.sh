#!/bin/bash

# Source directory to copy
source_dir="./source/Maps"
# Destination directory where you want to copy
destination_dir="../"

LetscopyStuff () {
	# Check if the source directory exists
	if [ -d "$source_dir" ]; then
		# Create the destination directory if it doesn't exist
		mkdir -p "$destination_dir"
		echo "$destination_dir"

		# Copy the contents of the source directory to the destination directory
		cp "$source_dir" "$destination_dir" -r 
		# echo "$source_dir" "$destination_dir"

		echo "Directory copied successfully."
	else
		echo "Source directory does not exist."
	fi
}

echo "Copy Modules"
LetscopyStuff

# add .txt
DEST_DIR_MOD="../Maps"
find "$DEST_DIR_MOD" -type f \( -name "*.js" -o -name "*.json" \) | while read -r file; do
    # 拡張子を .txt に変更
    mv "$file" "$file.txt"
		#echo "$file" "$file.txt"
done
echo "file copy done."
