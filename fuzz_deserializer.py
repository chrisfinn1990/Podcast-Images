"""
Fuzz Tester for the Vulnerable Deserializer.

This script tests the robustness and security of the deserialization functions
in 'vulnerable_deserializer.py' by feeding them a variety of malicious and
malformed YAML payloads.
"""
import yaml
from vulnerable_deserializer import vulnerable_load, safe_load

# --- Fuzzing Payloads ---
# A list of different YAML strings, from benign to malicious.
fuzz_payloads = {
    "rce_attack": '''
!!python/object/apply:os.system
- "echo RCE ATTACK SUCCESSFUL"
''',
    "empty_string": "",
    "simple_string": "just a string",
    "malformed_yaml": "key: value: another_value",
    "complex_object": '''
!!python/object/apply:__main__.MyClass
args: [1, 2]
''',
    "large_string": "A" * 5000,
}

if __name__ == "__main__":
    print("--- Starting Deserializer Fuzz Test ---")
    
    class MyClass:
        def __init__(self, *args):
            pass

    for name, payload in fuzz_payloads.items():
        print(f"\n--- Testing Payload: {name} ---")
        
        print("  [->] Testing vulnerable_load()...")
        try:
            result = vulnerable_load(payload)
            
            # For the os.system payload, a return code of 0 means success.
            if name == "rce_attack" and result == 0:
                print("  [!] VULNERABILITY CONFIRMED: RCE command executed successfully.")
            else:
                print("  [+] Payload processed without RCE.")

        except Exception as e:
            print(f"  [+] Handled as an error (as expected for malformed data): {type(e).__name__}")

        print("  [->] Testing safe_load()...")
        try:
            safe_load(payload)
            print("  [+] Payload processed safely.")
        except Exception as e:
            print(f"  [+] SAFE function correctly raised an error: {type(e).__name__}")

    print("\n--- Deserializer Fuzz Test Complete ---")
