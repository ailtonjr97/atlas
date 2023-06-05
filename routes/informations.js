const express = require("express");
const router = express.Router();
const{branches, newBranch, newBranchPost} = require("../controllers/branch.js")
const{departments, newDepartment, newDepartmentPost} = require("../controllers/departments.js")
const{warehouse} = require("../controllers/warehouse.js")

//Branches visualization and CRUD operations
router.get("/branches", branches);
router.get("/newbranch", newBranch);
router.post("/newbranch", newBranchPost);

//Departments visualization and CRUD operations
router.get("/departments", departments);
router.get("/newdepartment", newDepartment);
router.post("/newdepartment", newDepartmentPost);

//Warehouse CRUD
router.get("/warehouse", warehouse);


module.exports = router;