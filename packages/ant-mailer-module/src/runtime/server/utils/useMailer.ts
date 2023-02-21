import { getContext } from '@antify/context';
import nodemailer, { TransportOptions } from 'nodemailer';
import { type H3Event } from 'h3';
import { type Provider } from '../../../module';

export const useMailer = async (event: H3Event) => {
  const provider = (await getContext(
    event,
    useRuntimeConfig().antMailer.providers
  )) as Provider;

  const options = {
    host: provider.smtpHost,
    port: provider.smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {},
  };

  if (provider.smtpUser && provider.smtpPassword) {
    options.auth = {
      user: provider.smtpUser || null,
      pass: provider.smtpPassword || null,
    };
  }

  return nodemailer.createTransport(options as TransportOptions);
};
