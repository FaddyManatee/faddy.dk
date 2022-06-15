import csv
import time
import threading

from selenium import webdriver
from selenium.webdriver.common.by import By


def instance(i):
    # Simulate 250 animations to measure gradient-speed relationships
    for x in range(0, 250):
        time.sleep(10)
        gradient = i.find_element(By.ID, "gradient").text
        speed = i.find_element(By.ID, "speed").text

        # Write the data gathered for the current iteration
        rows.append([gradient, speed])
        i.refresh()


# Initialise a list of rows beginning with the .csv header
rows = [["Gradient", "Speed (px/s)"]]

# Using "geckodriver" in PATH variable
browser1 = webdriver.Firefox()
browser2 = webdriver.Firefox()
browser3 = webdriver.Firefox()
browser4 = webdriver.Firefox()

# Port maybe 3000, 3001, or 3002 (used by Microsoft's Live Preview VS Code extension)
browser1.get("http://127.0.0.1:3000/404.html")
browser2.get("http://127.0.0.1:3000/404.html")
browser3.get("http://127.0.0.1:3000/404.html")
browser4.get("http://127.0.0.1:3000/404.html")

# Write data to a .csv file
with open("data.csv", newline="", mode="w") as data:
    writer = csv.writer(data, delimiter=",")

    # Multithreading
    t1 = threading.Thread(target=instance, args=(browser1,))
    t2 = threading.Thread(target=instance, args=(browser2,))
    t3 = threading.Thread(target=instance, args=(browser3,))
    t4 = threading.Thread(target=instance, args=(browser4,))
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t1.join()
    t2.join()
    t3.join()
    t4.join()

    # Write all rows to the .csv file
    writer.writerows(rows)


# Quit the browser instances once all runs are complete
browser1.quit()
browser2.quit()
browser3.quit()
browser4.quit()
