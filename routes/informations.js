const express = require("express");
const router = express.Router();
const{branches, newBranch, newBranchPost} = require("../controllers/informations/branch.js")
const{departments, newDepartment, newDepartmentPost} = require("../controllers/informations/departments.js")
const{warehouse, newWarehouse} = require("../controllers/informations/warehouse.js")

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
router.get("/newwarehouse", newWarehouse);
router.post("/newwarehouse", newWarehouse);


module.exports = router;