import os
import time
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

if __name__ == "__main__":
    test_homepage_title()
    test_switch_to_timeline_view()
