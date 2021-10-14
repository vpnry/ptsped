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
echo "Converting Roman Pali tabfile to other scripts"

node Vethuis_Ro16Scripts.js

echo ''
echo 'Tabfiles to stardict'

# ***********************************
# * [1]
# * Use pyglossary to convert tabfile
# * to Stardict (sametypesequence=h)
# ***********************************

TABFILE_DIR=./pts_vethuis_tabfiles
cp PTSPED-2021 "$TABFILE_DIR"

STARDICT_DIR=./pts_vethuis_stardict
mkdir -p "$STARDICT_DIR"

find "$TABFILE_DIR" -type 'f' -name "*" | while read fullpath; do
    echo "Converting file: $fullpath"
    name_with_ext=$(basename -- "$fullpath")
    nameonly="${name_with_ext%%.*}"
    pyglossary "$fullpath" "$STARDICT_DIR/$nameonly.ifo" -v2 --read-format=Tabfile --write-format=Stardict --write-options=sametypesequence=h
    
done


# ***********************************
# * [2]
# * add description in .ifo files
# ***********************************

echo ''
echo ''
echo "adding description to .ifo files"

find "$STARDICT_DIR" -type 'f' -name "*.ifo" | while read fullpath; do
    sed -i 's/description=/description=<p><p>A digital version of The Pali Text Society`s Pāli-English Dictionary - proofread 2021 by Buddhadust.<\/p><p>PTS PED License:<\/p><br><code>Corrected reprint © The Pali Text Society<br><br>Commercial Rights Reserved<br><br>Creative Commons Licence by-nc\/3.0\/<br><\/code><br><p>Credit:<\/p><br><code>Converted to Stardict format from a HTML source file from <a href="http:\/\/buddhadust.net">http:\/\/buddhadust.net<\/a><br><\/code><br><p>This derived work is also <code>following the same PTS PED License<\/code>.<\/p><br>For more info and other pali scripts, check this Git repository <a href="https:\/\/github.com\/vpnry\/ptsped"> https:\/\/github.com\/vpnry\/ptsped<\/a><p>&nbsp;<\/p><br><\/p>/' "$fullpath"
done

echo "Done: adding description"

# ***********************************
# * [3]
# * zip tabfiles for uploading
# ***********************************

echo ''
echo ''
echo "zipping tabfiles for uploading"

TABFILE_DIR=./pts_vethuis_tabfiles
TABFILE_DIR_ZIP=$TABFILE_DIR"_zip"
mkdir -p "$TABFILE_DIR_ZIP"

find "$TABFILE_DIR" -type 'f' -name "*" | while read fullpath; do
    name_with_ext=$(basename -- "$fullpath")
    nameonly="${name_with_ext%%.*}"
    echo "zipping tabfile Tabfile_$nameonly.zip"
    zip -q -j "$TABFILE_DIR_ZIP/Tabfile_$nameonly.zip" "$fullpath"
done



# ***********************************
# * [4]
# * zip stardict files for uploading
# ***********************************

echo ''
echo ''
echo "Zipping stardict files for uploading"

STARDICT_DIR=./pts_vethuis_stardict
STARDICT_DIR_ZIP=$STARDICT_DIR"_zip"
mkdir -p "$STARDICT_DIR_ZIP"

declare -A NAMEARRY
while read fullpath; do
    name_with_ext=$(basename -- "$fullpath")
    nameonly="${name_with_ext%%.*}"
    # Overwrite it
    NAMEARRY[$nameonly]="$nameonly"
done < <(find "$STARDICT_DIR" -type 'f' -name "*")

# don't use  "${!NAMEARRY[*]}", will cause error
for nameo in "${!NAMEARRY[@]}"; do
    files=$(find "$STARDICT_DIR" -type 'f' -name "$nameo*")
    arrayFile=(${files//.\// .\/})
    echo "zipping stardict $nameo.zip"
    zip -q -j $STARDICT_DIR_ZIP/$nameo.zip ${arrayFile[*]}
done


echo ''
echo ''
rm -r "$STARDICT_DIR"
echo "Deleted temp dir $STARDICT_DIR"
rm -r "$TABFILE_DIR"
echo "Deleted temp dir $TABFILE_DIR"

echo ''
echo '----------'
echo "Done all!"
