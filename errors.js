exports.handleBadRequest = (err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg });
    next();
  };