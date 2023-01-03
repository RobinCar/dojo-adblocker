#!/bin/bash
input_file='hostsToBlock.csv'
output_file_name='ruleset'
output_file_index=1
output_file_extension='.json'

echo "Starting formating script"
echo "-------------------------"

line_number=1
output_files_content=()

while read line; do
    if [ $((line_number%30000)) -eq 0 ]; then
        printf '%s\n' "${output_files_content[@]}" | jq -s '.' >> $output_file_name$output_file_index$output_file_extension
        output_files_content=()
        output_file_index=$((output_file_index+1))
    fi
    JSON_FMT='{"id": %s, "action": { "type": "block" }, "condition": { "urlFilter": "||%s^", "isUrlFilterCaseSensitive": false }}'
    JSON_STRING=$(printf "$JSON_FMT" "$line_number" "$line")
    output_files_content+=("$JSON_STRING")
    line_number=$((line_number+1))
done < $input_file



printf '%s\n' "${output_files_content[@]}" | jq -s '.' >> $output_file_name$output_file_index$output_file_extension