export const converter2 = (uuid) => {
  const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
  return Buffer.concat([
    buf.subarray(0, 4),
    buf.subarray(4, 6),
    buf.subarray(6, 8),
    buf.subarray(8, 16),
  ]);
};

export const encode2Base64 = (createdat) =>
  Buffer.from(createdat).toString("base64");

export const decode2Base64 = (createdat) =>
  Buffer.from(createdat, 'base64').toString("ascii")
