import { H3Event, getQuery } from 'h3';
import { ContextConfigurationItem, ContextConfiguration } from '../types';
import { createError } from 'h3';

export const CONTEXT_HEADER_KEY = 'antc';

export const getContext = async <T>(
  event: H3Event,
  config: ContextConfiguration
): Promise<ContextConfigurationItem & T> => {
  const requestContext =
    event.node.req.headers[CONTEXT_HEADER_KEY] ||
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
