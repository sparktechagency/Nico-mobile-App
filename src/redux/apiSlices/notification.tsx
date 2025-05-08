import { api } from "../api/baseApi";


export const notification = api.injectEndpoints({
    endpoints: builder => ({
        getAuthuserNotification: builder.query({
            query: () => ({
                url: `/notifications`,
            }),
            providesTags: ['notificasion'],
        }),

        readNotification: builder.mutation({
            query: ({ id }) => {

                return { // ✅ then return the object
                    url: `/mark-notification/${id}`,
                    method: 'POST',
                };
            },
            invalidatesTags: ['notificasion'],
        }),



    }),
    overrideExisting: false,
});

export const { useGetAuthuserNotificationQuery, useReadNotificationMutation } = notification;