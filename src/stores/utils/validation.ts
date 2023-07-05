export function checkStoreStatusGroup(
  status: StoreStatus,
  type: StoreStatus[],
): boolean {
  return type.includes(status);
}

export function checkMenuStatusChangeCondition(
  fromStatus: MenuStatus,
  toStatus: MenuStatus,
): boolean {
  if (fromStatus === ('REGISTERED' || 'CLOSED') && toStatus === 'OPEN') {
    return true;
  }
  if (fromStatus === 'OPEN' && toStatus === 'CLOSED') {
    return true;
  }
  if (fromStatus === ('REGISTERED' || 'OPEN' || 'CLOSED')
    && toStatus === 'DELETED') {
    return true;
  }
  return false;
}
