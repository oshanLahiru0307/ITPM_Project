import React, { useState, useEffect } from "react";
import moment from "moment";
import dayjs from "dayjs";
import {
  Button,
  message,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Spin,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import itemController from "../Services/ItemController";
import categoryController from "../Services/CategoryController";
import DonationController from "../Services/DonationController";
import state from "../State/state";
import { useSnapshot } from "valtio";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PDF_Logo from "../assets/inventory_11000621.png";

const { Option } = Select;
const { Search } = Input;

const Items = () => {
  const snap = useSnapshot(state);
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const [donateForm] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 576);
      setIsTablet(width > 576 && width <= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const user = snap.currentUser._id;
    try {
      const data = await itemController.getItemsByUser(user);
      setItems(data);
      setFilteredData(data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const user = snap.currentUser._id;
    try {
      const data = await categoryController.getAllCategoriesByUser(user);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddOrUpdateItem = async (values) => {
    try {
      const formattedValues = {
        user: snap.currentUser._id,
        ...values,
        mfd: values.mfd ? values.mfd.format("YYYY-MM-DD") : null,
        expd: values.expd ? values.expd.format("YYYY-MM-DD") : null,
      };

      if (selectedItem) {
        await itemController.updateItem(selectedItem._id, formattedValues);
        message.success("Item updated successfully");
      } else {
        await itemController.addItem(formattedValues);
        message.success("Item added successfully");
      }

      fetchItems();
      setModalVisible(false);
      form.resetFields();
      setSelectedItem(null);
    } catch (error) {
      console.error("Error saving item:", error.response?.data || error);
      message.error(error.response?.data?.error || "Failed to save item");
    }
  };

  const handleEditItem = (record) => {
    setSelectedItem(record);
    form.setFieldsValue({
      ...record,
      mfd: record.mfd ? moment(record.mfd) : null,
      expd: record.expd ? moment(record.expd) : null,
    });
    setModalVisible(true);
  };

  const handleDeleteItem = async (ItemId) => {
    try {
      await itemController.deleteItem(ItemId);
      message.success("Item Deleted Successfully");
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
      message.error("Failed to delete Item");
    }
  };

  const handleDonateItem = (record) => {
    setSelectedItem(record);
    donateForm.setFieldsValue({
      qty: 1, // Default quantity to 1
    });
    setDonateModalVisible(true);
  };

  const handleDonateSubmit = async (values) => {
    try {
      const donationData = {
        user: snap.currentUser._id, // Pass current user ID
        ...selectedItem,
        qty: values.qty,
      };

      await DonationController.addDonation(donationData);
      message.success("Item donated successfully");
      setDonateModalVisible(false);
      donateForm.resetFields();
      fetchItems();
    } catch (error) {
      console.error("Error donating item:", error);
      message.error("Failed to donate item");
    }
  };

  const handleSearch = (value) => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value); // Call handleSearch with the input value
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // <--- PASTE YOUR BASE64 STRING HERE

    // Add logo
    const imgWidth = 30;
    // You might need to adjust the height based on your logo's aspect ratio
    const imgHeight = 15;
    const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
    doc.addImage(PDF_Logo, 'PNG', imgX, 10, imgWidth, imgHeight);

    // Add title
    const title = 'Home Stock';
    doc.setFontSize(18);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2; // Center horizontally
    doc.text(title, titleX, 10 + imgHeight + 5);

    // Add subtitle
    doc.setFontSize(14);
    doc.text('Item Report', 14, 10 + imgHeight + 12 + 7); // Adjusted Y position

    // Add download date
    doc.setFontSize(10);
    doc.text(`Downloaded on: ${moment().format('YYYY-MM-DD')}`, pageWidth - 14, 15, { align: "right" });

    const columns = [
      "#",
      "Name",
      "Description",
      "Price",
      "Category",
      "Qty",
      "Mfg Date",
      "Exp Date",
    ];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;

      let sortOrder = sortedInfo.order === "ascend" ? 1 : -1;
      let valueA = a[sortedInfo.field];
      let valueB = b[sortedInfo.field];

      if (sortedInfo.field === "price" || sortedInfo.field === "qty") {
        return (valueA - valueB) * sortOrder;
      } else if (sortedInfo.field === "mfd" || sortedInfo.field === "expd") {
        return (new Date(valueA) - new Date(valueB)) * sortOrder;
      } else {
        return valueA.localeCompare(valueB) * sortOrder;
      }
    });

    const rows = sortedData.map((item, index) => [
      index + 1,
      item.name,
      item.description,
      item.price,
      item.category,
      item.qty,
      item.mfd ? new Date(item.mfd).toLocaleDateString() : "",
      item.expd ? new Date(item.expd).toLocaleDateString() : "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 10 + imgHeight + 15 + 7, // Adjusted startY
    });
    doc.save("Item_Report.pdf");
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: "Manufacturing Date",
      dataIndex: "mfd",
      key: "mfd",
      sorter: (a, b) => (a.mfd && b.mfd ? moment(a.mfd).valueOf() - moment(b.mfd).valueOf() : 0),
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Expiry Date",
      dataIndex: "expd",
      key: "expd",
      sorter: (a, b) => (a.expd && b.expd ? moment(a.expd).valueOf() - moment(b.expd).valueOf() : 0),
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Added Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).valueOf() - moment(b.updatedAt).valueOf(),
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: "5px" }}
            onClick={() => handleEditItem(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDeleteItem(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger style={{ marginRight: "5px" }}>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            style={{ background: "#5CD85A" }}
            onClick={() => handleDonateItem(record)}
          >
            <GiftOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Card
        hoverable
        style={{ width: "100%", height: "663px", background: "#F0F8FF" }}
        title={<h3 style={{ color: "#007FFF" }}>Items</h3>}
        extra={
          <Button type="primary" onClick={() => setModalVisible(true)}>
            + Add Item
          </Button>
        }
      >
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={24} md={12} lg={8}>
            <Search
              placeholder="Search by Item Name"
              onChange={handleSearchChange}
              allowClear
              enterButton="Search"
              size="middle"
              style={{ width: "100%", marginBottom: 20 }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={4}>
            <Button
              type="primary"
              onClick={generatePDF}
              block={isMobile || isTablet}
              style={{
                float: isMobile || isTablet ? "none" : "right",
                width: isMobile || isTablet ? "100%" : "auto",
                marginBottom: 20,
              }}
            >
              Generate PDF
            </Button>
          </Col>
        </Row>
        <Spin spinning={loading} tip="Loading Items...">
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        </Spin>
        {/* Add/Edit Modal */}
        <Modal
          title={selectedItem ? "Edit Item" : "Add Item"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setSelectedItem(null);
          }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => handleAddOrUpdateItem(values))
              .catch((error) => {
                console.error(error, "error while submit");
                message.error("Fill all the required fields!.");
              });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Item Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a category">
                {categories.map((category) => (
                  <Option key={category._id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="qty" label="Quantity" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="mfd"
              label="Manufacture Date"
              rules={[
                { required: true, message: "Manufacturing date is required" },
                {
                  validator: (_, value) =>
                    value && value.isBefore(dayjs())
                      ? Promise.resolve()
                      : Promise.reject("Date must be in the past"),
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="expd"
              label="Expire Date"
              rules={[
                { required: true, message: "Expiry date is required" },
                {
                  validator: (_, value) =>
                    value && value.isAfter(dayjs())
                      ? Promise.resolve()
                      : Promise.reject("Date must be in the future"),
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Donate Modal */}
        <Modal
          title="Donate Item"
          open={donateModalVisible}
          onCancel={() => {
            setDonateModalVisible(false);
            donateForm.resetFields();
            setSelectedItem(null);
          }}
          onOk={() => {
            donateForm
              .validateFields()
              .then((values) => {
                handleDonateSubmit(values);
              })
              .catch((error) => {
                console.log(error, "error while submit");
                message.error("Fill all the required fields!.");
              });
          }}
        >
          <Form form={donateForm} layout="vertical">
            <Form.Item
            name="qty"
            label="Quantity to Donate"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              max={selectedItem?.qty || 1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  </div>
);
};

export default Items;