import express from "express";
import connection from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const query = "SELECT * from admin where email=? and password=?";
  connection.query(
    query,
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const email = result[0].email;
        const token = jwt.sign(
          { role: "admin", email: email, id: result[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({
          loginStatus: false,
          Error: "Wrong email or password",
        });
      }
    }
  );
});

router.post("/add_category", (req, res) => {
  const query = "INSERT INTO category (`name`) VALUES (?)";
  connection.query(query, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.get("/category", (req, res) => {
  const query = "SELECT * from category";
  connection.query(query, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee", (req, res) => {
  const query = "SELECT * from employee";
  connection.query(query, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * from employee WHERE id= ?";
  connection.query(query, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

/* image upload */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

router.post("/add_employee", upload.single("image"), (req, res) => {
  console.log("form data", req.body);
  const sql = `INSERT INTO employee 
  (name,email,password, address, salary,image, category_id) 
  VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hash Error" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];
    connection.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  });
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE employee set name= ?,email= ?,salary= ?,address= ?,category_id= ? WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
  ];
  connection.query(query, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE from employee WHERE id= ?";
  connection.query(query, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(id) as admin from admin";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee_count", (req, res) => {
  const sql = "SELECT COUNT(id) as employee from employee";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", (req, res) => {
  const sql = "SELECT sum(salary) as salary from employee";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", (req, res) => {
  const sql = "select * from admin";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as adminRouter };
