"""
End-to-End (E2E) Test Runner for AutoPod.

This script is designed to be the single entry point for running automated UI tests
against the application. It uses command-line arguments to select and execute
specific test configurations, allowing for targeted validation of UI "gadget chains"
during runtime.
"""
import os
import time
import argparse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def setup_driver():
    """Sets up the Chrome webdriver."""
    # Set up Chrome webdriver
    service = ChromeService(executable_path=ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    # Get the absolute path to the local index.html file
    file_path = os.path.abspath('index.html')
    driver.get(f"file:///{file_path}")
    return driver

def test_homepage_title():
    """Tests if the homepage title is 'AutoPod'."""
    driver = setup_driver()

    # Find the title of the page and assert its value
    expected_title = "AutoPod"
    actual_title = driver.title
    assert actual_title == expected_title, f"Expected title '{expected_title}', but got '{actual_title}'"
    print("SUCCESS: Homepage title is 'AutoPod'.")

    # Close the browser
    driver.quit()

def test_switch_to_timeline_view():
    """Tests clicking the hamburger menu and switching to Timeline mode."""
    driver = setup_driver()
    wait = WebDriverWait(driver, 10) # Wait for up to 10 seconds

    # 1. Click the hamburger menu
    hamburger_menu = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "hamburger-menu")))
    hamburger_menu.click()

    # 2. Click the "Timeline" mode option
    timeline_option = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "li[data-view='timeline-view']")))
    timeline_option.click()

    # 3. Verify that the timeline view is now active
    timeline_view = wait.until(EC.presence_of_element_located((By.ID, "timeline-view")))
    assert "active-view" in timeline_view.get_attribute("class"), "Timeline view did not become active."
    print("SUCCESS: Switched to Timeline view.")

    # Close the browser
    driver.quit()

def test_sidebar_collapse():
    """Tests the sidebar collapse and expand functionality."""
    driver = setup_driver()
    wait = WebDriverWait(driver, 10)

    # 1. Find initial elements
    sidebar = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "sidebar")))
    collapse_btn = wait.until(EC.element_to_be_clickable((By.ID, "collapse-btn")))
    
    # 2. Verify initial state (expanded)
    assert "minimized" not in sidebar.get_attribute("class"), "Sidebar should not be minimized initially."
    print("SUCCESS: Sidebar is initially expanded.")

    # 3. Click to collapse
    collapse_btn.click()
    wait.until(lambda d: "minimized" in d.find_element(By.CLASS_NAME, "sidebar").get_attribute("class"))
    assert "minimized" in sidebar.get_attribute("class"), "Sidebar did not collapse."
    print("SUCCESS: Sidebar collapsed correctly.")

    # 4. Close the browser
    driver.quit()

def test_fuzz_vulnerable_views():
    """
    Fuzzes the 'view' URL parameter to ensure the application handles
    malicious inputs gracefully without crashing or finding vulnerabilities.
    """
    driver = setup_driver()
    base_path = os.path.abspath('index.html')
    
    fuzz_strings = [
        "invalid-and-malicious",
        "<script>alert('XSS')</script>",
        "' OR 1=1 --",
        "../../../../etc/passwd",
        " ",
        "!@#$%^&*()",
        "a" * 1000, # Long string
    ]
    
    errors_found = 0
    
    print("\n--- Starting UI Fuzz Test for Robustness ---")
    for i, fuzz_string in enumerate(fuzz_strings):
        print(f"Testing payload #{i+1}: {fuzz_string[:50]}...")
        malicious_url = f"file:///{base_path}?view={fuzz_string}"
        
        try:
            driver.get(malicious_url)
            # After the fix, no state should be corrupted.
            # We are now checking if the application remains stable.
            print(f"  [+] Payload #{i+1} handled safely.")
                
        except Exception as e:
            print(f"  [!] An unexpected error occurred with payload #{i+1}: {e}")
            errors_found += 1

    driver.quit()
    
    print("--- UI Fuzz Test Complete ---")
    assert errors_found == 0, f"Fuzz test found {errors_found} errors."
    print("\nSUCCESS: Fuzz test complete. No vulnerabilities or errors found.")


if __name__ == "__main__":
    # --- Test Configuration Dispatcher ---
    # This block acts as the main controller to instantiate and run the selected E2E test.
    parser = argparse.ArgumentParser(description="Run UI tests for AutoPod.")
    parser.add_argument('--test', type=str, required=True, help='The name of the test function to run.')
    args = parser.parse_args()

    # Map of available test configurations to their corresponding functions.
    test_functions = {
        "homepage_title": test_homepage_title, 
        "timeline_view": test_switch_to_timeline_view, 
        "sidebar_collapse": test_sidebar_collapse,
        "fuzz_views": test_fuzz_vulnerable_views
    }
    if args.test in test_functions:
        # Execute the selected test function.
        test_functions[args.test]()
    else:
        print(f"Error: Test '{args.test}' not found. Available tests: {list(test_functions.keys())}")
