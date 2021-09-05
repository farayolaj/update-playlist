declare module 'byte-size' {
  const byteSize: ByteSize;

  interface ByteSize {
    /**
     * @param bytes - The bytes value to convert
     * @param options - Optional config
     */
    (bytes: number, options?: ByteSizeOptions): ByteSizeResult;
    defaultOptions: ByteSizeOptions;
  }

  type ByteSizeResult = {
    value: string;
    unit: string;
    long: string;
    toString: () => string;
  };

  type ByteSizeOptions = {
    /**
     * Number of decimal places. Defaults to 1
     */
    precision?: number;
    /**
     * Defaults to metric
     */
    units?: 'metric' | 'iec' | 'metric_octet' | 'iec_octet';
    /**
     * A toString function to override the default
     */
    toStringFn?: () => string;
  };

  export default byteSize;
}
