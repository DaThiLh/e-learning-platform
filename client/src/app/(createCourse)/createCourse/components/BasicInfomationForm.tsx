"use client";
import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, Select, Button } from "antd";
import styles from "./BasicInformationForm.module.scss";
import NavigationButton from "./NavigationButton";

const categoryOptions: { value: string; label: string }[] = [
	{ value: "Java", label: "Java" },
	{ value: "C", label: "C" },
];

const subcategoryOptions: Record<string, { value: string; label: string }[]> = {
	Java: [
		{ value: "Spring", label: "Spring" },
		{ value: "Hibernate", label: "Hibernate" },
	],
	C: [
		{ value: "ASP.NET", label: "ASP.NET" },
		{ value: "Entity Framework", label: "Entity Framework" },
	],
};

const languageOptions = [
	{ value: "English", label: "English" },
	{ value: "Vietnamese", label: "Vietnamese" },
];

const BasicInfomationForm = () => {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
	};

	return (
		<div className="w-full p-4">
			<HeaderForm headerName="Basic Information" />
			<hr />
			<div className={styles.basicInformationFormContainer}>
				<Form layout="vertical" className="createForm">
					<div>
						<Form.Item label="Title" name="title">
							<Input
								placeholder="Your course title"
								showCount
								maxLength={80}
							/>
						</Form.Item>

						<Form.Item label="Subtitle" name="subtitle">
							<Input
								placeholder="Your course subtitle"
								showCount
								maxLength={120}
							/>
						</Form.Item>

						<Form.Item label="Description" name="description">
							<Input.TextArea placeholder="Your course description" />
						</Form.Item>

						<div className="form-row w-full">
							<div className="sub-form-colum w-full">
								<Form.Item
									label="Category"
									name="category"
									className="w-full"
								>
									<Select
										showSearch
										placeholder="Select a category"
										onChange={handleCategoryChange}
									>
										{categoryOptions.map((option) => (
											<Select.Option
												key={option.value}
												value={option.value}
											>
												{option.label}
											</Select.Option>
										))}
									</Select>
								</Form.Item>

								{selectedCategory && (
									<Form.Item
										label="Sub-category"
										name="subcategory"
										className="w-full"
									>
										<Select
											showSearch
											placeholder="Select a sub category"
										>
											{subcategoryOptions[
												selectedCategory
											]?.map((option) => (
												<Select.Option
													key={option.value}
													value={option.value}
												>
													{option.label}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								)}
							</div>

							<Form.Item
								label="Language"
								name="language"
								className="w-full"
							>
								<Select
									placeholder="Select a language"
									showSearch
								>
									{languageOptions.map((option) => (
										<Select.Option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</div>
						
						<NavigationButton leftButton="Not" rightButton="Next" />
					</div>
				</Form>
			</div>
		</div>
	);
};

export default BasicInfomationForm;
