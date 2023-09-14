const express = require("express");
const router = express.Router();
const {metas, atualizar, atualizarPost} = require('../controllers/metas');
const multer = require('multer')

const storageMetasFile = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'storage/metas')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + 'xlsx')
    }
  })

const upload = multer({ storage: storageMetasFile });

router.get("/", metas);
router.get("/atualizar", atualizar);
router.post("/atualizar", upload.single('anexo'), atualizarPost);

module.exports = router;