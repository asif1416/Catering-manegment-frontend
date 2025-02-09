"use client";

import Image from "next/image";
import loginBG from "@/public/images/loginBg.png";
import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import EnterEmail from "@/components/EnterEmail";
import EnterOtp from "@/components/EnterOtp";
import ResetPassword from "@/components/ResetPassword";
import api from "@/api/api";
import {useAuthStore} from "@/store/auth-store";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Loader from "@/components/Loader";

const validationSchema = Yup.object({
    email: Yup.string()
        .required("Email is required.")
        .email("Invalid email format."),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        }),
});

const SignIn = () => {
    const login = useAuthStore((state) => state.login);
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    const router = useRouter();

    const handleSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        const {email, password} = values;
        try {
            const response = await api.post("/auth/login", {email, password});
            toast.success(response.data.message);
            login();
            setEmail(email);
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsEmailModalOpen(true);
    };

    const handleEmailSubmit = async (submittedEmail: string) => {
        try {
            setEmail(submittedEmail);
            setIsEmailModalOpen(false);
            setIsOtpModalOpen(true);
            const response = await api.post("/auth/send-otp", {
                email,
            });
            toast.success(response.data.message || "OTP sent successfully.");
        } catch {
            toast.error("Failed to send OTP");
        }
    };

    const handleOtpSubmit = () => {
        setIsOtpModalOpen(false);
        setIsResetModalOpen(true);
    };

    const handleResetSubmit = () => {
        setIsResetModalOpen(false);
        toast.success("Password reset successfully!");
    };

    if (isLoading) {
        return <Loader/>;
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Formik
                            initialValues={{email: "", password: ""}}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({errors, touched}) => (
                                <Form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Field
                                                as={Input}
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500"/>
                                                ) : (
                                                    <AiOutlineEye className="w-5 h-5 text-gray-500"/>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <p className="text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing In..." : "Sign In"}
                                    </Button>

                                    <div className="text-sm text-center text-gray-600">
                                        <p className="mb-2">
                                            <Button
                                                variant="link"
                                                className="p-0"
                                                onClick={handleForgotPassword}
                                            >
                                                Forgot your password?
                                            </Button>
                                        </p>
                                        <p>
                                            Don't have an account?{" "}
                                            <Link
                                                href="/auth/signup"
                                                className="text-primary hover:underline"
                                            >
                                                Sign Up
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </div>

            <div className="w-1/2 relative hidden lg:block">
                <Image
                    src={loginBG || "/placeholder.svg"}
                    alt="Culinary Odyssey Background"
                    className="object-cover"
                    fill
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12">
                    <h1 className="text-4xl font-bold text-white text-center">
                        CULINARY ODYSSEY
                    </h1>
                    <p className="text-white/90 text-center">
                        A Catering management System
                    </p>
                </div>
            </div>

            <EnterEmail
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSubmit={handleEmailSubmit}
            />

            <EnterOtp
                email={email}
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
            />

            <ResetPassword
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onSubmit={handleResetSubmit}
                email={email}
            />
        </div>
    );
};

export default SignIn;

