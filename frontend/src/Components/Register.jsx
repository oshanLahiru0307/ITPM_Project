import React from "react";
import {useNavigate} from 'react-router-dom'
import { Flex, Form, Button, Input, Card, Typography, message } from "antd";
import UserController from "../Services/UserController";

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const handleRegister = async (values) => {
        try {
            const response = await UserController.addUser(values)
            console.log(response)
            navigate('/')
        } catch (error) {
            console.error(error)
            message.error("Failed to Register User. Try again later!")
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
                    minHeight: "600px",
                    width: "900px",
                    borderRadius: "15px"
                }}
            >
                <Flex justify="space-between" align="center" style={{ height: "100%", paddingb: '10px' }}>
                    {/* Left Side - Registration Form */}
                    <Flex
                        vertical
                        style={{
                            width: "50%",
                            padding: "20px",
                        }}
                    >
                        <Title level={3} style={{ textAlign: "center" }}>
                            Register
                        </Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleRegister}
                            style={{ width: "100%" }}
                        >
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: "Please enter your name!" }]}
                            >
                                <Input placeholder="Enter your full name" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter your email!" },
                                    { type: "email", message: "Invalid email format!" },
                                ]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>


                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    { required: true, message: "Please enter your Phone Number!" },
                                    { min: 10, message: "Phone number must be at least 10 characters!" },
                                ]}
                            >
                                <Input style={{ width: "100%" }}
                                    placeholder="Enter your Phone Number" />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    { required: true, message: "Please enter your Address!" },
                                ]}
                            >
                                <Input style={{ width: "100%" }}
                                    placeholder="Enter your Address" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: "Please enter your password!" },
                                    { min: 6, message: "Password must be at least 6 characters!" },
                                ]}
                            >
                                <Input.Password placeholder="Enter your password" />
                            </Form.Item>

                            <p style={{ textAlign: 'left' }}>
                        Do you have an account?{' '}
                        <span 
                            style={{ color: '#1890ff', cursor: 'pointer' }} 
                            onClick={() => navigate('/')}
                        >
                            Login Now
                        </span>
                    </p>

                            <Button type="primary" htmlType="submit" block>
                                Register
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
                            alt="Register"
                            style={{
                                width: "90%",
                                height: "450px",
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

export default Register;
