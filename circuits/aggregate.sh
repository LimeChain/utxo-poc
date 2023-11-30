#!/bin/bash

# Define the Python script path
PYTHON_SCRIPT="script.py"

# Define the base directory for the input files
BASE_INPUT_DIR="contract"

# Define the output directory
OUTPUT_DIR="crates/aggregator"

# Array of input file subdirectories
INPUT_SUBDIRS=("utxo_signature" "utxo_ownership" "utxo_inputs" "utxo_outputs" "low_nullifier")

PROOFS_DIRECTORY="proofs"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Empty the output file
> "$OUTPUT_DIR/Prover.toml"

# Loop through each input subdirectory and process the corresponding file
for SUBDIR in "${INPUT_SUBDIRS[@]}"; do
    INPUT_FILE_PATH="$BASE_INPUT_DIR/$SUBDIR/plonk_vk.sol"
    
    # Check if the input file exists
    if [ ! -f "$INPUT_FILE_PATH" ]; then
        echo "Input file not found: $INPUT_FILE_PATH"
        continue
    fi

    # Run the Python script with the current input file and append to the output file
    # Pass the two additional command-line arguments to the Python script
    python "$PYTHON_SCRIPT" "$INPUT_FILE_PATH" "$PROOFS_DIRECTORY" "$OUTPUT_DIR"
done

echo "public_inputs_utxo_inputs = []" >> "$OUTPUT_DIR/Prover.toml"
echo "public_inputs_utxo_ownership = []" >>"$OUTPUT_DIR/Prover.toml"
echo "public_inputs_utxo_signature = []" >> "$OUTPUT_DIR/Prover.toml"
echo "public_inputs_low_nullifier = [$1]" >> "$OUTPUT_DIR/Prover.toml"
echo "public_inputs_utxo_outputs = [$2]" >> "$OUTPUT_DIR/Prover.toml"

echo "Processing complete. Output saved in $OUTPUT_DIR/Prover.toml"
