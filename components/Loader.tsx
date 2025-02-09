"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loader({
                                   message = "Loading...",
                               }: {
    message?: string;
}) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] bg-gradient-to-b from-white to-gray-50">
            <motion.div
                className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </motion.div>
            <motion.p
                className="mt-6 text-lg font-semibold text-gray-700 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    delay: 0.2,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                {message}
            </motion.p>
        </div>
    );
}
