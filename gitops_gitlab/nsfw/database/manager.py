from sqlite3 import Connection, connect


def connector(db_path: str) -> Connection:
    try:
        connection: Connection = connect(db_path)
        return connection
    except:
        raise Exception("Can't find database")


def read_query(q: str, db_path: str):
    connection = connector(db_path)
    try:
        curser_obj = connection.cursor()
        res = curser_obj.execute(q)
        return res.fetchall()
    except:
        raise Exception("can't read data")
    finally:
        connection.close()


def insert_query(q: str, data, db_path: str):
    connection = connector(db_path)
    try:
        curser_obj = connection.cursor()
        curser_obj.execute(q, data)
        connection.commit()
    except:
        raise Exception("can't insert data")

    finally:
        connection.close()
