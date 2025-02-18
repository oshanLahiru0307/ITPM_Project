import React from 'react';
import { Button, Checkbox, Form, Input, Card } from 'antd';

const Login = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: 'url("https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?t=st=1739886009~exp=1739889609~hmac=a882aea7036d17b9aec6dd8a3992dd2be1a09da78209f9ba8c15a93ab571f357&w=996")', // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Card
                style={{
                    width: 400,  // Increased width
                    height: 350, // Increased height
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Adding shadow
                    borderRadius: '10px', // Optional rounded corners
                    background: 'rgba(255, 255, 255, 0.9)', // Slight transparency for better blending
                }}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
