import { api } from "../api/baseApi";

export const QrApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getQrvalues: builder.query({
            query: ({ id }) => ({
                url: `/qr-scan/${id}`,
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: false,
});


export const { useGetQrvaluesQuery } = QrApiSlice;