#!/usr/bin/env bash

# Find files and unzip each of them into a separate file

# **********************************
# https://github.com/vpnry/ptsped
# on Termux must run with 
# bash thisfile.sh
# Don't run with sh thisfile.sh
# **********************************


echo ''
echo "Unzipping stardict files"

INPUT=./pts_css_stardict_zip
OUTPUT=./pts_css_stardict
mkdir -p "$OUTPUT"
find "$INPUT" -type 'f' -name "*.zip" | while read fullpath; do
    unzip "$fullpath" -d "$OUTPUT"
done


echo ''
echo "Unzipping tabfiles"

INPUT=./pts_css_tabfiles_zip
OUTPUT=./pts_css_tabfiles
mkdir -p "$OUTPUT"
find "$INPUT" -type 'f' -name "*.zip" | while read fullpath; do
    unzip "$fullpath" -d "$OUTPUT"
done

echo ''
echo '----------'
echo "Done all!"
