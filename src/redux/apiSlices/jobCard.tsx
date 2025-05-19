import { api } from "../api/baseApi";

export const JobCardApis = api.injectEndpoints({
    endpoints: builder => ({
        getjobcard: builder.query({
            query: ({ page = 1, per_page = 10 }) => ({
                url: `/card-list`,
                method: 'GET',
                params: { page, per_page }
            }),

            providesTags: ['jobcard'],


        }),





        // getInspectionSheet: builder.query({
        //     query: ({ page = 1, per_page = 10, search }) => {
        //         const params = { page, per_page };
        //         if (search) {
        //             params.search = search;
        //         }

        //         return {
        //             url: '/inspection-list',
        //             method: 'GET',
        //             params, // this will include search, page, and per_page
        //         };
        //     },
        //     serializeQueryArgs: ({ endpointName }) => endpointName,
        //     merge: (currentCache, newItems) => {
        //         if (newItems.data.current_page === 1) {
        //             return newItems;
        //         }
        //         return {
        //             ...newItems,
        //             data: {
        //                 ...newItems.data,
        //                 data: [...(currentCache?.data?.data || []), ...newItems.data.data],
        //             },
        //         };
        //     },
        //     forceRefetch({ currentArg, previousArg }) {
        //         return currentArg !== previousArg;
        //     },
        // }),


        getSingleJobCard: builder.query({
            query: (id) => ({
                url: `/card-details/${id}`,
                method: 'GET',
            }),

            providesTags: ['jobcard'],
        }),
        updateJobCard: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/update-card/${id}`,
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['jobcard'],

        }),


    }),
    overrideExisting: false,
});

export const { useGetjobcardQuery, useGetSingleJobCardQuery, useUpdateJobCardMutation } = JobCardApis;