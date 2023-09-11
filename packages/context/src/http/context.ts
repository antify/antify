import { H3Event, getQuery, createError, getHeader } from 'h3';
import { ContextConfigurationItem, ContextConfiguration } from '../types';

export const CONTEXT_HEADER_KEY = 'antc';

export const getContext = <T>(
  event: H3Event,
  config: ContextConfiguration
): ContextConfigurationItem & T => {
  const requestContext =
    getHeader(event, CONTEXT_HEADER_KEY) ||
    getQuery(event)[CONTEXT_HEADER_KEY];

  if (!requestContext) {
    throw createError('Missing required context');
  }

  const context = config.find((item) => item.id === requestContext);

  if (!context) {
    throw createError(`Invalid context ${context}`);
  }

  return context;
};

export const useContextHeader = (context: string) => ({
  [CONTEXT_HEADER_KEY]: context,
});
