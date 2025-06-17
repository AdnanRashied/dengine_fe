export class EnvDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvDataError";
    Object.setPrototypeOf(this, EnvDataError.prototype);
  }
}

/**
 * Made to chk env names before running main func
 * Get environment variable by name.
 * On client side, only allows keys starting with NEXT_PUBLIC_.
 * Throws EnvDataError if the variable is missing.
 */
export const getEnv = (key: string): string => {
  if (typeof window !== "undefined") {
    // Client-side: only allow NEXT_PUBLIC_ vars
    if (!key.startsWith("NEXT_PUBLIC_")) {
      throw new EnvDataError(
        `Client-side code can only access environment variables prefixed with NEXT_PUBLIC_. Tried to access: "${key}"`
      );
    }
  }

  const value = process.env[key];

  if (!value) {
    throw new EnvDataError(
      `Environment variable "${key}" does not exist or is not defined.`
    );
  }

  return value;
};
