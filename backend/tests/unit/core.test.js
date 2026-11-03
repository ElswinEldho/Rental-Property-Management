import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  mapPrismaError,
} from '../../src/core/errors/index.js';
import {
  formatINR,
  toPaise,
  toRupees,
  addCurrency,
  subtractCurrency,
} from '../../src/core/utils/currency.js';
import {
  getBillingPeriod,
  calculateDueDate,
  toISODateString,
  isPastDate,
} from '../../src/core/utils/date.js';
import { isValidUUID, slugify, capitalize } from '../../src/core/utils/string.js';
import { hashPassword, verifyPassword } from '../../src/core/security/password.js';
import { generateSecureToken, hashToken, generateUUID } from '../../src/core/security/tokens.js';
import { sanitizeString, maskSensitive } from '../../src/core/security/sanitizer.js';
import { parsePaginationParams, createPaginationMeta } from '../../src/core/http/pagination.js';
import { eventBus } from '../../src/core/events/eventBus.js';

describe('Backend Core Infrastructure Unit Tests', () => {
  describe('1. Currency Utilities (INR)', () => {
    it('should format INR currency properly with symbol and decimals', () => {
      const formatted = formatINR(150000);
      expect(formatted).toMatch(/1,50,000(\.00)?/);
    });

    it('should convert rupees to paise accurately without floating point loss', () => {
      expect(toPaise(100.55)).toBe(10055);
      expect(toRupees(10055)).toBe(100.55);
    });

    it('should add and subtract currency safely', () => {
      expect(addCurrency(10.15, 20.25)).toBe(30.40);
      expect(subtractCurrency(50.00, 15.75)).toBe(34.25);
    });
  });

  describe('2. Date Utilities', () => {
    it('should format billing period as YYYY-MM', () => {
      const date = new Date('2026-05-15T00:00:00Z');
      expect(getBillingPeriod(date)).toBe('2026-05');
    });

    it('should calculate due date correctly by offset days', () => {
      const issueDate = new Date('2026-05-01');
      const dueDate = calculateDueDate(issueDate, 10);
      expect(dueDate.getDate()).toBe(11);
    });

    it('should convert to ISO date string format (YYYY-MM-DD)', () => {
      const d = new Date('2026-11-03T12:00:00Z');
      expect(toISODateString(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('3. String Utilities', () => {
    it('should validate RFC4122 UUID v4', () => {
      const valid = generateUUID();
      expect(isValidUUID(valid)).toBe(true);
      expect(isValidUUID('invalid-uuid')).toBe(false);
    });

    it('should slugify text cleanly', () => {
      expect(slugify('Shanti Nilaya Apartment #102')).toBe('shanti-nilaya-apartment-102');
    });

    it('should capitalize word tokens', () => {
      expect(capitalize('john doe')).toBe('John Doe');
    });
  });

  describe('4. Security Utilities', () => {
    it('should hash and verify passwords using bcrypt (cost factor 12)', async () => {
      const raw = 'SecureSecretPassword!123';
      const hash = await hashPassword(raw);
      expect(hash).toMatch(/^\$2[aby]\$12\$/);
      expect(await verifyPassword(raw, hash)).toBe(true);
      expect(await verifyPassword('WrongPassword', hash)).toBe(false);
    });

    it('should generate secure tokens and deterministic SHA-256 hashes', () => {
      const token = generateSecureToken(16);
      expect(token).toBeDefined();
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it('should sanitize input and mask sensitive identifiers', () => {
      expect(sanitizeString(' <script>alert(1)</script> Hello World! ')).toBe('Hello World!');
      expect(maskSensitive('admin@example.com')).toBe('a***n@example.com');
      expect(maskSensitive('+919876543210')).toBe('+9******10');
    });
  });

  describe('5. Error Handling & Prisma Error Mapping', () => {
    it('should create AppError hierarchy with semantic status codes', () => {
      const notFound = new NotFoundError('Property', '123');
      expect(notFound.statusCode).toBe(404);
      expect(notFound.code).toBe('NOT_FOUND');

      const validation = new ValidationError('Bad request');
      expect(validation.statusCode).toBe(400);

      const conflict = new ConflictError('Duplicate');
      expect(conflict.statusCode).toBe(409);
    });

    it('should map Prisma P2002 to ConflictError and P2025 to NotFoundError', () => {
      const p2002 = mapPrismaError({ code: 'P2002', meta: { target: ['email'] } });
      expect(p2002).toBeInstanceOf(ConflictError);
      expect(p2002.statusCode).toBe(409);

      const p2025 = mapPrismaError({ code: 'P2025', meta: { cause: 'Record not found' } });
      expect(p2025).toBeInstanceOf(NotFoundError);
      expect(p2025.statusCode).toBe(404);
    });
  });

  describe('6. HTTP Pagination Utilities', () => {
    it('should parse page and limit params safely with clamped limits', () => {
      expect(parsePaginationParams({ page: '2', limit: '10' })).toEqual({
        page: 2,
        limit: 10,
        skip: 10,
      });

      // Bounds check
      expect(parsePaginationParams({ page: '-5', limit: '500' }, { maxLimit: 50 })).toEqual({
        page: 1,
        limit: 50,
        skip: 0,
      });
    });

    it('should build pagination metadata with hasNext and hasPrev calculations', () => {
      const meta = createPaginationMeta(45, 2, 20);
      expect(meta).toEqual({
        page: 2,
        limit: 20,
        totalItems: 45,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });
  });

  describe('7. Domain Event Bus', () => {
    it('should dispatch events to subscribers asynchronously without breaking on subscriber errors', async () => {
      let received = null;
      eventBus.subscribe('test.event', async (payload) => {
        received = payload;
      });

      // Failing subscriber should not crash publisher
      eventBus.subscribe('test.event', () => {
        throw new Error('Subscriber error simulation');
      });

      await eventBus.publish('test.event', { message: 'hello event bus' });
      expect(received).toEqual({ message: 'hello event bus' });
    });
  });
});

