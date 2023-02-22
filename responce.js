module.exports = {
  SUCCESS: function (res, message, body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },
  ERROR: function (res, message, body = {}) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: body,
    });
  },
  UNAUTHORIZED: function (res, message, body = {}) {
    return res.status(400).json({
      success: false,
      code: 404,
      message: message,
      body: body,
    });
  },
};
