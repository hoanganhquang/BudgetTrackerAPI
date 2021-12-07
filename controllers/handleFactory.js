exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    const data = await Model.find();

    res.status(200).json({
      status: "Success",
      length: data.length,
      data,
    });
  });
};

exports.deleteOne = function (Model) {
  return catchAsync(async (err, req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(err);
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};

exports.updateOne = function (Model) {
  return catchAsync(async (err, req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(err);
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.getOne = function (Model, popOptions) {
  return catchAsync(async (err, req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(err);
    }

    res.status(200).json({
      status: "Success",
      data: {
        doc,
      },
    });
  });
};
