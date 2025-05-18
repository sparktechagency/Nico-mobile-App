import { api } from "../api/baseApi";

export const InspectionSheetApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getInspectionSheet: builder.query({
            query: ({ page = 1, per_page = 10 }) => ({
                url: `/inspection-list`,
                method: 'GET',
                params: { page, per_page }
            }),
            // Only have one cache entry because the arg always maps to one string
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                if (newItems.data.current_page === 1) {
                    return newItems;
                }
                return {
                    ...newItems,
                    data: {
                        ...newItems.data,
                        data: [...(currentCache?.data?.data || []), ...newItems.data.data]
                    }
                };
            },
            // Refetch when the page arg changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),

        getInspactionDetails: builder.query({
            query: ({ id, type }) => ({
                url: `/inspection-details?${type}=${id}`,
                method: 'GET',
            }),
        })
    }),
    overrideExisting: false,
});

export const { useGetInspectionSheetQuery, useGetInspactionDetailsQuery } = InspectionSheetApiSlice;