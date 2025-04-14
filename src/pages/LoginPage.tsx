import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/components/AuthContext";


const formSchema = z.object({
    email: z.string().email().min(1).max(50),
    password: z.string().min(8).max(50),
});

export default function LoginPage() {
    const { login } = useAuth();  // <-- Grab the login function
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await login(values.email, values.password);
        } catch (error) {
            form.setError("email", { message: "Invalid email or password" });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Label className="text-5xl font-bold mb-6 text-white">Gulag Login</Label>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
                    {/* Email field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full py-3 text-lg font-semibold text-white transition-all">Login</Button>
                </form>
            </Form>

            {/* Not implemented these features below, for fun */}
            <div className="flex items-center justify-center mt-4">
                <Button variant="link" className="text-sm text-gray-400 hover:text-gray-200" onClick={() => alert("Not implemented yet, please create account through our website")}>
                    Sign up
                </Button>
                <Label>or</Label>
                <Button variant="link" className="text-sm text-gray-400 hover:text-gray-200" onClick={() => alert("Not implemented yet, please get it through our website")}>
                    Forgot password?
                </Button>
            </div>
        </div>
    );
}