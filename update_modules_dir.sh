#!/bin/bash

# Source directory to copy
source_dir="./source/Modules"
# Destination directory where you want to copy
destination_dir="../"

LetscopyStuff () {
	# Check if the source directory exists
	if [ -d "$source_dir" ]; then
		# Create the destination directory if it doesn't exist
		mkdir -p "$destination_dir"

		# Copy the contents of the source directory to the destination directory
		cp "$source_dir" "$destination_dir" -r 

		echo "Directory copied successfully."
	else
		echo "Source directory does not exist."
	fi
}

echo "Copy Modules"
LetscopyStuff

# then try Languages 
source_dir="./source/Languages"
echo "Copy Langs"

LetscopyStuff


