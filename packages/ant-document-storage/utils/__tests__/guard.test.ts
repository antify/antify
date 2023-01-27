import { describe, test, expect } from 'vitest';
import guard from '../guard';
import { JsonWebToken } from '../jwtUtil';

describe('Guard tests', async () => {
  test('should emit if a token has permission to upload a file', async () => {
    expect(
      guard.canUpload(
        { documentStorage: { write: [] } } as JsonWebToken,
        '/foo'
      )
    ).toBeFalsy();

    expect(
      guard.canUpload(
        { documentStorage: { write: ['/bar', '/baz'] } } as JsonWebToken,
        '/foo'
      )
    ).toBeFalsy();

    expect(
      guard.canUpload(
        { documentStorage: { write: ['/foo', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();

    expect(
      guard.canUpload(
        { documentStorage: { write: ['/**', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();
  });

  test('should emit if a token has permission to read a file', async () => {
    expect(
      guard.canRead({ documentStorage: { read: [] } } as JsonWebToken, '/foo')
    ).toBeFalsy();

    expect(
      guard.canRead(
        { documentStorage: { read: ['/bar', '/baz'] } } as JsonWebToken,
        '/foo'
      )
    ).toBeFalsy();

    expect(
      guard.canRead(
        { documentStorage: { read: ['/foo', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();

    expect(
      guard.canRead(
        { documentStorage: { read: ['/**', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();
  });

  test('should emit if a token has permission to delete a file', async () => {
    expect(
      guard.canDelete(
        { documentStorage: { delete: [] } } as JsonWebToken,
        '/foo'
      )
    ).toBeFalsy();

    expect(
      guard.canDelete(
        { documentStorage: { delete: ['/bar', '/baz'] } } as JsonWebToken,
        '/foo'
      )
    ).toBeFalsy();

    expect(
      guard.canDelete(
        { documentStorage: { delete: ['/foo', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();

    expect(
      guard.canDelete(
        { documentStorage: { delete: ['/**', '/bar'] } } as JsonWebToken,
        '/bar'
      )
    ).toBeTruthy();
  });
});
