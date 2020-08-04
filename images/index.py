#! C:/Users/arun sharma/AppData/Local/Programs/Python/Python38/python.exe

import cgi;
import cgitb;cgitb.enable()
import mysql.connector
import json
import datetime
import os

print("Content-Type: text/html\n\n")
print("<link rel=stylesheet href=style.css></link>")
def show_images():
    arr = os.listdir()
    print("<h1 style='text-align:center'>Images</h1>")
    print("<div class=parent>")
    for file in arr:
        if(file.endswith("py")==False or file.endswith("css")==False):
            print("<img src='{}' /><br/>".format(file))
    
    print("</div>")

show_images()