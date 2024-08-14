"use client";
import React, { useState, useEffect } from "react";
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

const BasicInfomationForm = () => {
	// Initialize state with data from localStorage if available
	const [basicInformation, setBasicInformation] = useState<basicInformationProps>(() => {
		const savedData = localStorage.getItem("basicInformation");
		return savedData
			? JSON.parse(savedData)
			: {
					title: "",
					subtitle: "",
					description: "",
					category: "",
					subcategory: "",
					language: "",
			  };
	});

	const [selectedCategory, setSelectedCategory] = useState<string | null>(basicInformation.category || null);
	const [titleError, setTitleError] = useState<boolean>(false);
	const [subtitleError, setSubtitleError] = useState<boolean>(false);
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [categoryError, setCategoryError] = useState<boolean>(false);
	const [subcategoryError, setSubcategoryError] = useState<boolean>(false);
	const [languageError, setLanguageError] = useState<boolean>(false);

	// Save form data to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("basicInformation", JSON.stringify(basicInformation));
	}, [basicInformation]);

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
		setBasicInformation((prev) => ({ ...prev, category: value, subcategory: "" }));
	};

	const setTitle = (title: string) => {
		setBasicInformation((prev) => ({ ...prev, title }));
	};

	const setSubtitle = (subtitle: string) => {
		setBasicInformation((prev) => ({ ...prev, subtitle }));
	};

	const setDescription = (description: string) => {
		setBasicInformation((prev) => ({ ...prev, description }));
	};

	const setSubcategory = (subcategory: string) => {
		setBasicInformation((prev) => ({ ...prev, subcategory }));
	};

	const setLanguage = (language: string) => {
		setBasicInformation((prev) => ({ ...prev, language }));
	};

	const handleSubmitForm = () => {
		setTitleError(basicInformation.title === "");
		setSubtitleError(basicInformation.subtitle === "");
		setDescriptionError(basicInformation.description === "");
		setCategoryError(basicInformation.category === "");
		setSubcategoryError(basicInformation.subcategory === "");
		setLanguageError(basicInformation.language === "");

		if (
			!titleError &&
			!subtitleError &&
			!descriptionError &&
			!categoryError &&
			!subcategoryError &&
			!languageError
		) {
			console.log(basicInformation);
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
							onChange={(e) => setTitle(e.target.value)}
							status={titleError ? "error" : ""}
						/>
						{titleError && <p style={{ color: "red" }}>Title is required.</p>}
					</div>

					<div className="flex flex-col">
						<Title level={5}>Subtitle</Title>
						<Input
							placeholder="Your course subtitle"
							showCount
							maxLength={120}
							value={basicInformation.subtitle}
							onChange={(e) => setSubtitle(e.target.value)}
							status={subtitleError ? "error" : ""}
						/>
						{subtitleError && <p style={{ color: "red" }}>Subtitle is required.</p>}
					</div>

					<div className="flex flex-col">
						<Title level={5}>Description</Title>
						<Input.TextArea
							placeholder="Your course description"
							value={basicInformation.description}
							onChange={(e) => setDescription(e.target.value)}
							status={descriptionError ? "error" : ""}
						/>
						{descriptionError && <p style={{ color: "red" }}>Description is required.</p>}
					</div>

					<div className="form-row w-full">
						<div className="w-1/2 flex flex-col gap-2">
							<div>
								<Title level={5}>Category</Title>
								<Select
									showSearch
									placeholder="Select a category"
									onChange={handleCategoryChange}
									className="w-full"
									value={basicInformation.category}
									status={categoryError ? "error" : ""}
								>
									{defaultCateogry.map((category, index) => (
										<Select.Option key={index} value={category.category}>
											{category.category}
										</Select.Option>
									))}
								</Select>
								{categoryError && <p style={{ color: "red" }}>Category is required.</p>}
							</div>

							{selectedCategory && (
								<>
									<div>
										<Title level={5}>Sub Category</Title>
										<Select
											showSearch
											placeholder="Select a sub category"
											className="w-full"
											onChange={(value) => setSubcategory(value)}
											value={basicInformation.subcategory}
											status={subcategoryError ? "error" : ""}
										>
											{defaultCateogry
												.find((category) => category.category === selectedCategory)
												?.subCategory.map((subCategory, index) => (
													<Select.Option key={index} value={subCategory}>
														{subCategory}
													</Select.Option>
												))}
										</Select>
										{subcategoryError && (
											<p style={{ color: "red" }}>Subcategory is required</p>
										)}
									</div>
								</>
							)}
						</div>

						<div className="flex flex-col w-1/2">
							<Title level={5}>Language</Title>
							<Select
								placeholder="Select a language"
								showSearch
								className="w-full"
								onChange={(value) => setLanguage(value)}
								value={basicInformation.language}
								status={languageError ? "error" : ""}
							>
								{optionsLanguage.map((lang, index) => (
									<Select.Option key={index} value={lang.value}>
										{lang.label}
									</Select.Option>
								))}
							</Select>
							{languageError && <p style={{ color: "red" }}>Language is required</p>}
						</div>
					</div>

					<NavigationButton leftButton="BasicInfo" rightButton="Next" actionRightButton={handleSubmitForm} />
				</div>
			</Form>
		</div>
	);
};

export default BasicInfomationForm;
