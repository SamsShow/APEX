import {
  validateStrikePrice,
  validateQuantity,
  validateExpiryTime,
  validateOptionType,
  validateCreateOption,
  validateAptosAddress,
  validateTransactionHash,
  sanitizeString,
  sanitizeNumber,
  CreateOptionSchema,
  StrikePriceSchema,
  QuantitySchema,
  ExpiryTimeSchema,
  OptionTypeSchema,
} from '@/lib/validation';

describe('Validation System', () => {
  describe('Strike Price Validation', () => {
    it('should accept valid strike prices', () => {
      const result = validateStrikePrice(100);
      expect(result.success).toBe(true);
      expect(result.data).toBe(100);
    });

    it('should reject negative strike prices', () => {
      const result = validateStrikePrice(-50);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Must be greater than 0');
    });

    it('should reject zero strike price', () => {
      const result = validateStrikePrice(0);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Must be greater than 0');
    });

    it('should reject extremely high strike prices', () => {
      const result = validateStrikePrice(2000000);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Strike price too high');
    });

    it('should reject non-numeric values', () => {
      const result = validateStrikePrice('100');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Must be a valid number');
    });
  });

  describe('Quantity Validation', () => {
    it('should accept valid quantities', () => {
      const result = validateQuantity(100);
      expect(result.success).toBe(true);
      expect(result.data).toBe(100);
    });

    it('should reject non-integer quantities', () => {
      const result = validateQuantity(100.5);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Quantity must be a whole number');
    });

    it('should reject negative quantities', () => {
      const result = validateQuantity(-10);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    it('should reject zero quantity', () => {
      const result = validateQuantity(0);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    it('should reject extremely large quantities', () => {
      const result = validateQuantity(2000000);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Quantity too large');
    });
  });

  describe('Expiry Time Validation', () => {
    const futureTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    const pastTime = Math.floor(Date.now() / 1000) - 86400; // 1 day ago
    const tooFarFuture = Math.floor(Date.now() / 1000) + 40000000; // More than 1 year

    it('should accept valid future expiry times', () => {
      const result = validateExpiryTime(futureTime);
      expect(result.success).toBe(true);
      expect(result.data).toBe(futureTime);
    });

    it('should reject past expiry times', () => {
      const result = validateExpiryTime(pastTime);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Expiry time must be in the future');
    });

    it('should reject expiry times too far in the future', () => {
      const result = validateExpiryTime(tooFarFuture);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Expiry time cannot be more than 1 year in the future');
    });
  });

  describe('Option Type Validation', () => {
    it('should accept "call"', () => {
      const result = validateOptionType('call');
      expect(result.success).toBe(true);
      expect(result.data).toBe('call');
    });

    it('should accept "put"', () => {
      const result = validateOptionType('put');
      expect(result.success).toBe(true);
      expect(result.data).toBe('put');
    });

    it('should reject invalid option types', () => {
      const result = validateOptionType('invalid');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Option type must be either "call" or "put"');
    });
  });

  describe('Create Option Validation', () => {
    const validData = {
      strikePrice: 100,
      expirySeconds: Math.floor(Date.now() / 1000) + 86400,
      optionType: 'call' as const,
      quantity: 10,
    };

    it('should accept valid option creation data', () => {
      const result = validateCreateOption(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject invalid strike price', () => {
      const invalidData = { ...validData, strikePrice: -50 };
      const result = validateCreateOption(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Must be greater than 0');
    });

    it('should reject invalid quantity', () => {
      const invalidData = { ...validData, quantity: 0 };
      const result = validateCreateOption(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Quantity must be greater than 0');
    });

    it('should reject invalid option type', () => {
      const invalidData = { ...validData, optionType: 'invalid' as any };
      const result = validateCreateOption(invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Option type must be either "call" or "put"');
    });
  });

  describe('Aptos Address Validation', () => {
    const validAddress = '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083';

    it('should accept valid Aptos addresses', () => {
      const result = validateAptosAddress(validAddress);
      expect(result.success).toBe(true);
      expect(result.data).toBe(validAddress);
    });

    it('should reject addresses without 0x prefix', () => {
      const invalidAddress = '9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083';
      const result = validateAptosAddress(invalidAddress);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid Aptos address format');
    });

    it('should reject addresses that are too short', () => {
      const invalidAddress = '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b08';
      const result = validateAptosAddress(invalidAddress);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Aptos address must be 66 characters (0x + 64 hex chars)');
    });

    it('should reject addresses with invalid characters', () => {
      const invalidAddress = '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b08g';
      const result = validateAptosAddress(invalidAddress);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid Aptos address format');
    });
  });

  describe('Transaction Hash Validation', () => {
    const validHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

    it('should accept valid transaction hashes', () => {
      const result = validateTransactionHash(validHash);
      expect(result.success).toBe(true);
      expect(result.data).toBe(validHash);
    });

    it('should reject hashes without 0x prefix', () => {
      const invalidHash = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const result = validateTransactionHash(invalidHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid transaction hash format');
    });

    it('should reject hashes that are too short', () => {
      const invalidHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde';
      const result = validateTransactionHash(invalidHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Transaction hash must be 66 characters');
    });
  });

  describe('String Sanitization', () => {
    it('should trim whitespace', () => {
      const result = sanitizeString('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should remove HTML tags', () => {
      const result = sanitizeString('<script>alert("xss")</script>');
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should handle empty strings', () => {
      const result = sanitizeString('');
      expect(result).toBe('');
    });
  });

  describe('Number Sanitization', () => {
    it('should parse valid numbers', () => {
      const result = sanitizeNumber('123.45');
      expect(result).toBe(123.45);
    });

    it('should handle negative numbers', () => {
      const result = sanitizeNumber('-123.45');
      expect(result).toBe(-123.45);
    });

    it('should remove invalid characters', () => {
      const result = sanitizeNumber('$123.45USD');
      expect(result).toBe(123.45);
    });

    it('should return null for invalid input', () => {
      const result = sanitizeNumber('not-a-number');
      expect(result).toBeNull();
    });
  });

  describe('Schema Validation', () => {
    it('should validate strike price schema directly', () => {
      const result = StrikePriceSchema.safeParse(100);
      expect(result.success).toBe(true);
    });

    it('should validate quantity schema directly', () => {
      const result = QuantitySchema.safeParse(10);
      expect(result.success).toBe(true);
    });

    it('should validate expiry time schema directly', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 86400;
      const result = ExpiryTimeSchema.safeParse(futureTime);
      expect(result.success).toBe(true);
    });

    it('should validate option type schema directly', () => {
      const result = OptionTypeSchema.safeParse('call');
      expect(result.success).toBe(true);
    });

    it('should validate create option schema directly', () => {
      const validData = {
        strikePrice: 100,
        expirySeconds: Math.floor(Date.now() / 1000) + 86400,
        optionType: 'call' as const,
        quantity: 10,
      };
      const result = CreateOptionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
