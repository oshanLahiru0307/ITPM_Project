import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { Form, Button, Input, Typography, Row, Col, message} from "antd";
import UserController from "../Services/UserController";
import backImage1 from "../assets/backimage1.jpg"
import backImage2 from "../assets/backImage2.jpg"

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const handleRegister = async (values) => {
        try {
            setLoading(true)
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: `url(${backImage1})`,
    backgroundSize: "cover",
}}
>
<div
    style={{
        width: '1200px',
        padding: "0",
        borderRadius: "10px",
        overflow: "hidden",
        background: "white",
    }}
>
    <Row style={{ height: "650px" }}>
        {/* Left Side - Image */}
        <Col span={12} style={{ background: "#1890ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
                src={backImage2}
                alt="Register"
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative" }}
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
        <Col span={12} style={{ padding: "10px 20px" }}>
            <Title level={3} style={{ color: "#1890ff", textAlign: "center" }}>
                Create an Account
            </Title>
            <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
                Fill in the details to register your account.
            </Text>
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


                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Register
                    </Button>
                </Form.Item>

                <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
                    Already a member? <a href="/">Sign in</a>
                </Text>
            </Form>
        </Col>
    </Row>
</div>
</div>
    );
};

export default Register;
