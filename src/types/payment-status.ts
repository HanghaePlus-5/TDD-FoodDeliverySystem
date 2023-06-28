export const PaymentStatus = {
  completed: 'completed',
  canceled: 'canceled',
} as const;
declare global {
  type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];
}
