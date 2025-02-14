export const emailConfiguration = {
  service: "Gmail",
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized:
      process.env.REJECT_UNAUTHORIZED == "false" ? false : true, // Set to true in production
  },
  connectionTimeout: 5000,
};
