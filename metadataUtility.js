function canSetArray ( arr, issue ) {
  if ( arr !== null && arr !== undefined ) {
    if ( Array.isArray(arr) ) {
      if ( arr.length > 0 ) {
         return true;
      } else {
        throw new Error( issue.empty.value );
      }
    } else {
      throw new Error( issue.invalid.valueType.array );
    }
  } else {
    throw new Error( issue.missing.value );
  }
}

function canSetObject ( obj, issue ) {
  if ( obj !== null && obj !== undefined ) {
    if ( ( typeof obj ).toLowerCase() === "object" && !Array.isArray( obj ) ) {
      if ( Object.keys( obj ).length > 0 ) {
        return true;
      } else {
        throw new Error( issue.empty.value );
      }
    } else {
      throw new Error( issue.invalid.valueType.object );
    }
  } else {
    throw new Error( issue.missing.value );
  }
}

function canSetInteger ( int, issue, startZero ) {
  if ( startZero === null || startZero === undefined ) {
    startZero = false;
  }

  if ( int !== null && int !== undefined ) {
    if ( Number.isInteger( int ) ) {
      if ( int > 0 || ( startZero && int > -1 ) ) {
        return true;
      } else {
        throw new Error( issue.invalid.value.default );
      }
    } else {
      throw new Error( issue.invalid.valueType.integer );
    }
  } else {
    throw new Error( issue.missing.value );
  }
}

function canSetFloat ( float, issue, startZero ) {
  if ( startZero === null || startZero === undefined ) {
    startZero = false;
  }

  if ( float !== null && float !== undefined ) {
    if ( !Number.isNaN( parseFloat( float ) ) ) {
      if ( float > 0 || ( startZero && float > -1 ) ) {
        return true;
      } else {
        throw new Error( issue.invalid.value.default );
      }
    } else {
      throw new Error( issue.invalid.valueType.float );
    }
  } else {
    throw new Error( issue.missing.value );
  }
}

module.exports = {
  can : {
    set : {
      array   : canSetArray,
      object  : canSetObject,
      integer : canSetInteger,
      float   : canSetFloat,
    }
  }
}