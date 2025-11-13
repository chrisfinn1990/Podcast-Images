import yaml
import os

# WARNING: This script is for educational purposes to demonstrate a vulnerability.
# The use of yaml.load() on untrusted data is extremely dangerous.

def vulnerable_load(data_stream):
    """
    This function simulates a vulnerable service that deserializes data using
    the unsafe yaml.load() function. It returns the deserialized data.
    """
    return yaml.load(data_stream, Loader=yaml.UnsafeLoader)

def safe_load(data_stream):
    """
    This function simulates a secure service that deserializes data using
    the safe yaml.safe_load() function. It returns the deserialized data.
    """
    return yaml.safe_load(data_stream)

if __name__ == "__main__":
    print("--- Demonstrating Insecure Deserialization RCE Vulnerability ---")

    # This is a malicious YAML payload.
    # It's crafted to make Python's `os.system` function execute a command.
    # In this case, it runs the 'echo' command to prove code execution.
    malicious_payload = """
!!python/object/apply:os.system
- 'echo RCE ATTACK SUCCESSFUL: The vulnerable function executed a system command!'
"""
    print("\n[->] Calling VULNERABLE function: vulnerable_load()")
    # The next line will execute the command embedded in the payload.
    vulnerable_load(malicious_payload)

    print("\n[->] Calling SAFE function: safe_load()")
    try:
        safe_load(malicious_payload)
    except Exception as e:
        print(f"[+] SAFE function correctly caught the dangerous payload: {e}")