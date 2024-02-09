import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employeems",
});

connection.connect((err) => {
  if (err) {
    console.log("connection error");
  } else {
    console.log("connected");
  }
});

export default connection;
