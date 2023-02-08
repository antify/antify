import { H3Event, getCookie } from 'h3';

// Replace with global function
export const useTenantHeader = (event: H3Event): string | null =>
  event.node.req.headers['anttid'] || getCookie(event, 'anttid') || null;
