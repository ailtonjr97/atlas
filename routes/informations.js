const express = require("express");
const router = express.Router();
const{branches, newBranch, newBranchPost} = require("../controllers/branch.js")
const{departments, newDepartment, newDepartmentPost} = require("../controllers/departments.js")

//Branches visualization and CRUD operations
router.get("/branches", branches);
router.get("/newbranch", newBranch);
router.post("/newbranch", newBranchPost);

//Departments visualization and CRUD operations
router.get("/departments", departments);
router.get("/newdepartment", newDepartment);
router.post("/newdepartment", newDepartmentPost);


module.exports = router;