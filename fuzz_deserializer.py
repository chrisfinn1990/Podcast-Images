"""
Fuzz Tester for the Patched Deserializer.

This script verifies that the fix in 'vulnerable_deserializer.py'
successfully prevents Remote Code Execution (RCE) attacks.
"""
import yaml
from vulnerable_deserializer import vulnerable_load

# --- Fuzzing Payloads ---
# The RCE attack payload is the most critical one to test.
fuzz_payloads = {
    "rce_attack": '''
!!python/object/apply:os.system
- "echo RCE ATTACK SUCCESSFUL > rce_proof.txt"
''',
    "empty_string": "",
    "simple_string": "just a string",
    "malformed_yaml": "key: value: another_value",
}

def _test_payload(name, payload, failures):
    """Test a single payload and handle the results."""
    print(f"\n--- Testing Payload: {name} ---")
    
    try:
        print("  [->] Testing the (now fixed) vulnerable_load() function...")
        vulnerable_load(payload)
        
        if name == "rce_attack":
            failures.append(f"Payload '{name}': RCE payload was processed but should have been rejected.")
            print("  [!] VULNERABILITY DETECTED: Malicious payload was not blocked.")
        else:
            print("  [+] Benign payload processed safely.")

    except yaml.YAMLError:
        if name == "rce_attack":
            print("  [+] FIX CONFIRMED: The safe function correctly rejected the RCE payload.")
        else:
            print("  [+] Correctly handled malformed YAML.")
    except Exception as e:
        error_message = f"Payload '{name}': An unexpected error occurred: {type(e).__name__}"
        failures.append(error_message)
        print(f"  [!] {error_message}")

def run_fuzz_test():
    """
    Tests the patched deserializer. The test passes if the previously
    vulnerable function now safely handles malicious payloads.
    """
    print("--- Starting Patched Deserializer Fuzz Test ---")
    
    failures = []

    for name, payload in fuzz_payloads.items():
        _test_payload(name, payload, failures)

    print("\n--- Deserializer Fuzz Test Complete ---")

    if failures:
        print("\n[FAILURE] The following issues were found:")
        for f in failures:
            print(f"  - {f}")
        return False
    else:
        print("\n[SUCCESS] All tests passed. The deserializer is secure.")
        return True

if __name__ == "__main__":
    try:
        run_fuzz_test()
    except Exception as e:
        print("\n[ERROR] An unexpected error occurred during the fuzz testing process.")
        print(f"  Details: {e}")