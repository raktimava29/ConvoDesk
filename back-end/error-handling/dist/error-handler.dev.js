"use strict";

var notFound = function notFound(req, res, next) {
  var error = new Error("Not Found - ".concat(req.originalUrl));
  res.status(404);
  next(error);
};

var errorHandler = function errorHandler(err, req, res, next) {
  var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = {
  notFound: notFound,
  errorHandler: errorHandler
};