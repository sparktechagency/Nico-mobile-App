import { api } from "../api/baseApi";

export const FaqApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => ({
        url: '/faq_list',
        method: 'GET', // 👈 optional but good to add
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetFaqsQuery } = FaqApiSlice;
