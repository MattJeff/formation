import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  /** Email validation */
  email: z.string().email('Email invalide').max(255),

  /** Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number) */
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),

  /** UUID validation */
  uuid: z.string().uuid('UUID invalide'),

  /** URL validation */
  url: z.string().url('URL invalide').max(2048),

  /** Phone number (international format) */
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide'),

  /** Slug validation (lowercase, numbers, hyphens) */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide')
    .min(1)
    .max(255),

  /** Username validation (alphanumeric, underscore, hyphen) */
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username invalide (lettres, chiffres, _ et - uniquement)')
    .min(3, 'Le username doit contenir au moins 3 caractères')
    .max(30, 'Le username ne peut pas dépasser 30 caractères'),

  /** Short text (255 chars max) */
  shortText: z.string().min(1).max(255),

  /** Medium text (1000 chars max) */
  mediumText: z.string().min(1).max(1000),

  /** Long text (10000 chars max) */
  longText: z.string().min(1).max(10000),

  /** Price in euros (positive number, max 2 decimals) */
  price: z.number().min(0).max(99999.99).multipleOf(0.01),

  /** Percentage (0-100) */
  percentage: z.number().min(0).max(100),

  /** Positive integer */
  positiveInt: z.number().int().positive(),

  /** Date string (ISO 8601) */
  dateString: z.string().datetime(),
};

/**
 * Sanitize HTML content
 * Removes all dangerous HTML tags and attributes
 *
 * @param dirty - Untrusted HTML string
 * @param options - DOMPurify options
 * @returns Sanitized HTML string
 *
 * @example
 * ```ts
 * const clean = sanitizeHTML('<script>alert("XSS")</script><p>Hello</p>');
 * // Returns: '<p>Hello</p>'
 * ```
 */
export function sanitizeHTML(
  dirty: string,
  options?: {
    /** Allowed tags (default: safe tags only) */
    ALLOWED_TAGS?: string[];
    /** Allowed attributes (default: safe attributes only) */
    ALLOWED_ATTR?: string[];
    /** Allow iframes (default: false) */
    ADD_TAGS?: string[];
  }
): string {
  const config = {
    ALLOWED_TAGS: options?.ALLOWED_TAGS || [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'a',
      'img',
    ],
    ALLOWED_ATTR: options?.ALLOWED_ATTR || ['href', 'src', 'alt', 'title', 'class'],
    ADD_TAGS: options?.ADD_TAGS || [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitize plain text
 * Strips all HTML tags and trims whitespace
 *
 * @param input - Untrusted string
 * @returns Plain text string
 *
 * @example
 * ```ts
 * const clean = sanitizePlainText('<script>alert("XSS")</script>Hello  ');
 * // Returns: 'Hello'
 * ```
 */
export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Escape HTML special characters
 * Prevents HTML injection without removing content
 *
 * @param unsafe - Untrusted string
 * @returns Escaped string
 *
 * @example
 * ```ts
 * const safe = escapeHTML('<script>alert("XSS")</script>');
 * // Returns: '&lt;script&gt;alert("XSS")&lt;/script&gt;'
 * ```
 */
export function escapeHTML(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize a URL
 * Ensures URL is safe and well-formed
 *
 * @param input - URL string to validate
 * @returns Validated URL or null if invalid
 */
export function validateURL(input: string): string | null {
  try {
    const url = new URL(input);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Remove SQL injection attempts from strings
 * WARNING: This is NOT a replacement for parameterized queries!
 * Always use prepared statements/parameterized queries in your database layer.
 *
 * @param input - User input
 * @returns Sanitized string
 */
export function sanitizeSQLInput(input: string): string {
  // Remove common SQL injection patterns
  return input
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove multi-line comment start
    .replace(/\*\//g, '') // Remove multi-line comment end
    .replace(/\bOR\b/gi, '') // Remove OR keyword
    .replace(/\bAND\b/gi, '') // Remove AND keyword
    .replace(/\bDROP\b/gi, '') // Remove DROP keyword
    .replace(/\bDELETE\b/gi, '') // Remove DELETE keyword
    .replace(/\bUPDATE\b/gi, '') // Remove UPDATE keyword
    .replace(/\bINSERT\b/gi, '') // Remove INSERT keyword
    .trim();
}

/**
 * Validate file upload
 * Checks file type, size, and name
 *
 * @param file - File object
 * @param options - Validation options
 * @returns Validation result
 */
export function validateFileUpload(
  file: File,
  options: {
    /** Max size in bytes (default: 5MB) */
    maxSize?: number;
    /** Allowed MIME types */
    allowedTypes?: string[];
    /** Allowed file extensions */
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes || [];
  const allowedExtensions = options.allowedExtensions || [];

  // Check size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux (max: ${maxSize / 1024 / 1024}MB)`,
    };
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé (autorisés: ${allowedTypes.join(', ')})`,
    };
  }

  // Check extension
  if (allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `Extension de fichier non autorisée (autorisées: ${allowedExtensions.join(', ')})`,
      };
    }
  }

  // Check for suspicious filenames
  if (/[<>:"|?*\x00-\x1f]/g.test(file.name)) {
    return {
      valid: false,
      error: 'Nom de fichier invalide',
    };
  }

  return { valid: true };
}

/**
 * Common file upload presets
 */
export const FileUploadPresets = {
  /** Images only (JPG, PNG, WebP, max 5MB) */
  IMAGES: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },

  /** Documents (PDF, DOCX, max 10MB) */
  DOCUMENTS: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedExtensions: ['pdf', 'docx'],
  },

  /** Videos (MP4, WebM, max 100MB) */
  VIDEOS: {
    maxSize: 100 * 1024 * 1024,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['mp4', 'webm', 'mov'],
  },

  /** Avatar images (max 2MB) */
  AVATAR: {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  },
} as const;
