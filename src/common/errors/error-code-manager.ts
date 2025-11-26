// #region Imports
import * as fs from 'fs';
import * as path from 'path';
// #endregion

// #region Types
export interface ErrorCodeConfig {
  domains: Record<string, string>;
  errors: Record<
    string,
    {
      messages: Record<string, string>;
    }
  >;
}

// #endregion

// #region Error Code Manager
/**
 * Manages error codes and messages loaded from error-codes.json.
 * Supports multi-language message templates with placeholders ([0], [1], etc.).
 */
export class ErrorCodeManager {
  private static instance: ErrorCodeManager;
  private config: ErrorCodeConfig;
  private currentLanguage: string = 'ja';

  private constructor() {
    const configPath = path.join(__dirname, '../../config/error-codes.json');
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    this.config = JSON.parse(fileContent) as ErrorCodeConfig;
  }

  static getInstance(): ErrorCodeManager {
    if (!ErrorCodeManager.instance) {
      ErrorCodeManager.instance = new ErrorCodeManager();
    }
    return ErrorCodeManager.instance;
  }

  /**
   * Set the current language for message templates.
   * Default: 'ja'
   */
  setLanguage(lang: string): void {
    this.currentLanguage = lang;
  }

  /**
   * Get domain code (e.g., 'TIP' -> '1').
   */
  getDomainCode(domain: string): string {
    return this.config.domains[domain] || 'UNKNOWN';
  }

  /**
   * Get message template for an error code.
   */
  getMessageTemplate(errorCode: string): string {
    const error = this.config.errors[errorCode];
    if (!error) return `Unknown error: ${errorCode}`;
    const messages = error.messages[this.currentLanguage];
    return messages || error.messages['ja'] || `Unknown error: ${errorCode}`;
  }

  /**
   * Get full app error code (e.g., 'ET-TIP-001').
   */
  getFullErrorCode(domain: string, errorCode: string): string {
    const domainCode = this.getDomainCode(domain);
    return `ET-${domain}-${errorCode}`;
  }

  /**
   * Format message by replacing placeholders [0], [1], etc. with provided values.
   * Example: template="[0]が不正です。", values=["category"] -> "categoryが不正です。"
   */
  formatMessage(template: string, ...values: string[]): string {
    let result = template;
    values.forEach((value, index) => {
      result = result.replace(`[${index}]`, value);
    });
    return result;
  }

  /**
   * Get formatted message for an error code.
   */
  getMessage(errorCode: string, ...values: string[]): string {
    const template = this.getMessageTemplate(errorCode);
    return this.formatMessage(template, ...values);
  }
}
// #endregion
