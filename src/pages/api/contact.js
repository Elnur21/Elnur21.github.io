import { emailConfiguration } from "@/libs/helpers";
import nodemailer from "nodemailer";

// Reject oversized bodies before they reach the handler
export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 };
const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/;

// Best effort: serverless instances don't share memory, but this still stops a single
// client from flooding the inbox through one warm instance
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Only accept posts from this site's own pages
const isSameOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
};

const parseBody = (body) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body && typeof body === "object" ? body : null;
};

// Trimmed strings within their length limits, or null
const validate = (body) => {
  const fields = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = body?.[key];
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > max) return null;
    fields[key] = trimmed;
  }
  // No line breaks anywhere they could end up in a mail header
  if (/[\r\n]/.test(fields.name + fields.email + fields.subject)) return null;
  if (!EMAIL_RE.test(fields.email)) return null;
  return fields;
};

export default async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ msg: "Only POST requests are allowed" });
  }
  if (!isSameOrigin(req)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "")
    .split(",")[0]
    .trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ msg: "Too many requests" });
  }

  const fields = validate(parseBody(req.body));
  if (!fields) {
    return res.status(400).json({ msg: "Invalid input" });
  }

  const { name, email, subject, message } = fields;
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, "<br/>"),
  };

  try {
    const transporter = nodemailer.createTransport(emailConfiguration);
    await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to: "elnur2370@gmail.com",
      replyTo: email,
      subject: "New contact received from portfolio",
      text: `Email: ${email}\nName: ${name}\n\nSubject: ${subject}\n\nMessage:\n${message}\n`,
      html: `
                <p>
                  Email: <a href="mailto:${safe.email}">${safe.email}</a>.  <br/>
                  Name: ${safe.name}  <br/> <br/>
                  Subject: ${safe.subject} <br/> <br/>
                  Message: ${safe.message} <br/> <br/>
                </p>
              `,
    });
    res.status(201).json({ msg: "Success" });
  } catch (error) {
    console.error("error in sending contact email: ", error);
    res.status(500).json({ msg: "Failed" });
  }
};
