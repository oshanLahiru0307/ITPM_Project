import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Typography, message, Row, Col } from "antd";
import UserController from "../Services/UserController";
import state from "../State/state";
import backImage1 from "../assets/backimage1.jpg"
import backImage2 from "../assets/backImage2.jpg"

const { Title, Text } = Typography;

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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: '100%',
                height: "100vh",
                background: `url(${backImage1})`,
                backgroundSize: "cover",
                backgroundPosition: 'center'
            }}
        >
            <div
                style={{
                    width: '1000px',
                    padding: "0",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "white",
                }}
            >
                <Row>
                    {/* Left Side - Image */}
                    <Col span={12} style={{ background: "#1890ff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <img
                            src={backImage2}
                            alt="Login"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{ color: "white", textAlign: "center", position: "absolute", padding: "20px", bottom: "40%" }}>
                            <Title level={1} style={{ color: "white", textAlign: "center", marginBottom:'30px' }}>
                                Welcome to Home Stock
                            </Title>
                            <Title level={5} style={{ color: "white", textAlign: "center" }}>
                                Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development to fill empty spaces in a layout that does not yet have content.
                            </Title>
                        </div>
                    </Col>

                    {/* Right Side - Form */}
                    <Col span={12} style={{ padding: "40px" }}>
                        <Title level={3} style={{ color: "#1890ff", textAlign: "center" }}>
                            Login Account
                        </Title>
                        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
                            Enter your credentials to access your account.
                        </Text>
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
                                <Input placeholder="Enter your email" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please enter your password!" }]}
                            >
                                <Input.Password placeholder="Enter your password" />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Login
                            </Button>
                            <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: '10px' }}>
                                Not a member? <a href="/register">Sign up</a>
                            </Text>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Login;