import nodemailer from 'nodemailer';

export const useMailer = () => {
  const { smtpHost, smtpPort, smtpUser, smtpPassword } = useRuntimeConfig();
  let options = {
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {},
  };

  if (smtpUser && smtpPassword) {
    options.auth = {
      user: smtpUser || null,
      pass: smtpPassword || null,
    };
  }

  return nodemailer.createTransport(options as unknown);
};
