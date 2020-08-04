#! C:/Users/arun sharma/AppData/Local/Programs/Python/Python38/python.exe

import cgi;
import cgitb;cgitb.enable()
import mysql.connector
import json
import datetime
import os

print("Content-Type: text/html\n\n")
def save_data():
    args=cgi.FieldStorage()
    #print(str(args))
    print("list index..."+str(args.getvalue("data")))
    #print("list index..."+str(args.getvalue("chapterIndex")))
    

save_data()