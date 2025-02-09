"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomModal from "./CustomModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EnterOtp = ({
                    isOpen,
                    onClose,
                    onSubmit,
                    email,
                  }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  email: string;
}) => {
  const otpValidationSchema = Yup.object({
    otp: Yup.string()
        .required("OTP is required.")
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(6, "Must be exactly 6 digits")
        .max(6, "Must be exactly 6 digits"),
  });

  return (
      <CustomModal isOpen={isOpen} onClose={onClose} title="Enter OTP">
        <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={(values) => onSubmit(values.otp)}
        >
          {({ errors, touched }) => (
              <Form className="space-y-4">
                <p className="text-sm text-gray-600">
                  An OTP has been sent to {email}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Field
                      as={Input}
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                  />
                  {errors.otp && touched.otp && (
                      <p className="text-sm text-red-500">{errors.otp}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
              </Form>
          )}
        </Formik>
      </CustomModal>
  );
};

export default EnterOtp;

