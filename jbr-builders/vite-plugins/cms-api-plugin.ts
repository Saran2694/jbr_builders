import type { Plugin } from 'vite';
import { handleApiRequest } from '../server/api';

export function cmsApiPlugin(): Plugin {
  return {
    name: 'jbr-cms-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          } catch (err) {
            console.error('Error handling API middleware request:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          } catch (err) {
            console.error('Error handling API preview request:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            return;
          }
        }
        next();
      });
    },
  };
}
