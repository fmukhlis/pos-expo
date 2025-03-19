export interface PermissionPayload {
  authorizationCode: string;
  refund: boolean;
  modifyBill: boolean;
}

export interface Permission extends PermissionPayload {
  id: number;
  authorizationCode: string;
  refund: 1 | 0;
  modifyBill: 1 | 0;
}

export interface DetailedPermission extends Permission {}
