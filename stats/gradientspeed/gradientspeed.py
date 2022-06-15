import csv
import time

from selenium import webdriver
from selenium.webdriver.common.by import By


# Using "geckodriver" in PATH variable
browser = webdriver.Firefox()

# Port maybe 3000, 3001, or 3002 (used by Microsoft's Live Preview VS Code extension)
browser.get("http://127.0.0.1:3000/404.html")

# Write data to a .csv file
with open("data.csv", newline="", mode="w") as data:
    writer = csv.writer(data, delimiter=",")

    # Write the .csv header
    writer.writerow(["Gradient", "Speed (px/s)"])

    # Simulate 1000 animations to measure gradient-speed relationships
    for x in range(0, 1000):
        time.sleep(10)
        gradient = browser.find_element(By.ID, "gradient").text
        speed = browser.find_element(By.ID, "speed").text

        # Write the data gathered for the current iteration
        writer.writerow([gradient, speed])
        browser.refresh()

# Quit the browser instance once all runs are complete
browser.quit()
