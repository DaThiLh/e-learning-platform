"use client";
import React, { useState } from "react";
import { Menu } from "antd";
import styles from "./CreateCourseForm.module.scss"
import BasicInfomationForm from "./BasicInfomationForm";
import AdvanceInformationForm from "./AdvanceInformationForm";
import CurriculumForm from "./CurriculumForm";
import PublishCourseForm from "./PublishCourseForm";

const items = [
	{ label: "Basic Information", key: "basic-information" },
	{ label: "Advance Information", key: "advance-information" },
	{ label: "Curriculum", key: "curriculum" },
	{ label: "Publish Course", key: "publish-course" },
];

interface CreateFormProps {
	basicInformation: {};
	advanceInformation: {};
	curriculum: {};
	publishCourse: {};
}

const CreateCourseForm = () => {
	const [selectedKey, setSelectedKey] = useState(items[2]?.key);

	const [createForm, setCreateForm] = useState<CreateFormProps>({
		basicInformation: {},
		advanceInformation: {},
		curriculum: {},
		publishCourse: {},
	});

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

	const handleSubmitForm = () => {
		const basicInformation = window.localStorage.getItem("basicInformation");
		const advanceInformation = window.localStorage.getItem("advanceInformation");
		const curriculum = window.localStorage.getItem("curriculumInformation");
		const publishCourse = window.localStorage.getItem("publishCourse");
		
		setCreateForm({
			basicInformation: basicInformation ? JSON.parse(basicInformation) : {},
			advanceInformation: advanceInformation ? JSON.parse(advanceInformation) : {},
			curriculum: curriculum ? JSON.parse(curriculum) : {},
			publishCourse: publishCourse ? JSON.parse(publishCourse) : {},
		});

		console.log("Form Submitted: ", createForm);

		window.localStorage.removeItem("basicInformation");
		window.localStorage.removeItem("advanceInformation");
		window.localStorage.removeItem("curriculumInformation");
		window.localStorage.removeItem("publishCourse");
		
		const removedKey: string[] = [];
		for (let i in localStorage) {
			if (i.includes(`selectedItemType-`)) {
				removedKey.push(i);
			}
			if (i.includes(`selectedContentType-`)) {
				removedKey.push(i);
			}
		}

		removedKey.forEach((key) => {
			localStorage.removeItem(key);
		});
	}

	return (
		<div className={styles.topNavBarContainer}>
			<Menu mode="horizontal" items={items} selectedKeys={[selectedKey]}>
				{
					items.map((item) => (
						<Menu.Item key={item.key}>{item.label}</Menu.Item>
					))
				}
			</Menu>
			{selectedKey === "basic-information" && 
				<BasicInfomationForm moveToNextForm={() => handleNextButton()} />
			}
			
			{selectedKey === "advance-information" && 
				<AdvanceInformationForm 
					moveToPreviousForm={() => handlePreviousButton()} 
					moveToNextForm={() => handleNextButton()} />
			}

			{selectedKey === "curriculum" && 
				<CurriculumForm 
				moveToPreviousForm={() => handlePreviousButton()} 
				moveToNextForm={() => handleNextButton()} />
			}

			{selectedKey === "publish-course" && 
				<PublishCourseForm 
					moveToPreviousForm={handlePreviousButton} 
					handleSubmitForm={handleSubmitForm}
				/>}
		</div>
	);
};

export default CreateCourseForm;
