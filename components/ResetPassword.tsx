import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomModal from "./CustomModal";
import api from "@/api/api";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ResetPassword = ({
                         isOpen,
                         onClose,
                         onSubmit,
                         email,
                       }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  email: string;
}) => {
  const passwordValidationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
          message:
              "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        }),
    confirmPassword: Yup.string()
        .required("Confirm Password is required.")
        .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        password,
        confirmPassword,
      });
      toast.success(response.data.message || "Password reset successfully!");
      onSubmit();
      onClose();
    } catch (error: any) {
      toast.error(
          error.response?.data?.message || "Failed to reset the password."
      );
    }
  };

  return (
      <CustomModal isOpen={isOpen} onClose={onClose} title="Reset Password">
        <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={passwordValidationSchema}
            onSubmit={(values) => handleResetPassword(values.password, values.confirmPassword)}
        >
          {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                  />
                  {errors.password && touched.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </Form>
          )}
        </Formik>
      </CustomModal>
  );
};

export default ResetPassword;

