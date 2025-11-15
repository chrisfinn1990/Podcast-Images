import os
import pickle
import shutil
import json
from vulnerable_indexer import index_folder

# A malicious class that executes a command upon deserialization
class RCE:
    def __reduce__(self):
        # This command should NOT be executed by the fixed function
        command = 'echo "RCE Successful" > rce_proof.txt'
        return (os.system, (command,))

def test_indexer_vulnerability_fix():
    """
    Tests that the RCE vulnerability in 'index_folder' has been fixed.
    The test passes if the safe 'json.load' function correctly fails
    to parse the malicious pickle data.
    """
    print("--- Starting Indexer Vulnerability Fix Verification ---")
    
    test_dir = "temp_index_data"
    proof_file = "rce_proof.txt"
    
    # Ensure a clean state before the test
    if os.path.exists(proof_file):
        os.remove(proof_file)
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
    
    os.makedirs(test_dir)
    print(f"[*] Created temporary directory: {test_dir}")

    try:
        # Create the malicious pickle file
        malicious_file_path = os.path.join(test_dir, "malicious.index")
        with open(malicious_file_path, "wb") as f:
            pickle.dump(RCE(), f)
        print(f"[*] Created malicious index file: {malicious_file_path}")

        print("\n[*] --- Calling the now-fixed function ---")
        
        test_passed = False
        try:
            index_folder(test_dir)
            print("[!] The function did not raise an error as expected.")
        except json.JSONDecodeError:
            print("[+] Correctly received a JSONDecodeError. The malicious payload was rejected.")
            test_passed = True
        except Exception as e:
            print(f"[!] An unexpected error occurred: {e}")
        
        print("[*] --- Function call finished ---\n")

        # Verify that NO code execution occurred
        if test_passed and not os.path.exists(proof_file):
            print("[SUCCESS] FIX CONFIRMED: The RCE vulnerability is closed.")
            return True
        else:
            print("[FAILURE] FIX FAILED: The vulnerability may still exist or the test is flawed.")
            return False

    finally:
        # Final cleanup
        print("[*] Cleaning up temporary files and directories.")
        if os.path.exists(proof_file):
            os.remove(proof_file)
        if os.path.exists(test_dir):
            shutil.rmtree(test_dir)

if __name__ == "__main__":
    try:
        test_indexer_vulnerability_fix()
    except Exception as e:
        print("\n[ERROR] An unexpected error occurred during the test process.")
        print(f"  Details: {e}")

