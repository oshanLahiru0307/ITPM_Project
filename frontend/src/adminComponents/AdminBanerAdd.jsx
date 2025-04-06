import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Upload, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import BannerController from "../Services/BannerController.js";

const { confirm } = Modal;

const AdminBanerAdd = () => {
  const [images, setImages] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await BannerController.getBanners(); // corrected from `viewBanners`
      setImages(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      message.error("Failed to load banners");
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleImageSubmit = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result; // Include MIME type
      BannerController.addBanner({ image: base64String })
        .then((res) => {
          message.success("Image uploaded successfully");
          setImages((prev) => [...prev, res]);
          setUploadVisible(false);
          setPreviewImage(null);
          setSelectedFile(null);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          message.error("Failed to upload image");
        });
    };
    reader.readAsDataURL(selectedFile);
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this image?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        BannerController.deleteBanner(id)
          .then(() => {
            setImages((prev) => prev.filter((img) => img._id !== id));
            message.success("Image deleted");
          })
          .catch((error) => {
            console.error("Error deleting banner:", error);
            message.error("Failed to delete image");
          });
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
          {images.map((img) => (
            <div
              key={img._id}
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
                src={img.image} // Now includes full data URI
                alt="banner"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => showDeleteConfirm(img._id)}
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
        onCancel={() => {
          setUploadVisible(false);
          setPreviewImage(null);
          setSelectedFile(null);
        }}
        onOk={handleImageSubmit}
        okText="Add Image"
        okButtonProps={{ disabled: !selectedFile }}
      >
        <Upload
          accept="image/*"
          beforeUpload={handleFileChange}
          showUploadList={false}
        >
          <Button icon={<PlusOutlined />}>Choose Image</Button>
        </Upload>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{ marginTop: "20px", width: "100%", maxHeight: "200px", objectFit: "contain" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminBanerAdd;
