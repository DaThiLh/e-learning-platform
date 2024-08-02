import React from "react";
import BasicInfomationForm from "./components/BasicInfomationForm";
import CreateCourseForm from "./components/CreateCourseForm";
import s from "./basicInformationPage.module.scss";

const BasicInformationPage = () => {
	return (
		<div className={s.createCourseFormPage}>
			<CreateCourseForm />
		</div>
	);
};

export default BasicInformationPage;
