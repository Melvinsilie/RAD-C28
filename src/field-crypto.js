const crypto = require("node:crypto");

function createFieldCrypto(hexKey) {
  const key = Buffer.from(hexKey, "hex");

  function encrypt(value) {
    if (value === null || value === undefined || value === "") return null;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
  }

  function decrypt(payload) {
    if (!payload) return "";
    const [version, ivValue, tagValue, dataValue] = String(payload).split(":");
    if (version !== "v1" || !ivValue || !tagValue || !dataValue) {
      throw new Error("Formato de dato cifrado no reconocido.");
    }
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataValue, "base64")),
      decipher.final(),
    ]).toString("utf8");
  }

  function fingerprint(value) {
    return crypto.createHmac("sha256", key).update(String(value).trim()).digest("hex");
  }

  return { encrypt, decrypt, fingerprint };
}

module.exports = { createFieldCrypto };
