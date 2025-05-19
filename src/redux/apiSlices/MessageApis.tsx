import { api } from '../api/baseApi';

interface GetAllTechnicianParams {
    id?: number; // ✅ Make id optional
    search?: string;
    role?: string;
}

export const MessageApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllTechnician: builder.query<any, { role: string; search?: string; organization_id?: string }>({
            query: (params) => {
                const searchParams = new URLSearchParams();

                // Required parameter
                searchParams.append('role', params.role);

                // Optional parameters
                if (params.search) {
                    searchParams.append('search', params.search);
                }
                if (params.organization_id) {
                    searchParams.append('organization_id', params.organization_id);
                }

                const url = `/search-new-user?${searchParams.toString()}`;
                console.log('API Request:', url);

                return {
                    url,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            },
            providesTags: ['Technicians'],
        }),


        getOrganization: builder.query({
            query: () => ({
                url: '/get-organization',
                method: 'GET',
            }),
        }),

        sendMessage: builder.mutation<any, any>({
            query: (data) => ({
                url: '/send-message',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['message'],
        }),

        getMessageByreciverId: builder.query<any, any>({
            query: ({ id, page, per_page }) => {
                const params = new URLSearchParams({
                    receiver_id: id,
                    per_page: '9999999',
                    page: page.toString(),
                });
                return {
                    url: `/get-message?${params.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['message'],
        }),


        getAuthUserChatlist: builder.query<any, { search: string }>({
            query: ({ search }) => {
                const searchParams = new URLSearchParams();
                if (search) {
                    searchParams.append('search', search);
                }
                const url = `/chat-list?${searchParams.toString()}`;
                return {
                    url,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            },
        })



    }),
    overrideExisting: false,
});

export const { useGetAllTechnicianQuery, useGetOrganizationQuery, useSendMessageMutation, useGetMessageByreciverIdQuery, useGetAuthUserChatlistQuery } = MessageApiSlice;
