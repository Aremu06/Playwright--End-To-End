import * as OTPAuth from "otpauth";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [path.resolve(".env"), path.resolve(".env.local")],
  override: true,
});

const totp = new OTPAuth.TOTP({
  issuer: "Shopify",
  label: process.env.SHOPIFY_EMAIL, // TechnicalUserQA2@tqgg.de
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: process.env.SHOPIFY_TOTP_SECRET,
});

export async function get_totp_generated() {
  return totp.generate();
}
