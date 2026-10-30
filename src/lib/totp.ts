// Vmove Logistics - Enterprise TOTP (RFC 6238) Authentication Engine
// Self-contained, cryptographic RFC 6238 implementation supporting Google Authenticator,
// Microsoft Authenticator, and standard RFC-compliant authenticator apps.

// Base32 Character Set (RFC 4648)
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Decode Base32 string to Uint8Array
 */
export function base32Decode(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) {
      throw new Error(`Invalid base32 character: ${clean[i]}`);
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

/**
 * Encode Uint8Array to Base32 string
 */
export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Generate a cryptographically secure Base32 TOTP secret (160-bit / 20-byte)
 */
export function generateTOTPSecret(): string {
  const bytes = new Uint8Array(20);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 20; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return base32Encode(bytes);
}

/**
 * Pure TypeScript SHA-1 implementation for synchronous TOTP computation (RFC 3174)
 */
function sha1(bytes: Uint8Array): Uint8Array {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;

  const totalLen = bytes.length;
  const bitLen = totalLen * 8;
  const padLen = (totalLen % 64 < 56) ? (56 - (totalLen % 64)) : (120 - (totalLen % 64));
  const totalPaddedLen = totalLen + padLen + 8;
  const padded = new Uint8Array(totalPaddedLen);
  padded.set(bytes);
  padded[totalLen] = 0x80;

  // 64-bit length big-endian
  const view = new DataView(padded.buffer);
  view.setUint32(totalPaddedLen - 4, bitLen, false);

  const W = new Int32Array(80);

  for (let chunk = 0; chunk < totalPaddedLen; chunk += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(chunk + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      const v = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
      W[i] = (v << 1) | (v >>> 31);
    }

    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;

    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (B & C) | (~B & D);
        k = K[0];
      } else if (i < 40) {
        f = B ^ C ^ D;
        k = K[1];
      } else if (i < 60) {
        f = (B & C) | (B & D) | (C & D);
        k = K[2];
      } else {
        f = B ^ C ^ D;
        k = K[3];
      }

      const temp = (((A << 5) | (A >>> 27)) + f + E + k + W[i]) | 0;
      E = D;
      D = C;
      C = (B << 30) | (B >>> 2);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) | 0;
    H1 = (H1 + B) | 0;
    H2 = (H2 + C) | 0;
    H3 = (H3 + D) | 0;
    H4 = (H4 + E) | 0;
  }

  const result = new Uint8Array(20);
  const outView = new DataView(result.buffer);
  outView.setUint32(0, H0, false);
  outView.setUint32(4, H1, false);
  outView.setUint32(8, H2, false);
  outView.setUint32(12, H3, false);
  outView.setUint32(16, H4, false);
  return result;
}

/**
 * Compute HMAC-SHA1
 */
function hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
  const blockSize = 64;
  let formattedKey = key;

  if (formattedKey.length > blockSize) {
    formattedKey = sha1(formattedKey);
  }

  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(formattedKey);

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);

  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = paddedKey[i] ^ 0x5c;
    iKeyPad[i] = paddedKey[i] ^ 0x36;
  }

  // inner = sha1(iKeyPad + message)
  const innerBuf = new Uint8Array(blockSize + message.length);
  innerBuf.set(iKeyPad);
  innerBuf.set(message, blockSize);
  const innerHash = sha1(innerBuf);

  // outer = sha1(oKeyPad + innerHash)
  const outerBuf = new Uint8Array(blockSize + innerHash.length);
  outerBuf.set(oKeyPad);
  outerBuf.set(innerHash, blockSize);
  return sha1(outerBuf);
}

/**
 * Generate 6-digit TOTP code for a given timestamp and secret
 */
export function generateTOTPCode(secretBase32: string, timestampMs = Date.now(), stepSeconds = 30): string {
  const key = base32Decode(secretBase32);
  const counter = Math.floor(timestampMs / 1000 / stepSeconds);

  // 8-byte big-endian counter
  const counterBytes = new Uint8Array(8);
  const view = new DataView(counterBytes.buffer);
  view.setUint32(4, counter, false); // lower 32 bits

  const hmac = hmacSha1(key, counterBytes);

  // Dynamic truncation (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verify a 6-digit TOTP code with time-step tolerance (±1 step, i.e., 30s drift)
 */
export function verifyTOTPCode(
  secretBase32: string,
  userCode: string,
  timestampMs = Date.now(),
  toleranceSteps = 1,
  stepSeconds = 30
): boolean {
  const cleanCode = userCode.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  for (let i = -toleranceSteps; i <= toleranceSteps; i++) {
    const checkTime = timestampMs + i * stepSeconds * 1000;
    const expected = generateTOTPCode(secretBase32, checkTime, stepSeconds);
    if (expected === cleanCode) {
      return true;
    }
  }

  return false;
}

/**
 * Generate standard otpauth URI for QR codes or manual entry
 */
export function getTOTPUri(secretBase32: string, accountEmail: string, issuer = 'Vmove Logistics'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountEmail);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
