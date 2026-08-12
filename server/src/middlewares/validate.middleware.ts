import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ApiError } from '../utils/ApiError';

export const validate =
  (schema: ObjectSchema, property: 'body' | 'query' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(ApiError.badRequest('Validation failed', details));
    }

    req[property] = value;
    next();
  };


// import { Request, Response, NextFunction } from 'express';
// import { ObjectSchema } from 'joi';
// import { ApiError } from '../utils/ApiError';

// export const validate =
//   (schema: ObjectSchema) => (req: Request, _res: Response, next: NextFunction) => {
//     const { error, value } = schema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     if (error) {
//       const details = error.details.map((d) => d.message);
//       return next(ApiError.badRequest('Validation failed', details));
//     }

//     req.body = value;
//     next();
//   };