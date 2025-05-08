import { api } from '../api/baseApi';

interface GetAllTechnicianParams {
    id?: number; // ✅ Make id optional
}

export const MessageApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllTechnician: builder.query<any, GetAllTechnicianParams | void>({
            query: (params) => {
                const baseUrl = '/search-new-user?role=technician';
                const url = params?.id ? `${baseUrl}&organization_id=${params.id}` : baseUrl;
                return {
                    url,
                    method: 'GET',
                };
            },
        }),

        getOrganization: builder.query({
            query: () => ({
                url: '/get-organization',
                method: 'GET',
            }),
        }),


    }),
    overrideExisting: false,
});

export const { useGetAllTechnicianQuery, useGetOrganizationQuery } = MessageApiSlice;
