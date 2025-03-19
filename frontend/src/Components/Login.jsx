import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Form, Button, Input, Card, Typography, message } from "antd";
import UserController from "../Services/UserController";
import state from "../State/state";

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        setLoading(true);
        
        if (values.email === "admin@gmail.com" && values.password === "admin123") {
            navigate("/admindashboard");
        } else {
            try {
                const response = await UserController.loginUser(values);
                if (response) {
                    navigate("/dashboard");
                    state.currentUser = response.user;
                    state.token = response.token;
                    localStorage.setItem("user", JSON.stringify(state.currentUser));
                    localStorage.setItem("token", state.token);
                } else {
                    message.error("Invalid username or password");
                }
            } catch (error) {
                console.error("Error while logging in:", error);
                message.error("Login failed");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F0F8FF",
            }}
        >
            <Card
                hoverable
                style={{
                    width: 400,
                    height: 350,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    minHeight: "500px",
                    width: "900px",
                    borderRadius: "15px",

                }}
            >
                <Flex justify="space-between" align="center" style={{ height: "100%" }}>
                    {/* Left Side - Login Form */}
                    <Flex
                        vertical
                        style={{
                            width: "50%",
                            padding: "20px",
                        }}
                    >
                        <Title level={3} style={{ textAlign: "center" }}>
                            Login
                        </Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleLogin}
                            style={{ width: "100%" }}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Please enter your email!" }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please enter your password!" }]}
                            >
                                <Input.Password placeholder="Enter your password" />
                            </Form.Item>

                            <p style={{ textAlign: 'left' }}>
                                Don't have an account?{' '}
                                <span 
                                    style={{ color: '#1890ff', cursor: 'pointer' }} 
                                    onClick={() => navigate('/register')}
                                >
                                    Register Now
                                </span>
                            </p>

                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Login
                            </Button>
                        </Form>
                    </Flex>

                    {/* Right Side - Image */}
                    <Flex
                        justify="center"
                        align="center"
                        style={{
                            width: "50%",
                            height: "100%",
                            padding: "20px",
                        }}
                    >
                        <img
                            src="https://images.pexels.com/photos/4195324/pexels-photo-4195324.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="Login"
                            style={{
                                width: "90%",
                                height: "400px",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />
                    </Flex>
                </Flex>
            </Card>
        </div>
    );
};

export default Login;
