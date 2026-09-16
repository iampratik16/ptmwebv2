// Standalone SMTP check. Proves the credentials authenticate AND that a real
// message lands, without booting Next.js or filling in the form.
//
//   node --env-file=.env.local scripts/test-smtp.mjs vaibhav@radlabs.tech
//
// verify() is the useful half: it completes the STARTTLS handshake and the AUTH
// exchange, so a failure here is a credentials/tenant problem, never a problem
// with the message itself.
import nodemailer from "nodemailer";

const to = process.argv[2] ?? process.env.CONTACT_TO_EMAIL;
if (!to) {
  console.error("usage: node --env-file=.env.local scripts/test-smtp.mjs <recipient>");
  process.exit(1);
}

const { SMTP_USER, SMTP_PASSWORD } = process.env;
if (!SMTP_USER || !SMTP_PASSWORD) {
  console.error("SMTP_USER / SMTP_PASSWORD missing — is .env.local there?");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.office365.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

try {
  await transporter.verify();
  console.log("AUTH OK — credentials accepted by", process.env.SMTP_HOST ?? "smtp.office365.com");
} catch (err) {
  console.error("AUTH FAILED:", err.message);
  process.exit(1);
}

const info = await transporter.sendMail({
  from: process.env.CONTACT_FROM_EMAIL ?? SMTP_USER,
  to: to.split(",").map((a) => a.trim()).filter(Boolean),
  subject: "Pink Tree Media — SMTP test",
  text: "If you are reading this, the contact form can send mail.",
});

console.log("SENT:", info.messageId);
console.log("accepted:", info.accepted.join(", ") || "(none)");
if (info.rejected.length) console.log("rejected:", info.rejected.join(", "));
