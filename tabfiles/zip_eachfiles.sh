# Find files and zip each of them into a separate zip file


INPUT=./

find "$INPUT" -name "*2021" | while read fullpath; do
    echo "Processing file: $fullpath"
    name_ext=$(basename -- "$fullpath")
    echo "$name_ext"
    # nameonly="${name_ext%.*}"
    # echo "$nameonly"
    zip "$name_ext.zip" "$fullpath"
done


