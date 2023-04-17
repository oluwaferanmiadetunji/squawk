import Joi from 'joi'
import httpStatus from 'http-status'
import pick from '../utils/pick.utils'
import ApiError from './ApiError.middleware'
import { Request, Response, NextFunction } from 'express'
import { transformJoiErrorMessage } from '../utils/helpers.utils'

const validate = (schema: any) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])
  const object = pick(req, Object.keys(validSchema))
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object)

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ')

    return next(
      new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        transformJoiErrorMessage(errorMessage),
      ),
    )
  }
  Object.assign(req, value)
  return next()
}

export default validate
