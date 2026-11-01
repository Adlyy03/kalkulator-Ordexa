import {
  calculatePackageRevenue,
  calculateMRR,
  calculateARR,
  calculateARPA,
  calculateTotalRestaurants,
  calculateRevenue
} from '../../engine/revenue';

describe('Revenue Engine', () => {
  describe('calculatePackageRevenue', () => {
    it('should calculate package revenue', () => {
      expect(calculatePackageRevenue(10, 199000)).toBe(1990000);
      expect(calculatePackageRevenue(5, 99000)).toBe(495000);
    });

    it('should handle zero restaurants', () => {
      expect(calculatePackageRevenue(0, 199000)).toBe(0);
    });

    it('should handle zero price', () => {
      expect(calculatePackageRevenue(10, 0)).toBe(0);
    });
  });

  describe('calculateMRR', () => {
    it('should calculate MRR from packages', () => {
      const packages = [
        { name: 'Basic', monthlyPrice: 99000, restaurantCount: 10 },
        { name: 'Pro', monthlyPrice: 199000, restaurantCount: 5 }
      ];
      expect(calculateMRR(packages)).toBe(1985000);
    });

    it('should include other recurring revenue', () => {
      const packages = [
        { name: 'Basic', monthlyPrice: 99000, restaurantCount: 10 }
      ];
      expect(calculateMRR(packages, 100000)).toBe(1090000);
    });

    it('should handle empty packages', () => {
      expect(calculateMRR([])).toBe(0);
    });
  });

  describe('calculateARR', () => {
    it('should multiply MRR by 12', () => {
      expect(calculateARR(1000000)).toBe(12000000);
      expect(calculateARR(500000)).toBe(6000000);
    });

    it('should handle zero MRR', () => {
      expect(calculateARR(0)).toBe(0);
    });
  });

  describe('calculateARPA', () => {
    it('should calculate average revenue per account', () => {
      expect(calculateARPA(1990000, 10)).toBe(199000);
      expect(calculateARPA(500000, 5)).toBe(100000);
    });

    it('should return N/A for zero restaurants', () => {
      expect(calculateARPA(1000000, 0)).toBe('N/A');
    });
  });

  describe('calculateTotalRestaurants', () => {
    it('should sum all restaurant counts', () => {
      const packages = [
        { name: 'Basic', monthlyPrice: 99000, restaurantCount: 10 },
        { name: 'Pro', monthlyPrice: 199000, restaurantCount: 5 },
        { name: 'Enterprise', monthlyPrice: 399000, restaurantCount: 2 }
      ];
      expect(calculateTotalRestaurants(packages)).toBe(17);
    });

    it('should handle empty packages', () => {
      expect(calculateTotalRestaurants([])).toBe(0);
    });
  });

  describe('calculateRevenue (full)', () => {
    it('should calculate complete revenue metrics', () => {
      const packages = [
        { name: 'Basic', monthlyPrice: 99000, restaurantCount: 10 },
        { name: 'Pro', monthlyPrice: 199000, restaurantCount: 5 }
      ];
      
      const result = calculateRevenue(packages);
      
      expect(result.packageRevenues.Basic).toBe(990000);
      expect(result.packageRevenues.Pro).toBe(995000);
      expect(result.totalMRR).toBe(1985000);
      expect(result.totalARR).toBe(23820000);
      expect(result.totalRestaurants).toBe(15);
      expect(result.arpa).toBe(132333.33333333334);
    });

    it('should handle zero revenue scenario', () => {
      const result = calculateRevenue([]);
      
      expect(result.totalMRR).toBe(0);
      expect(result.totalARR).toBe(0);
      expect(result.totalRestaurants).toBe(0);
      expect(result.arpa).toBe('N/A');
    });
  });
});
