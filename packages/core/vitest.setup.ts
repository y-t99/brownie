import * as webcrypto from "node:crypto";

// 设置全局 crypto 对象
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
  writable: false,
  enumerable: true,
  configurable: true,
});
