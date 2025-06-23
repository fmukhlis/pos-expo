export interface PermissionPayload {
  authorizationCode: string;
  refund: boolean;
  modifyBill: boolean;
}

export interface Permission extends PermissionPayload {
  id: number;
}
