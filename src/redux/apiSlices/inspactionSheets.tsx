import { api } from "../api/baseApi";

export const InspectionSheetApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getInspectionSheet: builder.query({
            query: ({ page = 1, per_page = 10, search }) => {
                const params = { page, per_page };
                if (search) {
                    params.search = search;
                }

                return {
                    url: '/inspection-list',
                    method: 'GET',
                    params, // this will include search, page, and per_page
                };
            },
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems) => {
                if (newItems.data.current_page === 1) {
                    return newItems;
                }
                return {
                    ...newItems,
                    data: {
                        ...newItems.data,
                        data: [...(currentCache?.data?.data || []), ...newItems.data.data],
                    },
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),


        getInspactionDetails: builder.query({
            query: ({ id, type }) => ({
                url: `/inspection-details?${type}=${id}`,
                method: 'GET',
            }),
        }),

        updateInspaction: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/update-inspection/${id}`,
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetInspectionSheetQuery, useGetInspactionDetailsQuery, useUpdateInspactionMutation } = InspectionSheetApiSlice;