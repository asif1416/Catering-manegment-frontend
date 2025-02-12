# SignUp Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. Props](#3-props)
* [4. State Variables](#4-state-variables)
* [5. Functions](#5-functions)
    * [5.1 `handleSignIn`](#51-handlesignin)
    * [5.2 `handleSignUp`](#52-handlesignup)
    * [5.3 `handleOtpSubmit`](#53-handleotpsubmit)
* [6. Validation Schema](#6-validation-schema)


## 1. Overview

The `SignUp` component provides a user interface for new user registration.  It uses Formik for form handling and Yup for validation. Upon successful registration, an OTP verification modal is displayed. The UI is responsive, adapting to different screen sizes.  A background image is displayed on larger screens.

## 2. Component Structure

The component is structured as follows:

1. **Layout:** Uses a flexbox layout to divide the screen into two sections: a background image (on larger screens) and the signup form.
2. **Form:** Uses Formik to manage the form state and submission.  Input fields are validated using Yup's schema.
3. **OTP Modal:** An `EnterOtp` component is rendered as a modal after successful registration, prompting the user to enter an OTP.
4. **Loading Indicator:** A `Loader` component is displayed while API requests are in progress.


## 3. Props

This component does not accept any props.

## 4. State Variables

| Variable Name             | Type                 | Description                                                                        |
|--------------------------|----------------------|------------------------------------------------------------------------------------|
| `showPassword`           | `boolean`            | Controls the visibility of the password input field.                             |
| `showConfirmPassword`    | `boolean`            | Controls the visibility of the confirm password input field.                       |
| `isOtpModalOpen`         | `boolean`            | Controls the visibility of the OTP verification modal.                           |
| `isLoading`              | `boolean`            | Indicates whether an API request is in progress.                               |
| `email`                  | `string`             | Stores the user's email address after successful registration.                  |


## 5. Functions

### 5.1 `handleSignIn`

This function redirects the user to the sign-in page.

```javascript
const handleSignIn = () => {
  router.push("/auth/signin");
};
```

### 5.2 `handleSignUp`

This asynchronous function handles the user signup process. It makes a POST request to the `/auth/register` API endpoint with user credentials.  On success, it displays a success message, opens the OTP modal, and updates the component's state.  On failure, it displays an error message.

```javascript
const handleSignUp = async (values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  setIsLoading(true);
  try {
    const response = await api.post("/auth/register", values);
    toast.success(response.data.message);
    setEmail(values.email);
    setIsOtpModalOpen(true);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Registration failed.");
  } finally {
    setIsLoading(false);
  }
};
```

### 5.3 `handleOtpSubmit`

This asynchronous function handles the OTP submission.  It makes a POST request to the `/auth/verify-otp` API endpoint with the OTP and email. On success, it displays a success message, closes the OTP modal, and redirects the user to the sign-in page. On failure, it displays an error message.

```javascript
const handleOtpSubmit = async (otp: string) => {
  try {
    await api.post("/auth/verify-otp", {
      otp: parseInt(otp, 10),
      email: email,
    });
    toast.success("OTP verified successfully!");
    setIsOtpModalOpen(false);
    router.push("/auth/signin");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "OTP verification failed.");
  }
};
```

## 6. Validation Schema

The `validationSchema` uses Yup to define validation rules for the signup form.

| Field Name       | Rule                     | Description                                                                 |
|-----------------|--------------------------|-----------------------------------------------------------------------------|
| `name`           | `required`, `min(4)`     | Name is required and must be at least 4 characters long.                   |
| `email`          | `required`, `email`, `max(50)` | Email is required, must be a valid email format, and must be no more than 50 characters. |
| `password`       | `required`, `min(8)`, `max(50)`, `matches` | Password is required, must be at least 8 and no more than 50 characters, and must contain at least one uppercase letter, one lowercase letter, and one number. |
| `confirmPassword` | `required`, `oneOf`      | Confirm password is required and must match the password.                   |

The password validation uses a regular expression `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$` to enforce complexity requirements.  This regex ensures that the password contains at least one lowercase letter, one uppercase letter, and one digit.
