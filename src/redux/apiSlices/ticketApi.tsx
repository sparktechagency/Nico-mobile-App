import { api } from "../api/baseApi";

export const TicketApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        // getTickets: builder.query({
        //     query: () => ({
        //         url: `/ticket-list`,
        //     }),

        //     providesTags: ['ticket'],
        // }),
        getTickets: builder.query({
            query: ({ search } = {}) => {
                const url = search ? `/ticket-list?search=${encodeURIComponent(search)}` : '/ticket-list';
                return {
                    url,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            },
            providesTags: ['ticket'],
        }),

        createATicket: builder.mutation({
            query: (data) => ({
                url: `/create-ticket`,
                method: 'POST',
                body: data,
            }),

            invalidatesTags: ['ticket'],
        })
    }),
    overrideExisting: false,
});

export const { useGetTicketsQuery, useCreateATicketMutation } = TicketApiSlice;