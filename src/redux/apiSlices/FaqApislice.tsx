import { api } from "../api/baseApi";

export const FaqApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query({
            query: () => ({
                url: '/faq-list',
                method: 'GET',
            }),

        }),

        getPrivacyPolicy: builder.query({
            query: () => ({
                url: '/settings?type=Privacy Policy',
                method: 'GET',
            }),
        }),

        getAboutUs: builder.query({
            query: () => ({
                url: '/settings?type=AboutUs',
                method: 'GET',
            }),
        }),



        // getTermsConditons : builder.query({
        //     query: () => ({
        //         url: '/settings?type=Terms and Condition',
        //         method: 'GET',
        //     }),
        // }),

    }),
});

export const { useGetFaqsQuery,useGetAboutUsQuery,useGetPrivacyPolicyQuery
    
    // useGetPrivacyPolicyQuery, useGetAboutUsQuery, useGetTermsConditonsQuery 

} = FaqApiSlice;
