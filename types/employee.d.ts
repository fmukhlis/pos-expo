export interface Employee {
  id: number;
  status: "Active" | "Inactive";
  userName: string;
  storeName: string;
}

interface EmployeeInvitation extends Omit<EmployeeProps, "status"> {
  status: "Pending" | "Accepted" | "Declined";
  invitedAt: string;
}
