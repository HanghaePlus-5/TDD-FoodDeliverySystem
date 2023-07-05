export function checkStoreStatusGroup(
  status: StoreStatus,
  type: StoreStatus[],
): boolean {
  return type.includes(status);
}