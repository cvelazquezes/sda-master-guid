/**
 * API Utilities Tests
 */

import {
  createPaginationParams,
  createCursorPaginationParams,
  calculatePaginationMeta,
  createFilterParams,
  createSortParams,
  parseSortString,
  buildQueryString,
  combineQueryParams,
  generateIdempotencyKey,
  createPaginatedResponse,
  createCursorPaginatedResponse,
} from '../api';

describe('API Utilities', () => {
  describe('createPaginationParams', () => {
    it('should create offset-based pagination params', () => {
      const params = createPaginationParams({ page: 2, pageSize: 20 });

      expect(params).toEqual({
        page: '2',
        pageSize: '20',
        offset: '20',
        limit: '20',
      });
    });

    it('should handle first page', () => {
      const params = createPaginationParams({ page: 1, pageSize: 10 });

      expect(params.offset).toBe('0');
    });

    it('should use default page size', () => {
      const params = createPaginationParams({});

      expect(params.pageSize).toBe('20');
      expect(params.limit).toBe('20');
    });
  });

  describe('createCursorPaginationParams', () => {
    it('should create cursor-based pagination params', () => {
      const params = createCursorPaginationParams({ cursor: 'abc123', limit: 50 });

      expect(params).toEqual({
        cursor: 'abc123',
        limit: '50',
      });
    });

    it('should omit cursor if not provided', () => {
      const params = createCursorPaginationParams({ limit: 30 });

      expect(params.cursor).toBeUndefined();
      expect(params.limit).toBe('30');
    });
  });

  describe('calculatePaginationMeta', () => {
    it('should calculate pagination metadata', () => {
      const meta = calculatePaginationMeta(150, 3, 20);

      expect(meta).toEqual({
        page: 3,
        pageSize: 20,
        total: 150,
        totalPages: 8,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should handle first page', () => {
      const meta = calculatePaginationMeta(100, 1, 25);

      expect(meta.hasPrev).toBe(false);
      expect(meta.hasNext).toBe(true);
    });

    it('should handle last page', () => {
      const meta = calculatePaginationMeta(100, 4, 25);

      expect(meta.hasPrev).toBe(true);
      expect(meta.hasNext).toBe(false);
    });
  });

  describe('createFilterParams', () => {
    it('should create filter params from object', () => {
      const params = createFilterParams({
        status: 'active',
        role: 'admin',
      });

      expect(params).toEqual({
        status: 'active',
        role: 'admin',
      });
    });

    it('should handle array values with repeat format', () => {
      const params = createFilterParams(
        {
          status: ['active', 'pending'],
        },
        { arrayFormat: 'repeat' }
      );

      expect(params.status).toEqual(['active', 'pending']);
    });

    it('should handle nested objects', () => {
      const params = createFilterParams({
        createdAt: { gte: '2024-01-01', lte: '2024-12-31' },
      });

      expect(params['createdAt[gte]']).toBe('2024-01-01');
      expect(params['createdAt[lte]']).toBe('2024-12-31');
    });

    it('should skip null and undefined values', () => {
      const params = createFilterParams({
        status: 'active',
        name: null,
        age: undefined,
        email: '',
      });

      expect(params.status).toBe('active');
      expect(params.name).toBeUndefined();
      expect(params.age).toBeUndefined();
      expect(params.email).toBeUndefined();
    });
  });

  describe('createSortParams', () => {
    it('should create sort params', () => {
      const params = createSortParams('name', 'asc');

      expect(params).toEqual({
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('should return empty object if no sortBy', () => {
      const params = createSortParams();

      expect(params).toEqual({});
    });

    it('should default to asc order', () => {
      const params = createSortParams('createdAt');

      expect(params.sortOrder).toBe('asc');
    });
  });

  describe('parseSortString', () => {
    it('should parse "-fieldName" format', () => {
      const params = parseSortString('-createdAt');

      expect(params).toEqual({
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('should parse "fieldName:order" format', () => {
      const params = parseSortString('name:asc');

      expect(params).toEqual({
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('should default to asc for plain field name', () => {
      const params = parseSortString('email');

      expect(params).toEqual({
        sortBy: 'email',
        sortOrder: 'asc',
      });
    });

    it('should handle empty string', () => {
      const params = parseSortString('');

      expect(params).toEqual({});
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from params', () => {
      const query = buildQueryString({
        page: 1,
        status: 'active',
        role: 'admin',
      });

      expect(query).toBe('page=1&status=active&role=admin');
    });

    it('should handle array values', () => {
      const query = buildQueryString({
        tags: ['javascript', 'typescript'],
      });

      expect(query).toBe('tags=javascript&tags=typescript');
    });

    it('should skip null and undefined', () => {
      const query = buildQueryString({
        name: 'John',
        age: null,
        email: undefined,
      });

      expect(query).toBe('name=John');
    });
  });

  describe('combineQueryParams', () => {
    it('should combine pagination, sort, and filters', () => {
      const query = combineQueryParams(
        { page: 2, pageSize: 20 },
        { sortBy: 'name', sortOrder: 'asc' },
        { status: 'active' }
      );

      expect(query).toContain('page=2');
      expect(query).toContain('pageSize=20');
      expect(query).toContain('sortBy=name');
      expect(query).toContain('status=active');
    });

    it('should handle undefined params', () => {
      const query = combineQueryParams(undefined, undefined, { status: 'active' });

      expect(query).toBe('status=active');
    });
  });

  describe('generateIdempotencyKey', () => {
    it('should generate unique keys', () => {
      const key1 = generateIdempotencyKey();
      const key2 = generateIdempotencyKey();

      expect(key1).not.toBe(key2);
    });

    it('should include prefix', () => {
      const key = generateIdempotencyKey('payment');

      expect(key).toMatch(/^payment_/);
    });

    it('should generate without prefix', () => {
      const key = generateIdempotencyKey();

      expect(key).not.toMatch(/_/);
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create paginated response', () => {
      const data = [1, 2, 3, 4, 5];
      const response = createPaginatedResponse(data, 150, 2, 20);

      expect(response.data).toEqual(data);
      expect(response.pagination).toEqual({
        page: 2,
        pageSize: 20,
        total: 150,
        totalPages: 8,
        hasNext: true,
        hasPrev: true,
      });
    });
  });

  describe('createCursorPaginatedResponse', () => {
    it('should create cursor paginated response', () => {
      const data = [1, 2, 3, 4, 5];
      const response = createCursorPaginatedResponse(data, 'next_cursor_123', 20);

      expect(response.data).toEqual(data);
      expect(response.pagination).toEqual({
        cursor: 'next_cursor_123',
        hasMore: true,
        limit: 20,
      });
    });

    it('should handle no more data', () => {
      const data = [1, 2, 3];
      const response = createCursorPaginatedResponse(data, null, 20);

      expect(response.pagination.hasMore).toBe(false);
      expect(response.pagination.cursor).toBeNull();
    });
  });
});
