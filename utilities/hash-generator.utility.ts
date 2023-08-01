import crypto from "crypto";

export function generateHash(input: string): string {
  // Create the SHA-256 hash object
  const sha256Hash = crypto.createHash("sha256");

  // Update the hash object with the input string
  sha256Hash.update(input);

  // Generate the hash in hexadecimal format
  const hash = sha256Hash.digest("hex");

  return hash;
}
