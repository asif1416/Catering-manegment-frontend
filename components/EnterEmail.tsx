"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomModal from "./CustomModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EnterEmail = ({isOpen,onClose,onSubmit,}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}) => {
    const emailValidationSchema = Yup.object({
        email: Yup.string()
            .required("Email is required.")
            .email("Invalid email format."),
    });

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Enter Email">
            <Formik
                initialValues={{ email: "" }}
                validationSchema={emailValidationSchema}
                onSubmit={(values) => onSubmit(values.email)}
            >
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Enter Email</Label>
                            <Field
                                as={Input}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                            {errors.email && touched.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Send OTP
                        </Button>
                    </Form>
                )}
            </Formik>
        </CustomModal>
    );
};

export default EnterEmail;

