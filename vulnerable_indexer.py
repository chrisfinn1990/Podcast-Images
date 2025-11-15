
import os
import json

# This is a placeholder for a real indexing function.
# The vulnerability is in the use of pickle.load(), which is unsafe.
def index_folder(folder_path):
    """
    Scans a folder and loads any found ".index" files.
    This function is vulnerable to Remote Code Execution because it uses
    pickle.load() on untrusted data.
    """
    print(f"[*] Scanning folder: {folder_path}")
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".index"):
                index_file_path = os.path.join(root, file)
                print(f"[*] Found index file, loading: {index_file_path}")
                with open(index_file_path, "r") as f:
                    # FIX: Switched to json.load(), which is safe for untrusted data.
                    data = json.load(f)
                    print("[+] Successfully loaded data.")
                    # In a real app, we might do something with 'data' here.
                    return data
    return None
