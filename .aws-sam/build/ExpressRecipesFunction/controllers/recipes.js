exports.index = (req, res) => {
    res.send({
        message: 'index'
    })
}

exports.store = (req, res) => {
    console.log(req.body)
    item = req.body
    res.send({
        item: item
    })
}

exports.show = (req, res) => {
    res.send({
        message: `show id: ${req.params.id}`
    })
}

exports.update = (req, res) => {
    console.log(req.body)
    item = req.body
    id = req.params.id
    res.send({
        message: 'update'
    })
}

exports.destroy = (req, res) => {
    id = req.params.id
    res.send({
        message: 'destroy'
    })
}
