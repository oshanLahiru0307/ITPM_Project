import React, { useEffect, useState } from 'react'
import BannerController from "../Services/BannerController";
import { Card, Space,Carousel,Spin } from "antd";

const NoticeBanner = () => {

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannerData = await BannerController.getBanners();
                setBanners(bannerData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Spin spinning={loading} tip="Loading Dashboard...">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Card
                        style={{
                            width: "100%",
                            height: "230px",
                            padding: 0,
                            margin: 0,
                            overflow: "hidden",
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Carousel autoplay autoplaySpeed={3000} effect="fade">
                            {banners.map((banner) => (
                                <div key={banner._id}>
                                    <img
                                        src={banner.image}
                                        alt="banner"
                                        style={{
                                            width: "100%",
                                            height: "230px",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </Card>
                </Space>
            </Spin>
        </div>
    )
}

export default NoticeBanner
