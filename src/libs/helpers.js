export const emailConfiguration = {
  service: "Gmail",
  host: process.env.NEXT_PUBLIC_MAIL_HOST,
  port: process.env.NEXT_PUBLIC_MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SENDER_MAIL,
    pass: process.env.NEXT_PUBLIC_SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized:
      process.env.NEXT_PUBLIC_REJECT_UNAUTHORIZED == "false" ? false : true, // Set to true in production
  },
  connectionTimeout: 5000,
};
