import re
import sys
import os

def split_hex_to_128bit_v2(hex_value):
    """Splits a hexadecimal value into two 128-bit integers as strings."""
    hex_value = hex_value[2:] if hex_value.startswith('0x') else hex_value
    hex_value = hex_value.rjust(32, '0')
    first_half, second_half = hex_value[:16], hex_value[16:]
    return str(int(first_half, 16)), str(int(second_half, 16))

def process_file(input_file_path, proofs_dir, output_dir):
    # Extract the subdirectory name from the input file path
    input_subdir = os.path.basename(os.path.dirname(input_file_path))

    # Regex pattern to include the special case
    regex_pattern = r"mstore\((?:add\(_vk, .*\)|_omegaInverseLoc), (0x[0-9A-Fa-f]*|[0-9]+)\)"

    # Check if the input file exists
    if not os.path.isfile(input_file_path):
        print(f"Input file not found: {input_file_path}")
        return

    # Process the 'plonk_vk.sol' file
    with open(input_file_path, 'r') as file:
        lines = file.readlines()

    lines_to_process = lines[12:69]  # Process only lines 13 to 69

    matches = [re.findall(regex_pattern, line) for line in lines_to_process]
    flat_matches = [match for sublist in matches for match in sublist]
    flat_split_values = [value for match in flat_matches for value in split_hex_to_128bit_v2(match)]


    # Write the output to "Prover.toml" in the specified directory
    output_file_path = os.path.join(output_dir, "Prover.toml")
    with open(output_file_path, 'a') as output_file:
        output_file.write("verification_key_" + input_subdir + " = " + str(flat_split_values) + '\n')


    # Define the proofs file path
    proofs_file_path = os.path.join(proofs_dir, input_subdir + ".proof")
    
    # Check if the proofs file exists
    if not os.path.isfile(proofs_file_path):
        print(f"Proofs file not found: {proofs_file_path}")
        return
    
    # Process the proofs file
    with open(proofs_file_path, 'r') as file:
        proofs_lines = file.read().strip()

    # Split the hexadecimal string into 16-byte chunks
    proof_fields = [proofs_lines[i:i+32] for i in range(0, len(proofs_lines), 32)]
    # Convert each chunk to a decimal number
    proof_fields = [int(chunk, 16) for chunk in proof_fields]

    with open(output_file_path, 'a') as output_file:
        output_file.write("proofs_" + input_subdir + " = " + str(proof_fields) + '\n')



def main():
    if len(sys.argv) != 4:
        print("Usage: python script.py <input_file_path> <proofs_directory> <output_directory>")
        sys.exit(1)
    
    input_file_path = sys.argv[1]
    proofs_dir = sys.argv[2]
    output_dir = sys.argv[3]

    process_file(input_file_path, proofs_dir, output_dir)

if __name__ == "__main__":
    main()
