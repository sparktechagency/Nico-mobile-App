import { api } from "../api/baseApi";

export const TicketApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getTickets: builder.query({
            query: () => ({
                url: `/ticket-list`,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetTicketsQuery } = TicketApiSlice;