import {api} from '../api/baseApi';

export const AuthApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    // login
    uselogdin: builder.mutation({
      query: data => {
        return {
          url: `/auth/login`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['auth'],
    }),

    // signUp
    usesignUp: builder.mutation({
      query: data => ({
        url: `/auth/signup`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),

    // EKTA OTP FORM NIYE VERIFY KORBE
    verifyOTP: builder.mutation({
      query: data => {
        console.log('from rtk: ', data);
        return {
          url: `/auth/verify`,
          method: 'POST',
          body: data,
        };
      },
    }),

    // resend OTP
    resendOTP: builder.mutation({
      query: data => ({
        url: `/auth/resend-otp`,
        method: 'POST',
        body: data,
      }),
    }),

    // EKTA EMAIL- NIYE VERIFY KORBE
    forgetPassword: builder.mutation({
      query: data => ({
        url: `/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // reset Password
    resetpassword: builder.mutation({
      query: data => {
        return {
          url: `/auth/reset-password`,
          method: 'POST',
          body: data,
        };
      },
    }),

    // change passowrd
    changePassword: builder.mutation({
      query: data => {
        return {
          url: `/auth/change-password`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['auth'],
    }),

    // get profile
    getOwnProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
      }),
      providesTags: ['auth'],
    }),

    updateProfile: builder.mutation({
      query: formData => ({
        url: '/auth/profile-update',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['auth'],
    }),
  }),
});

export const {
  useUselogdinMutation,
  useUsesignUpMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgetPasswordMutation,
  useChangePasswordMutation,
  useGetOwnProfileQuery,
  useResetpasswordMutation,
  useUpdateProfileMutation,
} = AuthApiSlice;
