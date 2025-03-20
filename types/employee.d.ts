export interface Employee {
  id: number;
  status: "Active" | "Inactive";
  userName: string;
  storeName: string;
}

export interface DetailedEmployee extends Employee {}

interface EmployeeInvitation {
  status: "Pending" | "Accepted" | "Declined";
  invitedAt: string;
}
