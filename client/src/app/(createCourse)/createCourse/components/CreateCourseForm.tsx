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
	const [selectedKey, setSelectedKey] = useState(items[1]?.key);

	const handleClick = (e: { key: React.SetStateAction<string>; }) => {
		setSelectedKey(e.key);
	}

	const handleNextButton = () => {
		const currentIndex = items.findIndex((item) => item.key === selectedKey);
		if (currentIndex < items.length - 1) {
			setSelectedKey(items[currentIndex + 1].key);
		}
	}

	const handlePreviousButton = () => {
		const currentIndex = items.findIndex((item) => item.key === selectedKey);
		if (currentIndex > 0) {
			setSelectedKey(items[currentIndex - 1].key);
		}
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
			{selectedKey === "basic-information" && <BasicInfomationForm moveToNextForm={() => handleNextButton()} />}
			{selectedKey === "advance-information" && 
				<AdvanceInformationForm 
					moveToPreviousForm={() => handlePreviousButton()} 
					moveToNextForm={() => handleNextButton()} />}

			{/* {selectedKey === "curriculum" && <CurriculumForm moveToPreviousForm={handlePreviousButton} moveToNextForm={handleNextButton()} />}
			{selectedKey === "publish-course" && <PublishCourseForm moveToPreviousForm={handlePreviousButton} />} */}
		</div>
	);
};

export default CreateCourseForm;
