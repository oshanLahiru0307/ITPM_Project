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
                        <Carousel autoplay autoplaySpeed={3000} effect="fade">
                            {banners.map((banner) => (
                                <div key={banner._id}>
                                    <img
                                        src={banner.image}
                                        alt="banner"
                                        style={{
                                            width: "100%",
                                            height: "450px",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                </Space>
            </Spin>
        </div>
    )
}

export default NoticeBanner
