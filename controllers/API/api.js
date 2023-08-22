const PlastMeta = require("../../models/plastpack/plastmeta.js")

const plastMetaConsultar = async(req, res)=>{
    res.send(await PlastMeta.find({}))
}

module.exports = {
    plastMetaConsultar
}