'use client';
import Image from "next/image";
import loginBG from "@/public/images/loginBg.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';
import EnterOtp from "@/components/EnterOtp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import api from "@/api/api";

const validationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required.")
        .min(4, "Name length must be at least 4 characters."),
    email: Yup.string()
        .required("Email is required.")
        .email("Invalid email format.")
        .max(50, "Email must be no more than 50 characters."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .max(50, "Password must be no more than 50 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        }),
    confirmPassword: Yup.string()
        .required("Confirm password is required.")
        .oneOf([Yup.ref("password"), ""], "Passwords don't match."),
});

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/auth/signin");
    };

    const handleSignUp = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
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

    const handleOtpSubmit = async (otp: string) => {
        try {
            await api.post("/auth/verify-otp", { otp: parseInt(otp, 10), email: email });
            toast.success("OTP verified successfully!");
            setIsOtpModalOpen(false);
            router.push("/auth/signin");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "OTP verification failed.");
        }
    };

    return isLoading ? (
        <Loader />
    ) : (
        <div className="flex min-h-screen">
            <div className="w-1/2 relative hidden lg:block">
                <Image
                    src={loginBG || "/placeholder.svg"}
                    alt="Culinary Odyssey Background"
                    className="object-cover"
                    fill
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12">
                    <h1 className="text-4xl font-bold text-white text-center">CULINARY ODYSSEY</h1>
                    <p className="text-white/90 text-center">A Catering Management System</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSignUp}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full name</Label>
                                        <Field as={Input} id="name" name="name" type="text" placeholder="Enter your name" />
                                        {errors.name && touched.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Field as={Input} id="email" name="email" type="email" placeholder="Enter your email" />
                                        {errors.email && touched.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Field
                                                as={Input}
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeClosed className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <p className="text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Re-enter Password</Label>
                                        <div className="relative">
                                            <Field
                                                as={Input}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeClosed className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing Up..." : "Sign Up"}
                                    </Button>

                                    <div className="text-sm text-center text-gray-600">
                                        Already a user?{" "}
                                        <Button variant="link" className="p-0" onClick={handleSignIn}>
                                            Sign in
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </div>

            <EnterOtp
                email={email}
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
            />
        </div>
    );
};

export default SignUp;
