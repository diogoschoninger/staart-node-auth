import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";

const validationsToCause = (validations) =>
  validations.map(({ message, context: { label } }) => ({
    message,
    field: label,
  }));

const responseMappers = {
  [NotFoundError.name]: (error) => ({
    status: 404,
    body: {
      statusCode: 404,
      error: NotFoundError.name,
      message: error.message,
      cause: [],
    },
  }),

  [ValidationError.name]: (error) => ({
    status: 400,
    body: {
      statusCode: 400,
      error: ValidationError.name,
      message: error.message,
      cause: validationsToCause(error.validations ?? []),
    },
  }),

  [ConflictError.name]: (error) => ({
    status: 409,
    body: {
      statusCode: 409,
      error: ConflictError.name,
      message: error.message,
      cause: [],
    },
  }),

  [AuthenticationError.name]: (error) => ({
    status: 401,
    body: {
      statusCode: 401,
      error: AuthenticationError.name,
      message: error.message,
      cause: error.cause,
    },
  }),

  default: (error) => ({
    status: 500,
    body: {
      statusCode: 500,
      error: error.name ?? "UnexpectedError",
      message: error.message,
      cause: [],
    },
  }),
};

const errorHandler = () => (error, _req, res, _next) => {
  console.error(error);

  const mapper = responseMappers[error.name] ?? responseMappers.default;
  const { status, body } = mapper(error);

  res.status(status).send(body);
};

export default errorHandler;
