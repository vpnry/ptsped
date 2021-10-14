#!/usr/bin/bash

# **********************************
# https://github.com/vpnry/ptsped
# on Termux must run with 
# bash STAR_bash_toStardict.sh
# Don't run with sh STAR_bash_toStardict.sh
# **********************************

# ***********************************
# * [0]
# * Convert to other pali scripts
# * from Romain pali
# ***********************************

echo 'Version 1.1'
echo "Converting Roman Pali Novethuis tabfile to other scripts"

node noVethuis_Ro16Scripts.js

echo ''

TABFILE_DIR=./No_vethuis_tabfiles
cp PTSPED-2021-NoVethuis "$TABFILE_DIR"/PTSPED-2021


# ***********************************
# * zip tabfiles for uploading
# ***********************************

echo ''
echo ''
echo "zipping tabfiles for uploading"

TABFILE_DIR=./No_vethuis_tabfiles
TABFILE_DIR_ZIP=$TABFILE_DIR"_zip"
mkdir -p "$TABFILE_DIR_ZIP"

find "$TABFILE_DIR" -type 'f' -name "*" | while read fullpath; do
    name_with_ext=$(basename -- "$fullpath")
    nameonly="${name_with_ext%%.*}"
    echo "zipping tabfile Tabfile_$nameonly.zip"
    zip -q -m -j "$TABFILE_DIR_ZIP/Tabfile_$nameonly.zip" "$fullpath"
done

echo "Done all!"
