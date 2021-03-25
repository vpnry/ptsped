# Find files and unzip each of them into a separate file

INPUT=./

find "$INPUT" -name "*.zip" | while read fullpath; do
    echo "Processing file: $fullpath"
    name_ext=$(basename -- "$fullpath")
    echo "$name_ext"
    nameonly="${name_ext%.*}"
    echo "$nameonly"
    unzip "$name_ext"
done
