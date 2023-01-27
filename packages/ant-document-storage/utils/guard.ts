import { JsonWebToken } from './jwtUtil';
import { minimatch } from 'minimatch';

export default {
  canUpload: function (token: JsonWebToken, dirToUpload: string): boolean {
    for (const permission of token.documentStorage.write) {
      const hasPermission = minimatch(dirToUpload, permission);

      if (hasPermission) {
        return true;
      }
    }

    return false;
  },

  canRead: function (token: JsonWebToken, dirToRead: string): boolean {
    for (const permission of token.documentStorage.read) {
      const hasPermission = minimatch(dirToRead, permission);

      if (hasPermission) {
        return true;
      }
    }

    return false;
  },

  canDelete: function (token: JsonWebToken, dirToDelete: string): boolean {
    for (const permission of token.documentStorage.delete) {
      const hasPermission = minimatch(dirToDelete, permission);

      if (hasPermission) {
        return true;
      }
    }

    return false;
  },
};
