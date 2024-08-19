'use client';
import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, Select, Typography } from "antd";
import styles from "./BasicInformationForm.module.scss";
import NavigationButton from "./NavigationButton";
import languages from "./languages.json";

const { Title } = Typography;

interface categoryProps {
	category: string;
	subCategory: string[];
}

interface basicInformationProps {
	title: string;
	subtitle: string;
	description: string;
	category: string;
	subcategory: string;
	language: string;
}

const defaultCateogry: categoryProps[] = [
	{ category: "Java", subCategory: ["Spring", "Hibernate"] },
	{ category: "C", subCategory: ["ASP.NET", "Entity Framework"] },
];

const optionsLanguage = languages.map((lang) => {
	return { label: lang.name, value: lang.code };
});

const defaultBasicInformation: basicInformationProps = {
	title: "",
	subtitle: "",
	description: "",
	category: "",
	subcategory: "",
	language: "",
}

const BasicInformationForm = ({moveToNextForm}: {moveToNextForm: () => void;}) => {
	const [basicInformation, setBasicInformation] = useState<basicInformationProps>(() => {
		const savedData = window.localStorage.getItem("basicInformation");
		return savedData
			? JSON.parse(savedData)
			: defaultBasicInformation;
	});
	const [selectedCategory, setSelectedCategory] = useState<string | null>(basicInformation.category || null);
	const [errors, setErrors] = useState({
		titleError: false,
		subtitleError: false,
		descriptionError: false,
		categoryError: false,
		subcategoryError: false,
		languageError: false,
	});

	const handleStateChange = (name: keyof basicInformationProps, value: string) => {
		setBasicInformation((prev) => {
			const newState = { ...prev, [name]: value };
			localStorage.setItem("basicInformation", JSON.stringify(newState));
			return newState;
		});
	};

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
		handleStateChange("category", value);
		handleStateChange("subcategory", "");
	};

	const handleSubmitForm = () => {
		const {
			title,
			subtitle,
			description,
			category,
			subcategory,
			language,
		} = basicInformation;
	
		const newErrors = {
			titleError: title.trim() === "",
			subtitleError: subtitle.trim() === "",
			descriptionError: description.trim() === "",
			categoryError: category === "",
			subcategoryError: subcategory === "",
			languageError: language === "",
		};
	
		setErrors(newErrors);
	
		if (Object.values(newErrors).every((error) => !error)) {
			console.log("Form Submitted: ", basicInformation);
			moveToNextForm();
		} else {
			console.log("Form has errors");
		}
	};
	

	return (
		<div className={styles.basicInformationFormContainer}>
			<HeaderForm headerName="Basic Information" />
			<hr />
			<Form layout="vertical" className="createForm">
				<div className="w-full flex flex-col py-2 gap-4">
					<div className="flex flex-col">
						<Title level={5}>Title</Title>
						<Input
							placeholder="Your course title"
							showCount
							maxLength={80}
							value={basicInformation.title}
							onChange={(e) => handleStateChange("title", e.target.value)}
							className="border-color-orange"
						/>
						{errors.titleError && <span className="error-message">* Title is required</span>}
					</div>

					<div className="flex flex-col">
						<Title level={5}>Subtitle</Title>
						<Input
							placeholder="Your course subtitle"
							showCount
							maxLength={120}
							value={basicInformation.subtitle}
							onChange={(e) => handleStateChange("subtitle", e.target.value)}
							className="border-color-orange"
						/>
						{errors.subtitleError && <span className="error-message">* Subtitle is required</span>}
					</div>

					<div className="flex flex-col">
						<Title level={5}>Description</Title>
						<Input.TextArea
							placeholder="Your course description"
							value={basicInformation.description}
							onChange={(e) => handleStateChange("description", e.target.value)}
							className="border-color-orange"
						/>
						{errors.descriptionError && <span className="error-message">* Description is required</span>}
					</div>

					<div className="form-row w-full">
						<div className="w-1/2 flex flex-col gap-4">
							<div>
								<Title level={5}>Category</Title>
								<Select
									showSearch
									placeholder="Select a category"
									onChange={handleCategoryChange}
									className="w-full"
									value={basicInformation.category}
								>
									{defaultCateogry.map((category, index) => (
										<Select.Option key={index} value={category.category}>
											{category.category}
										</Select.Option>
									))}
								</Select>
								{errors.categoryError && <span className="error-message">* Category is required</span>}
							</div>

							{selectedCategory && (
								<div>
									<Title level={5}>Sub Category</Title>
									<Select
										showSearch
										placeholder="Select a sub category"
										className="w-full"
										onChange={(value) => handleStateChange("subcategory", value)}
										value={basicInformation.subcategory}
									>
										{defaultCateogry
											.find((category) => category.category === selectedCategory)
											?.subCategory.map((subCategory, index) => (
												<Select.Option key={index} value={subCategory}>
													{subCategory}
												</Select.Option>
											))}
									</Select>
									{errors.subcategoryError && <span className="error-message">* Sub Category is required</span>}
								</div>
							)}
						</div>

						<div className="flex flex-col w-1/2">
							<Title level={5}>Language</Title>
							<Select
								placeholder="Select a language"
								showSearch
								className="w-full"
								onChange={(value) => handleStateChange("language", value)}
								value={basicInformation.language}
							>
								{optionsLanguage.map((lang, index) => (
									<Select.Option key={index} value={lang.value}>
										{lang.label}
									</Select.Option>
								))}
							</Select>
							{errors.languageError && <span className="error-message">* Language is required</span>}
						</div>
					</div>

					<NavigationButton
						leftButton="firstPage"
						rightButton="Next"
						actionLeftButton={() => {}}
						actionRightButton={handleSubmitForm}
					/>
				</div>
			</Form>
		</div>
	);
};

export default BasicInformationForm;
