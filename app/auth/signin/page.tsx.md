# SignIn Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. Formik and Yup Integration](#3-formik-and-yup-integration)
* [4. Password Visibility Toggle](#4-password-visibility-toggle)
* [5. Authentication Flow](#5-authentication-flow)
* [6. API Interactions](#6-api-interactions)
* [7. Error Handling](#7-error-handling)
* [8. Loading State](#8-loading-state)
* [9. Conditional Rendering](#9-conditional-rendering)


## 1. Overview

The `SignIn` component is a React component responsible for handling user login functionality. It uses Formik for form management, Yup for validation, and integrates with a backend API for authentication.  The component also manages the flow for password reset, guiding the user through email submission, OTP verification, and password reset.

## 2. Component Structure

The `SignIn` component is structured as follows:

| Section         | Description                                                                     |
|-----------------|---------------------------------------------------------------------------------|
| Main Container  | A flex container dividing the screen into login form and background image.       |
| Login Form      | Contains the login form managed by Formik, including email and password fields. |
| Background Image | A visually appealing background image displayed on larger screens.                 |
| Modals          | Separate components (`EnterEmail`, `EnterOtp`, `ResetPassword`) for a step-by-step password reset process. |


## 3. Formik and Yup Integration

Formik manages the form state, validation, and submission.  Yup defines the validation schema for the email and password fields.

**Validation Schema (`validationSchema`):**

| Field     | Validation Rules                                                                  |
|-----------|--------------------------------------------------------------------------------------|
| `email`   | Required, valid email format                                                        |
| `password` | Required, minimum 8 characters, at least one uppercase, one lowercase, and one number |


Formik's `onSubmit` prop is bound to the `handleSubmit` function, which handles the API call for login.

## 4. Password Visibility Toggle

The password field includes a toggle button to show or hide the password using the `showPassword` state variable.  The button dynamically displays either an eye icon (`AiOutlineEye`) or a hidden eye icon (`AiOutlineEyeInvisible`) depending on the state.

## 5. Authentication Flow

The authentication flow is handled through a series of functions and modal components:

1. **Login:** The user enters their email and password and submits the form.
2. **Forgot Password:** Clicking "Forgot your password?" opens the `EnterEmail` modal.
3. **Email Submission:** Submitting the email in `EnterEmail` sends an OTP to the email address (using `/auth/send-otp` API endpoint) and opens the `EnterOtp` modal.
4. **OTP Submission:** Submitting the OTP in `EnterOtp` opens the `ResetPassword` modal.
5. **Password Reset:** Submitting the form in `ResetPassword` simulates a password reset and closes the modal.


## 6. API Interactions

The component interacts with the backend API using the `api` object:

* `/auth/login`: POST request for user login using email and password.
* `/auth/send-otp`: POST request to send an OTP to the specified email.


## 7. Error Handling

Error handling is implemented using `try...catch` blocks within the `handleSubmit`, `handleEmailSubmit` functions.  Error messages from the API are displayed using `react-hot-toast`. If there's no specific message from the API, a generic "Login failed." or "Failed to send OTP" message is shown.


## 8. Loading State

A loading state (`isLoading`) is managed using `useState`. While the API requests are in progress, a `Loader` component is displayed.  The submit button text changes to "Signing In..." during the loading state.

## 9. Conditional Rendering

The component conditionally renders the `Loader` component based on the `isLoading` state.  The background image is displayed only on larger screens (`lg:block`).  The password reset modals are rendered conditionally based on their respective state variables (`isEmailModalOpen`, `isOtpModalOpen`, `isResetModalOpen`).
