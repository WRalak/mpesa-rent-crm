interface PaymentData {
  amount: number;
  paidAt: Date;
  tenantId: string;
  status: string;
}

interface PropertyMetrics {
  propertyId: string;
  occupancyRate: number;
  averageRent: number;
  totalRevenue: number;
  latePaymentRate: number;
}

interface PredictionData {
  nextMonthRevenue: number;
  defaultRisk: number;
  recommendedRentAdjustment: number;
  marketTrend: 'increasing' | 'decreasing' | 'stable';
}

export class AnalyticsEngine {
  static calculateOccupancyRate(tenants: number, totalUnits: number): number {
    return totalUnits > 0 ? (tenants / totalUnits) * 100 : 0;
  }

  static calculateLatePaymentRate(payments: PaymentData[]): number {
    const latePayments = payments.filter(payment => {
      if (!payment.paidAt) return false;
      const dueDate = new Date(payment.paidAt);
      dueDate.setDate(dueDate.getDate() + 5); // Assuming 5-day grace period
      return payment.paidAt > dueDate;
    });
    
    return payments.length > 0 ? (latePayments.length / payments.length) * 100 : 0;
  }

  static predictNextMonthRevenue(historicalData: PaymentData[]): number {
    if (historicalData.length < 3) return 0;

    // Simple moving average with trend analysis
    const recentMonths = this.groupByMonth(historicalData).slice(-3);
    const revenues = recentMonths.map(month => 
      month.reduce((sum, payment) => sum + payment.amount, 0)
    );

    // Calculate trend
    const trend = this.calculateTrend(revenues);
    const lastMonthRevenue = revenues[revenues.length - 1];
    
    // Apply trend prediction
    return Math.max(0, lastMonthRevenue + (lastMonthRevenue * trend));
  }

  static assessDefaultRisk(tenantPayments: PaymentData[]): number {
    if (tenantPayments.length < 2) return 0;

    const latePayments = tenantPayments.filter(payment => {
      if (!payment.paidAt) return false;
      const dueDate = new Date(payment.paidAt);
      dueDate.setDate(dueDate.getDate() + 5);
      return payment.paidAt > dueDate;
    });

    const latePaymentRate = latePayments.length / tenantPayments.length;
    
    // Risk factors
    let riskScore = latePaymentRate * 100;
    
    // Increase risk if recent late payments
    const recentLatePayments = latePayments.slice(-2);
    if (recentLatePayments.length > 0) {
      riskScore += 20;
    }

    return Math.min(100, Math.max(0, riskScore));
  }

  static recommendRentAdjustment(
    currentRent: number, 
    marketData: number[], 
    occupancyRate: number
  ): number {
    const marketAverage = marketData.reduce((sum, rent) => sum + rent, 0) / marketData.length;
    
    let adjustment = 0;

    // Market-based adjustment
    if (currentRent < marketAverage * 0.9) {
      adjustment = 0.1; // Increase by 10%
    } else if (currentRent > marketAverage * 1.1) {
      adjustment = -0.05; // Decrease by 5%
    }

    // Occupancy-based adjustment
    if (occupancyRate < 80) {
      adjustment -= 0.05; // Reduce rent if low occupancy
    } else if (occupancyRate > 95) {
      adjustment += 0.03; // Increase rent if high demand
    }

    return Math.max(-0.2, Math.min(0.2, adjustment)); // Cap at ±20%
  }

  static analyzeMarketTrend(revenueData: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (revenueData.length < 3) return 'stable';

    const trend = this.calculateTrend(revenueData);
    
    if (trend > 0.05) return 'increasing';
    if (trend < -0.05) return 'decreasing';
    return 'stable';
  }

  private static groupByMonth(payments: PaymentData[]): PaymentData[][] {
    const grouped: { [key: string]: PaymentData[] } = {};
    
    payments.forEach(payment => {
      const monthKey = payment.paidAt?.toISOString().slice(0, 7) || 'unknown';
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(payment);
    });

    return Object.values(grouped).sort((a, b) => 
      new Date(a[0].paidAt!).getTime() - new Date(b[0].paidAt!).getTime()
    );
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgY = sumY / n;

    return avgY > 0 ? slope / avgY : 0;
  }
}

export function generatePropertyInsights(metrics: PropertyMetrics): {
  performance: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  alerts: string[];
} {
  const { occupancyRate, averageRent, totalRevenue, latePaymentRate } = metrics;
  
  const recommendations: string[] = [];
  const alerts: string[] = [];
  let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';

  // Occupancy analysis
  if (occupancyRate >= 95) {
    performance = 'excellent';
    recommendations.push("Consider increasing rent due to high demand");
  } else if (occupancyRate >= 85) {
    performance = 'good';
  } else if (occupancyRate >= 70) {
    performance = 'fair';
    recommendations.push("Consider marketing improvements or rent adjustments");
  } else {
    performance = 'poor';
    alerts.push("Low occupancy rate requires immediate attention");
    recommendations.push("Review pricing and marketing strategy");
  }

  // Late payment analysis
  if (latePaymentRate > 20) {
    alerts.push("High late payment rate detected");
    recommendations.push("Implement stricter payment reminders");
  } else if (latePaymentRate > 10) {
    recommendations.push("Consider automated payment reminders");
  }

  // Revenue analysis
  if (totalRevenue > 100000) {
    recommendations.push("Consider expanding property portfolio");
  }

  return { performance, recommendations, alerts };
}
