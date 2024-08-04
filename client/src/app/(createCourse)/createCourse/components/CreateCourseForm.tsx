"use client";
import React, { useState } from "react";
import { Menu } from "antd";
import styles from "./CreateCourseForm.module.scss"
import BasicInfomationForm from "./BasicInfomationForm";
import AdvanceInformationForm from "./AdvanceInformationForm";
import CurriculumForm from "./CurriculumForm";
import PublishCourseForm from "./PublishCourseForm";

const items = [
	{
		label: "Basic Information",
		key: "basic-information",
	},
	{
		label: "Advance Information",
		key: "advance-information",
	},
	{
		label: "Curriculum",
		key: "curriculum",
	},
	{
		label: "Publish Course",
		key: "publish-course",
	},
];

const CreateCourseForm = () => {
	const [selectedKey, setSelectedKey] = useState(items[2]?.key);

	const handleClick = (e: { key: React.SetStateAction<string>; }) => {
		setSelectedKey(e.key);
	}

	return (
		<div className={styles.topNavBarContainer}>
			<Menu mode="horizontal" items={items} onClick={handleClick} selectedKeys={[selectedKey]}>
				{
					items.map((item) => (
						<Menu.Item key={item.key}>{item.label}</Menu.Item>
					))
				}
			</Menu>
			{selectedKey === "basic-information" && <BasicInfomationForm />}
			{selectedKey === "advance-information" && <AdvanceInformationForm />}
			{selectedKey === "curriculum" && <CurriculumForm />}
			{selectedKey === "publish-course" && <PublishCourseForm />}
		</div>
	);
};

export default CreateCourseForm;
