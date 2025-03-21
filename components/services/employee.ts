import { Employee, EmployeeInvitation } from "@/types/employee";
import { apiSlice } from "../apiSlice";

const employeeAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getEmployees: build.query<Employee[], GetEmployeesArg>({
      query: ({ storeId }) => ({ url: `/stores/${storeId}/employees` }),
      transformResponse: (data: { data: Employee[] }) => data.data,
      providesTags: [{ type: "Employee", id: "LIST" }],
    }),
    // getEmployee: build.query<Employee, GetEmployeeArg>({}),
    terminateEmployee: build.mutation<any, TerminateEmployeeArg>({
      query: ({ employeeId, storeId }) => ({
        url: `/stores/${storeId}/employees/${employeeId}/terminate`,
        method: "PATCH",
      }),
      async onQueryStarted(
        { employeeId, storeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            employeeAPI.util.updateQueryData(
              "getEmployees",
              { storeId },
              (draft) => {
                const index = draft.findIndex(({ id }) => employeeId);
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              }
            )
          );
        } catch (error) {}
      },
    }),
    getOutgoingInvitations: build.query<
      EmployeeInvitation[],
      GetOutgoingInvitationsArg
    >({
      query: ({ storeId }) => ({ url: `/stores/${storeId}/invitations` }),
      transformResponse: (data: { data: EmployeeInvitation[] }) => data.data,
      providesTags: [{ type: "OutgoingEmployeeInvitation", id: "LIST" }],
    }),
    inviteEmployees: build.mutation<EmployeeInvitation, InviteEmployeesArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}/invitations`,
        method: "POST",
        body,
      }),
      transformResponse: (data: {
        message: string;
        data: EmployeeInvitation;
      }) => data.data,
      invalidatesTags: [{ type: "OutgoingEmployeeInvitation", id: "LIST" }],
    }),
    disinviteEmployee: build.mutation<void, DisinviteEmployeeArg>({
      query: ({ invitationId, storeId }) => ({
        url: `/stores/${storeId}/invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "OutgoingEmployeeInvitation", id: "LIST" }],
    }),
    getIncomingInvitations: build.query<
      EmployeeInvitation[],
      GetIncomingInvitationsArg
    >({
      query: ({ userId }) => ({ url: `/profiles/${userId}/invitations` }),
      transformResponse: (data: { data: EmployeeInvitation[] }) => data.data,
      providesTags: [{ type: "IncomingEmployeeInvitation", id: "LIST" }],
    }),
    acceptInvitation: build.mutation<any, RespondToInvitationArg>({
      query: ({ employeeInvitationId, userId }) => ({
        url: `/profiles/${userId}/invitations/${employeeInvitationId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "IncomingEmployeeInvitation", id: "LIST" }],
    }),
    declineInvitation: build.mutation<any, RespondToInvitationArg>({
      query: ({ employeeInvitationId, userId }) => ({
        url: `/profiles/${userId}/invitations/${employeeInvitationId}/decline`,
        method: "PATCH",
        invalidatesTags: [{ type: "IncomingEmployeeInvitation", id: "LIST" }],
      }),
    }),
    getUserByEmail: build.query<
      { id: number; fullName: string },
      GetUserByEmailArg
    >({
      query: (params) => ({
        url: `/user/search-by-email`,
        params,
      }),
      transformResponse: (data: { data: { id: number; fullName: string } }) =>
        data.data,
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useTerminateEmployeeMutation,
  useGetOutgoingInvitationsQuery,
  useInviteEmployeesMutation,
  useDisinviteEmployeeMutation,
  useGetIncomingInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useLazyGetUserByEmailQuery,
} = employeeAPI;

interface GetEmployeesArg {
  storeId: number;
}

interface TerminateEmployeeArg extends GetEmployeesArg {
  employeeId: number;
}

type GetOutgoingInvitationsArg = GetEmployeesArg;

interface InviteEmployeesArg extends GetEmployeesArg {
  userIds: number[];
}

interface DisinviteEmployeeArg extends GetEmployeesArg {
  invitationId: number;
}

interface GetIncomingInvitationsArg {
  userId: number;
}

interface RespondToInvitationArg {
  userId: number;
  employeeInvitationId: number;
}

interface GetUserByEmailArg {
  email: string;
}
