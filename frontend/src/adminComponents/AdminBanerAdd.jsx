import React, { useState } from "react";
import { Card, Button, Modal, Upload, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const AdminBanerAdd = () => {
  const [images, setImages] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImages((prevImages) => [...prevImages, reader.result]);
      setUploadVisible(false);
      message.success("Image added successfully!");
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const showDeleteConfirm = (index) => {
    confirm({
      title: "Are you sure you want to delete this image?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setImages((prevImages) => {
          const updated = [...prevImages];
          updated.splice(index, 1);
          return updated;
        });
        message.success("Image deleted");
      },
    });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#F0F8FF", minHeight: "100vh" }}>
      <Card
        title="Manage Banners"
        extra={
          <Button type="primary" onClick={() => setUploadVisible(true)}>
            <PlusOutlined /> Add Image
          </Button>
        }
        style={{ width: "100%" }}
      >
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {images.map((img, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <img
                src={img}
                alt={`uploaded-${index}`}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => showDeleteConfirm(index)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ff4d4f",
                  border: "none",
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Modal
        title="Upload Image"
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
      >
        <Upload
          accept="image/*"
          beforeUpload={handleUpload}
          showUploadList={false}
        >
          <Button icon={<PlusOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default AdminBanerAdd;
