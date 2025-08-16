// Success response helper
export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Error response helper
export const errorResponse = (
  res,
  message = "Error occurred",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Not found response helper
export const notFoundResponse = (res, resourceName = "Resource") => {
  return res.status(404).json({
    success: false,
    message: `${resourceName} not found`,
    timestamp: new Date().toISOString(),
  });
};

// Validation error response helper
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
    timestamp: new Date().toISOString(),
  });
};

// Unauthorized response helper
export const unauthorizedResponse = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

// Forbidden response helper
export const forbiddenResponse = (res, message = "Forbidden") => {
  return res.status(403).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};
