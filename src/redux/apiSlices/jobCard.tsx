import { api } from "../api/baseApi";

export const JobCardApis = api.injectEndpoints({
    endpoints: builder => ({
        getjobcard: builder.query({
            query: ({ page = 1, per_page = 10 }) => ({
                url: `/inspection-list`,
                method: 'GET',
                params: { page, per_page }
            }),

        }),
    }),
    overrideExisting: false,
});

export const { useGetjobcardQuery } = JobCardApis;