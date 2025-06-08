/**
 * Safely serializes data containing BigInt values to be JSON-compatible.
 * 
 * @param data - The data to serialize
 * @returns The serialized data with BigInt converted to strings
 */
export function serializeBigInt<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  try {
    const stringified = JSON.stringify(data, (_key, value) => {
      // Handle BigInt values
      if (typeof value === "bigint") {
        return value.toString();
      }

      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }

      return value;
    });

    return JSON.parse(stringified);
  } catch (error) {
    console.error("Error serializing data with BigInt:", error);

    // Fallback to manual conversion for common objects
    if (Array.isArray(data)) {
      return data.map(item => serializeBigInt(item)) as unknown as T;
    }

    if (typeof data === "object" && data !== null) {
      const result = {} as any;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = (data as any)[key];
          result[key] = typeof value === "bigint"
            ? value.toString()
            : serializeBigInt(value);
        }
      }
      return result as T;
    }

    return data;
  }
}

/**
 * Converts all BigInt values in an object or array to strings recursively.
 * 
 * @param value - The value to process (object, array, primitive)
 * @returns The processed value with all BigInt values converted to strings
 */
export const convertBigIntToString = <T>(value: T): T => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle BigInt directly
  if (typeof value === 'bigint') {
    return value.toString() as unknown as T;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(convertBigIntToString) as unknown as T;
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value as T;
  }

  // Handle objects (but not null, which is typeof 'object')
  if (typeof value === 'object') {
    const result = {} as Record<string, any>;

    // Use Object.entries for better performance with large objects
    Object.entries(value as Record<string, any>).forEach(([key, val]) => {
      result[key] = convertBigIntToString(val);
    });

    return result as unknown as T;
  }

  // Return primitives and other types unchanged
  return value;
};

export const parseNumericField = (formData: FormData, field: string, defaultValue: number = 0) => {
  const value = formData.get(field);
  if (!value) return defaultValue;
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? defaultValue : parsed;
};

export function replacer(_: string, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("th-TH", options);
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(price);
  };