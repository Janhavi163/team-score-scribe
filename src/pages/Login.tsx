
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import Layout from "@/components/layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<UserRole>("student");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole);
    setEmail("");
    setPassword("");
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Log in to access your account
            </CardDescription>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {activeTab === "student" && (
                    <div className="text-sm text-muted-foreground">
                      Demo: student1@college.edu / student1
                    </div>
                  )}
                  {activeTab === "teacher" && (
                    <div className="text-sm text-muted-foreground">
                      Demo: teacher1@college.edu / teacher1
                    </div>
                  )}
                  {activeTab === "admin" && (
                    <div className="text-sm text-muted-foreground">
                      Demo: admin@college.edu / admin123
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Log In
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-muted-foreground text-center mt-2">
              {activeTab === "student" ? (
                <>Don't have a team yet? Register your team after logging in.</>
              ) : (
                <>Use your institution provided credentials to login.</>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
