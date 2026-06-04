import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="vaseem198519",
        database="farmer_emarket"
    )