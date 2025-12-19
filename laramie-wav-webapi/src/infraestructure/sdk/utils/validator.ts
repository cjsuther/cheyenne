import validator from "validator";


//validaciones de formato

export function isEmpty(value) {
  return (isNull(value) || value.length === 0);
}

export function isNull(value) {
  return (value === null || value === undefined);
}

export function isValidArray(value, validNotEmpty = false) {
  return (
    (!isNull(value) && Array.isArray(value)) &&
    (!validNotEmpty || value.length > 0)
  );
}

export function isValidBoolean(value) {
  return (
    (!isNull(value) && typeof value === 'boolean')
  );
}

export function isValidString(value, validNotEmpty = false) {
  return (
    (!isNull(value) && !isNull(value.length)) &&
    (!validNotEmpty || value.length > 0)
  );
}

export function isValidNumber(value, validPositive = false) {
  return (
    (!isNull(value) && validator.isNumeric(value)) &&
    (!validPositive || value > 0)
  );
}

export function isValidInteger(value, validPositive = false) {
  return (
    (!isNull(value) && Number.isInteger(value)) &&
    (!validPositive || value > 0)
  );
}

export function isValidKey(value, NotNull = false) {
  return (!NotNull && (isNull(value) || value === 0) || !isNull(value) && Number.isInteger(value));
}

export function isValidFloat(value, validPositive = false) {
  return (
    (!isNull(value) && !isNaN(value)) &&
    (!validPositive || value > 0)
  );
}

export function isValidDate(value, NotNull = false) {
  let isValidDate = Date.parse(value);
  return (!NotNull && isNull(value) || !isNull(value) && !isNaN(isValidDate));
}

export function isValidEmail(value) {
  return (!isNull(value) && validator.isEmail(value));
}

export function isValidObject(value) {
  return (!isEmpty(value) && (typeof value === 'function' || typeof value === 'object'));
}

//validaciones de negocio

export function isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
      for (var i = 0; i < allowedOrigin.length; ++i) {
        if (isOriginAllowed(origin, allowedOrigin[i])) {
          return true;
        }
      }
      return false;
    } else if (isString(allowedOrigin)) {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    } else {
      return !!allowedOrigin;
    }
}

function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

