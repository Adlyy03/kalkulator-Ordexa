import {
  safeDivide,
  formatIDR,
  roundTo,
  percentage,
  parseIDR
} from '../../engine/math';

describe('Math Engine', () => {
  describe('safeDivide', () => {
    it('should divide normally', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(100, 4)).toBe(25);
    });

    it('should return N/A for zero division', () => {
      expect(safeDivide(10, 0)).toBe('N/A');
      expect(safeDivide(0, 0)).toBe('N/A');
    });

    it('should handle negative numbers', () => {
      expect(safeDivide(-10, 2)).toBe(-5);
      expect(safeDivide(10, -2)).toBe(-5);
    });
  });

  describe('formatIDR', () => {
    it('should format Indonesian Rupiah correctly', () => {
      expect(formatIDR(12500000)).toBe('Rp12.500.000');
      expect(formatIDR(1000)).toBe('Rp1.000');
      expect(formatIDR(0)).toBe('Rp0');
    });

    it('should round to nearest integer', () => {
      expect(formatIDR(12500.7)).toBe('Rp12.501');
      expect(formatIDR(12500.3)).toBe('Rp12.500');
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimals', () => {
      expect(roundTo(12.345, 2)).toBe(12.35);
      expect(roundTo(12.344, 2)).toBe(12.34);
      expect(roundTo(12.5, 0)).toBe(13);
    });

    it('should default to 2 decimals', () => {
      expect(roundTo(12.3456)).toBe(12.35);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(1, 4)).toBe(25);
    });

    it('should return N/A for zero whole', () => {
      expect(percentage(10, 0)).toBe('N/A');
    });
  });

  describe('parseIDR', () => {
    it('should parse IDR string to number', () => {
      expect(parseIDR('Rp12.500.000')).toBe(12500000);
      expect(parseIDR('Rp1.000')).toBe(1000);
    });

    it('should handle invalid input', () => {
      expect(parseIDR('invalid')).toBe(0);
      expect(parseIDR('')).toBe(0);
    });
  });
});
