"use strict";

const EventOfClosing = class {
  constructor(code, reasonInArrayBufferInUTF8) {
    this[_code] = code;
    if (reasonInArrayBufferInUTF8) {
      this[_reasonInArrayBufferInUTF8] = reasonInArrayBufferInUTF8;
    }
  }

  get code() {
    return this[_code];
  }

  get reason() {
    const arrayBuffer = this[_reasonInArrayBufferInUTF8];
    if (arrayBuffer) {
      return _decodeBytesInUTF8ToString(arrayBuffer);
    }
  }
};

const _code = Symbol();
const _reasonInArrayBufferInUTF8 = Symbol();

const _decodeBytesInUTF8ToString = TextDecoder.prototype.decode.bind(new TextDecoder("utf8"));

module.exports = EventOfClosing;
