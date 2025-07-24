"use client";
import React, { useState } from "react";
import SelectDropdown from "./SelectDropdown";
import { useRouter } from "next/navigation";

const HeroContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: "buy", label: "Buy" },
    { id: "rent", label: "Rent" },
    { id: "sold", label: "Sold" },
  ];

  return (
    <div className="advance-style2 mt80 mt0-md mb60 mx-auto" data-aos="fade-up">
    </div>
  );
};

export default HeroContent;
