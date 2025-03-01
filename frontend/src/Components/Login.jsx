import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Card, message } from 'antd';
import state from '../State/state';
import UserController from '../Services/UserController';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);

        if (values.email === 'admin@gmail.com' && values.password) {
            navigate('/adminDashbord');
        } else {
            try {
                const user = await UserController.loginUser(values);
                if (user) {
                    navigate('/dashboard');
                    state.currentUser = user.user
                    state.token = user.token
                    console.log(state.currentUser)
                } else {
                    message.error("Invalid username or password");
                    return;
                }
            } catch (error) {
                console.error('Error while logging in:', error);
                message.error('Login failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error("Please fill in all fields");
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: 'url("https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?t=st=1739886009~exp=1739889609~hmac=a882aea7036d17b9aec6dd8a3992dd2be1a09da78209f9ba8c15a93ab571f357&w=996")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Card
                style={{
                    width: 400,
                    height: 350,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}  // ✅ FIXED: Passing function correctly
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your username!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
