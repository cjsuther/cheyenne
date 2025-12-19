import validator from "validator";
import { APPCONFIG } from "../app.config";

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

export function isValidDate(value, NotNull = false) {
  // return (!isNull(value) && validator.isDate(value.toString()));
  let isValidDate = Date.parse(value);
  return ((!NotNull && isNull(value)) || (!isNull(value) && !isNaN(isValidDate)));
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

export function isValidPercent(value) {
  return (value >= 0 && value <= 100);
}

export function validateFormula(formula) {
  const charCode = ["+", "-", "/", "*", ",", "<", ">", "="];
  formula = formula.replace(/\\n/g, "").replace(/\|\|/g, "|");
  if (formula.length > 0) {
    if (formula[0] === '|') formula = formula.substring(1);
    if (formula[formula.length-1] === '|') formula = formula.substring(0, formula.length-1);
  }
  const piecesFormula = formula.split('|');

  let pieces = [];
  for (let i=0; i < piecesFormula.length; i++) {
    const piece = piecesFormula[i];
    if (piece.indexOf("/*") >= 0 || piece.indexOf("*/") >= 0) {
      //es comentario, no hago nada...
    }
    else if (piece.length > 1 && charCode.concat(["(",")"]).includes(piece[0])) {
      pieces = pieces.concat(piece.split(''));
    }
    else {
      pieces.push(piece);
    }
  }

  let groups = 0;
  let inCharCode = false;
  let inCharValue = false;
  let inCharGroupOpen = false;
  let inCharGroupClose = false;
  let lastPiece = "";

  for (let i=0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (piece === "(") {
      if (inCharValue && !lastPiece.startsWith("@F")) {
        return 'paréntesis de apertura incorrecto';
      }
      groups++;
      inCharCode = false;
      inCharValue = false;
      inCharGroupOpen = true;
      inCharGroupClose = false;
      continue;
    }
    else if (piece === ")") {
      if (inCharCode) {
        return 'paréntesis de cierre incorrecto';
      }
      groups--;
      inCharCode = false;
      inCharValue = false;
      inCharGroupOpen = false;
      inCharGroupClose = true;
      continue;
    }
    else if (charCode.includes(piece)) {
      if ((inCharCode && (lastPiece+piece) !== "<>" && (lastPiece+piece) !== ">=" && (lastPiece+piece) !== "<=") || (inCharGroupOpen && piece !== "-")) {
        return `operador ${piece} incorrecto`;
      }
      else {
        inCharCode = true;
        inCharValue = false;
        inCharGroupOpen = false;
        inCharGroupClose = false;
      }
    }
    else {
      if ((inCharValue && (lastPiece+piece) !== "\"\"") || inCharGroupClose) {
        return `valor ${piece} incorrecto`;
      }
      else if ((piece[0] === "\"") !== (piece[piece.length-1] === "\"") ) {
        return `constante alfanumérica ${piece} incorrecta`;
      }
      else if (piece.indexOf("!") >= 0) {
        return `valor ${piece.replace("!", "")} desconocido`;
      }
      else {
        inCharCode = false;
        inCharValue = true;
        inCharGroupOpen = false;
        inCharGroupClose = false;
      }
    }
    lastPiece = piece;
  }

  if (groups !== 0) {
    return 'paréntesis sin cerrar';
  }

  return null;
}

export function validatePassword(password) {
  const {
    MIN_CHARACTERS,
    MIN_UPPERCASE,
    MIN_LOWERCASE,
    MIN_NUMBERS,
    MIN_SYMBOLS,
  } = APPCONFIG.PASSWORD_RULES

  const fail = message => ({ success: false, message })
  const plural = (word, value) => word + (value > 1 ? 's' : '')

  if (password.length < MIN_CHARACTERS)
    return fail(`La contraseña debe tener al menos ${MIN_CHARACTERS} caracteres`)
  if ((password.match(/[A-Z]/g) || []).length < MIN_UPPERCASE)
    return fail(`La contraseña debe tener al menos ${MIN_UPPERCASE} ${plural('letra', MIN_UPPERCASE)} ${plural('mayúscula', MIN_UPPERCASE)}`)
  if ((password.match(/[a-z]/g) || []).length < MIN_LOWERCASE)
    return fail(`La contraseña debe tener al menos ${MIN_LOWERCASE} ${plural('letra', MIN_LOWERCASE)} ${plural('minúscula', MIN_LOWERCASE)}`)
  if ((password.match(/[0-9]/g) || []).length < MIN_NUMBERS)
    return fail(`La contraseña debe tener al menos ${MIN_NUMBERS} ${plural('número', MIN_NUMBERS)}`)
  if ((password.match(/[!-\/:-@[-`{-~]/g) || []).length < MIN_SYMBOLS)
    return fail(`La contraseña debe tener al menos ${MIN_SYMBOLS} ${plural('signo', MIN_SYMBOLS)}`)

  return { success: true, message: null }
}

export function OnKeyPress_validDecimal(e) {
  var code = e.which || e.keyCode;
  const value = e.target.value;
  //if (code === 44 || code === 46) { //coma o punto
  if (code === 46) { //coma o punto
      if (value.indexOf('.') >= 0) { //coma solo una vez
          e.preventDefault();
      }
  }
  else if (code < 47 || code > 57) {
      e.preventDefault();
  }
}

export function OnKeyPress_validInteger(e) {
  var code = e.which || e.keyCode;
  if (code < 47 || code > 57) {
      e.preventDefault();
  }
}
