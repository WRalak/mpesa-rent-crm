export type EritsSummary = {
  grossRent: number;
  taxRate: number;
  taxDue: number;
};

export function calculateMonthlyRentalIncomeTax(grossRent: number): EritsSummary {
  const taxRate = 0.075;
  const taxDue = Number((grossRent * taxRate).toFixed(2));

  return {
    grossRent: Number(grossRent.toFixed(2)),
    taxRate,
    taxDue,
  };
}
