import { z } from 'zod';

// Custom validation schemas for trading
export const AptosAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid Aptos address format')
  .length(66, 'Aptos address must be 66 characters (0x + 64 hex chars)');

export const OptionTypeSchema = z.enum(['call', 'put'], {
  errorMap: () => ({ message: 'Option type must be either "call" or "put"' }),
});

export const PositiveNumberSchema = z
  .number({ invalid_type_error: 'Must be a valid number' })
  .positive('Must be greater than 0')
  .finite('Must be a finite number');

export const NonNegativeNumberSchema = z
  .number({ invalid_type_error: 'Must be a valid number' })
  .nonnegative('Must be 0 or greater')
  .finite('Must be a finite number');

export const StrikePriceSchema = PositiveNumberSchema.max(1000000, 'Strike price too high').refine(
  (val) => val >= 0.01,
  'Strike price must be at least $0.01',
);

export const QuantitySchema = z
  .number({ invalid_type_error: 'Quantity must be a valid number' })
  .int('Quantity must be a whole number')
  .positive('Quantity must be greater than 0')
  .max(1000000, 'Quantity too large');

export const ExpiryTimeSchema = z
  .number({ invalid_type_error: 'Expiry time must be a valid number' })
  .int('Expiry time must be a whole number')
  .positive('Expiry time must be in the future')
  .refine((val) => val > Date.now() / 1000, 'Expiry time must be in the future')
  .refine(
    (val) => val < Date.now() / 1000 + 31536000, // 1 year from now
    'Expiry time cannot be more than 1 year in the future',
  );

// Order creation schema
export const CreateOptionSchema = z.object({
  strikePrice: StrikePriceSchema,
  expirySeconds: ExpiryTimeSchema,
  optionType: OptionTypeSchema,
  quantity: QuantitySchema,
});

// Transaction hash validation
export const TransactionHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format')
  .length(66, 'Transaction hash must be 66 characters');

// Price validation
export const PriceSchema = NonNegativeNumberSchema.max(1000000, 'Price too high').refine(
  (val) => val >= 0.000001,
  'Price must be at least $0.000001',
);

// Percentage validation (0-100)
export const PercentageSchema = z
  .number({ invalid_type_error: 'Must be a valid number' })
  .min(0, 'Percentage cannot be negative')
  .max(100, 'Percentage cannot exceed 100');

// Email validation
export const EmailSchema = z.string().email('Invalid email format').max(254, 'Email too long');

// Wallet balance validation
export const WalletBalanceSchema = NonNegativeNumberSchema.refine(
  (val) => val <= 1000000,
  'Balance too high',
);

// Strategy validation
export const StrategyNameSchema = z
  .string()
  .min(1, 'Strategy name is required')
  .max(100, 'Strategy name too long')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Strategy name contains invalid characters');

export const StrategyDescriptionSchema = z.string().max(1000, 'Strategy description too long');

// API Response validation schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.number().optional(),
});

export const PriceFeedSchema = z.object({
  symbol: z.string().min(1).max(20),
  price: PriceSchema,
  timestamp: z.number().positive(),
  source: z.string().min(1).max(50),
});

export const OrderBookSchema = z.object({
  symbol: z.string().min(1).max(20),
  bids: z.array(z.tuple([PriceSchema, QuantitySchema])),
  asks: z.array(z.tuple([PriceSchema, QuantitySchema])),
  timestamp: z.number().positive(),
});

// Validation result type
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

// Generic validation function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

// Safe validation function (doesn't throw)
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.errors.map((err) => err.message);
      return { success: false, errors };
    }
  } catch (error) {
    return { success: false, errors: ['Validation failed unexpectedly'] };
  }
}

// Trading-specific validation helpers
export function validateStrikePrice(value: unknown): ValidationResult<number> {
  return safeValidate(StrikePriceSchema, value);
}

export function validateQuantity(value: unknown): ValidationResult<number> {
  return safeValidate(QuantitySchema, value);
}

export function validateExpiryTime(value: unknown): ValidationResult<number> {
  return safeValidate(ExpiryTimeSchema, value);
}

export function validateOptionType(value: unknown): ValidationResult<'call' | 'put'> {
  return safeValidate(OptionTypeSchema, value);
}

export function validateCreateOption(
  data: unknown,
): ValidationResult<z.infer<typeof CreateOptionSchema>> {
  return safeValidate(CreateOptionSchema, data);
}

export function validateAptosAddress(value: unknown): ValidationResult<string> {
  return safeValidate(AptosAddressSchema, value);
}

export function validateTransactionHash(value: unknown): ValidationResult<string> {
  return safeValidate(TransactionHashSchema, value);
}

// Input sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeNumber(input: string): number | null {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

// Form validation helpers
export function createFormValidator<T extends Record<string, unknown>>(schema: z.ZodSchema<T>) {
  return (data: Record<string, unknown>): ValidationResult<T> => {
    return safeValidate(schema, data);
  };
}

// Export commonly used schemas
export const schemas = {
  aptosAddress: AptosAddressSchema,
  optionType: OptionTypeSchema,
  positiveNumber: PositiveNumberSchema,
  nonNegativeNumber: NonNegativeNumberSchema,
  strikePrice: StrikePriceSchema,
  quantity: QuantitySchema,
  expiryTime: ExpiryTimeSchema,
  createOption: CreateOptionSchema,
  transactionHash: TransactionHashSchema,
  price: PriceSchema,
  percentage: PercentageSchema,
  email: EmailSchema,
  walletBalance: WalletBalanceSchema,
  strategyName: StrategyNameSchema,
  strategyDescription: StrategyDescriptionSchema,
};
