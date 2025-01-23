import { View, Text } from "react-native";
import React from "react";
import axios from "axios";
import api from "@/utils/api";
import { useStore } from "@/contexts/StoreContext";
import { useSession } from "@/contexts/SessionContext";
import {
  EmployeeInvitationProps,
  EmployeeProps,
} from "@/contexts/EmployeeContext";

export default function useEmployeeAPI() {
  const { selectedStore } = useStore();
  const { session: bearerToken } = useSession();

  const getUserByEmail = async (param: GetUserByEmailParam) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.get("/user/search-by-email", {
        headers: {
          Authorization: "Bearer " + bearerToken,
        },
        params: param.data,
      });
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const getEmployees = async (param: GetEmployeesParam) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.get(
        "/stores/" + selectedStore?.id + "/employees",
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const inviteEmployees = async (param: InviteEmployeesParam) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.post(
        "/stores/" + selectedStore?.id + "/invitations",
        param.data,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const disinviteEmployee = async (param: DisinviteEmployeeParam) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.delete(
        "/stores/" + selectedStore?.id + "/invitations/" + param.invitationId,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param.onSuccess) {
        param.onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const getIncomingEmployeeInvitations = async (
    param: GetIncomingEmployeeInvitationsParam
  ) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.get(
        "/profiles/" + param.userId + "/invitations",
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const getOutgoingEmployeeInvitations = async (
    param: GetOutgoingEmployeeInvitationsParam
  ) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.get(
        "/stores/" + selectedStore?.id + "/invitations",
        { headers: { Authorization: "Bearer " + bearerToken } }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const acceptEmployeeInvitation = async (
    param: AcceptEmployeeInvitationParam
  ) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.patch(
        "/profiles/" +
          param.userId +
          "/invitations/" +
          param.employeeInvitationId +
          "/accept",
        {},
        { headers: { Authorization: "Bearer " + bearerToken } }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const declineEmployeeInvitation = async (
    param: DeclineEmployeeInvitationParam
  ) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.patch(
        "/profiles/" +
          param.userId +
          "/invitations/" +
          param.employeeInvitationId +
          "/decline",
        {},
        { headers: { Authorization: "Bearer " + bearerToken } }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  const terminateEmployee = async (param: TerminateEmployeeParam) => {
    try {
      if (param.onStart) {
        param.onStart();
      }
      const response = await api.patch(
        "/stores/" +
          selectedStore?.id +
          "/employees/" +
          param.employeeId +
          "/terminate",
        {},
        { headers: { Authorization: "Bearer " + bearerToken } }
      );
      if (param.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param.onFinish) {
        param.onFinish();
      }
    }
  };

  return {
    acceptEmployeeInvitation,
    declineEmployeeInvitation,
    disinviteEmployee,
    getEmployees,
    getIncomingEmployeeInvitations,
    getOutgoingEmployeeInvitations,
    getUserByEmail,
    inviteEmployees,
    terminateEmployee,
  };
}

interface BasicAsyncFunctionParam {
  onFailed?: (errorMessage: string) => void;
  onStart?: () => void;
  onFinish?: () => void;
}

interface GetEmployeesParam extends BasicAsyncFunctionParam {
  onSuccess?: (employees: EmployeeProps[]) => void;
}

interface InviteEmployeesParam extends BasicAsyncFunctionParam {
  onSuccess?: (employeeInvitations: EmployeeInvitationProps[]) => void;
  data: {
    userIds: number[];
  };
}

interface DisinviteEmployeeParam extends BasicAsyncFunctionParam {
  onSuccess?: () => void;
  invitationId?: number | null | undefined;
}

interface ManageEmployeeParam extends BasicAsyncFunctionParam {
  onSuccess?: (employee: EmployeeProps) => void;
}

interface GetIncomingEmployeeInvitationsParam extends BasicAsyncFunctionParam {
  userId: number;
  onSuccess?: (employeeInvitations: EmployeeInvitationProps[]) => void;
}

interface GetOutgoingEmployeeInvitationsParam extends BasicAsyncFunctionParam {
  storeId: number;
  onSuccess?: (employeeInvitations: EmployeeInvitationProps[]) => void;
}

interface ManageEmployeeInvitationParam extends BasicAsyncFunctionParam {
  onSuccess?: (employeeInvitation: EmployeeInvitationProps) => void;
}

interface GetUserByEmailParam extends BasicAsyncFunctionParam {
  onSuccess?: (user: { id: number; fullName: string }) => void;
  data?:
    | {
        email: string;
      }
    | null
    | undefined;
}

interface AcceptEmployeeInvitationParam extends BasicAsyncFunctionParam {
  userId: number;
  employeeInvitationId: number;
  onSuccess?: (employeeInvitation: EmployeeInvitationProps) => void;
}

interface DeclineEmployeeInvitationParam extends BasicAsyncFunctionParam {
  userId: number;
  employeeInvitationId: number;
  onSuccess?: (employeeInvitation: EmployeeInvitationProps) => void;
}

interface TerminateEmployeeParam extends BasicAsyncFunctionParam {
  employeeId: number;
  onSuccess?: (employee: EmployeeProps) => void;
}
