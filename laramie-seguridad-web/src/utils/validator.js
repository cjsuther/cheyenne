import validator from "validator";


//validaciones de formato

export function isNull(value) {
  return (value === null || value === undefined);
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
    (!isNull(value) && validator.isNumeric(value.toString())) &&
    (!validPositive || value > 0)
  );
}

export function isValidInteger(value, validPositive = false) {
  return (
    (!isNull(value) && Number.isInteger(value)) &&
    (!validPositive || value > 0)
  );
}

export function isValidDate(value) {
  return (!isNull(value) && validator.isDate(value.toString()));
}

export function isValidEmail(value) {
  return (!isNull(value) && validator.isEmail(value));
}

export function isValidObject(value) {
  return (!isNull(value) && (typeof value === 'function' || typeof value === 'object'));
}

export function isEmptyString(value) {
  return (!isNull(value) && value === '');
}




export function OnKeyPress_validDecimal(e, target) {
  var code = e.which || e.keyCode;
  const value = target.value;
  if (code === 44 || code === 46) { //coma o punto
      if (value.indexOf(',') >= 0) { //coma solo una vez
          e.preventDefault();
      }
  }
  else if (code < 47 || code > 57) {
      e.preventDefault();
  }
}

export function OnKeyPress_validInteger(e, target) {
  var code = e.which || e.keyCode;
  if (code < 47 || code > 57) {
      e.preventDefault();
  }
}
