import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, message, Upload, Button, Typography, Tooltip, Modal } from "antd";
import { UploadOutlined, PlusOutlined, CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import styles from "./AdvanceInformationForm.module.scss";
import NavigationButton from "./NavigationButton";
import { object, set } from "zod";
const { Title } = Typography;

interface ErrorState {
	objectifsError: boolean[];
	requirementsError: boolean[];
}

interface advanceInformationProps {
	objectifs: string[];
	requirements: string[];
}

const defaultAdvanceInformation: advanceInformationProps = {
	objectifs: ["", ""],
	requirements: ["", ""],
}

const UploadSection = () => {
	const [fileList, setFileList] = useState<any[]>([]);
	const [preview, setPreview] = useState<string>("");

	const handleChange: UploadProps["onChange"] = (info) => {
		const { status } = info.file;
		if (status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (status === "done") {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
		setFileList(info.fileList);
	};

	const beforeUpload: UploadProps["beforeUpload"] = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview(e.target.result as string);
		};
		reader.readAsDataURL(file);
		return false;
	};

	const uploadProps: UploadProps = {
		name: "file",
		multiple: true,
		action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
		onChange: handleChange,
		beforeUpload: beforeUpload,
		fileList: fileList,
	};

	return (
		<div
			className={`flex flex-row items-center pb-2 ${preview ? "justify-start" : "justify-center"}`}
		>
			{preview && (
				<div className="w-3/5 pl-10">
					<img
						src={preview}
						alt="preview"
						className="max-w-full h-auto"
					/>
				</div>
			)}
			<div className={`w-${preview ? "2/5" : "full"} flex justify-center`}>
				<Upload {...uploadProps}>
					<Button icon={<UploadOutlined />}>
						Click to Upload
					</Button>
				</Upload>
			</div>
		</div>
	);
};

const ObjectifsSection = ({
	handleStateChange,
	handleDeleteItem,
	listOfObjectifs,
	emptyErrors,
	hasDuplicateValue,
	handleShowablePopUp
}: {
	handleStateChange: (name: keyof advanceInformationProps, value: string, index: number) => void;
	handleDeleteItem: (name: keyof advanceInformationProps, updatedListItems: string[]) => void;
	listOfObjectifs: string[];
	emptyErrors: boolean[];
	hasDuplicateValue: boolean[];
	handleShowablePopUp: (name: keyof advanceInformationProps) => void;
}) => {
	const [listOfObjectifsValue, setListOfObjectifs] = useState(listOfObjectifs);

	const addItemObjectif = () => {
		if (listOfObjectifsValue.length == 20) {
			handleShowablePopUp("objectifs");
			return;
		}

		setListOfObjectifs([...listOfObjectifsValue, ""]);
		handleStateChange("objectifs", "", listOfObjectifsValue.length);
		
	};

	const deleteItemObjectif = (index: number) => {
		if (listOfObjectifsValue.length <= 2) return;

		const updatedObjectifs = listOfObjectifsValue.filter((item, i) => i !== index);
		setListOfObjectifs(updatedObjectifs);
		handleDeleteItem("objectifs", updatedObjectifs);
	};


	return (
		<Form layout="vertical">
			<div className="flex flex-row justify-between py-2 gap-4">
				<Title level={5}>
					What do you will teach in this course?
				</Title>
				<Button
					danger
					onClick={addItemObjectif}
					className="w-1/12 lg:w-full"
				>
					<PlusOutlined />
					<span className="text-btn-add-new">Add new</span>
				</Button>
			</div>
			{listOfObjectifsValue.map((objectif, index) => {
				const label = index > 9 ? `${index + 1}` : `0${index + 1}`;
				return (
					<Form.Item
						label={label}
						name={`objective-${index}`}
						key={index}
					>
						<div className="flex justify-between">
							<Input
								placeholder="What students are expected to achieve by the end of the course."
								showCount
								maxLength={160}
								className="border-color-orange"
								value={objectif}
								onChange={(e) => {
									setListOfObjectifs(
										listOfObjectifsValue.map((item, i) =>
											i === index ? e.target.value : item
										)
									);
									handleStateChange("objectifs", e.target.value, index);
								}}
							/>
							<Tooltip title={listOfObjectifsValue.length <= 2 && index <= 2 ?
								<>
									<CloseCircleOutlined />
									<span> Objectif must have two items.</span>
								</> : ""}>
								<Button 
									className="buttonDeleteItem" 
									onClick={() => deleteItemObjectif(index)}
									disabled={listOfObjectifsValue.length <= 2 && index <= 2}
								>
									<CloseOutlined />
								</Button>
							</Tooltip>
						</div>
						{emptyErrors[index] && <span className="error-message">* Objectif is required</span>}
						{hasDuplicateValue[index] && <span className="error-message">* Objectif must be unique</span>}
					</Form.Item>
				);
			})}
		</Form>
	);
};

const RequirementsSection = ({
	handleStateChange,
	handleDeleteItem,
	listOfRequirements,
	emptyErrors,
	hasDuplicateValue,
	handleShowablePopUp
}: {
	handleStateChange: (name: keyof advanceInformationProps, value: string, index: number) => void;
	handleDeleteItem: (name: keyof advanceInformationProps, updatedListItems: string[]) => void;
	listOfRequirements: string[];
	emptyErrors: boolean[];
	hasDuplicateValue: boolean[];
	handleShowablePopUp: (name: keyof advanceInformationProps) => void;
}) => {
	const [listOfRequirementsValue, setListOfRequirements] = useState(listOfRequirements);

	const addItemRequirement = () => {
		if (listOfRequirementsValue.length == 20) {
			handleShowablePopUp("requirements");
			return;
		}

		setListOfRequirements([...listOfRequirementsValue, ""]);
		handleStateChange("requirements", "", listOfRequirementsValue.length);
	};

	const deleteItemRequirement = (index: number) => {
		if (listOfRequirementsValue.length <= 2) return;

		const updatedRequirements = listOfRequirementsValue.filter((item, i) => i !== index);
		setListOfRequirements(updatedRequirements);
		handleDeleteItem("requirements", updatedRequirements);
	}

	return (
		<Form layout="vertical">
			<div className="flex flex-row justify-between py-2 gap-4">
				<Title level={5}>Course requirements</Title>
				<Button
					danger
					onClick={addItemRequirement}
					className="w-1/12 lg:w-full"
				>
					<PlusOutlined />
					<span className="text-btn-add-new">Add new</span>
				</Button>
			</div>
			{listOfRequirementsValue.map((requirement, index) => {
				const label = index > 9 ? `${index+1}` : `0${index+1}`;
				return (
					<Form.Item
						label={label}
						name={`requirement-${index}`}
						key={index}
					>
						<div className="flex justify-between">
							<Input
								placeholder="What is you course requirements."
								showCount
								maxLength={160}
								value={requirement}
								onChange={((e) => {
									setListOfRequirements(
										listOfRequirementsValue.map((item, i) =>
											i === index ? e.target.value : item
										)
									);
									handleStateChange("requirements", e.target.value, index);
								})}
							/>
							<Tooltip title={listOfRequirementsValue.length <= 2 && index <= 2 ?
								<>
									<CloseCircleOutlined />
									<span> Objectif must have two items.</span>
								</> : ""}>
								<Button 
									className="buttonDeleteItem" 
									onClick={() => deleteItemRequirement(index)}
									disabled={listOfRequirementsValue.length <= 2 && index <= 2}
								>
									<CloseOutlined />
								</Button>
							</Tooltip>
						</div>
						{emptyErrors[index] && <span className="error-message">* Requirement is required</span>}
						{hasDuplicateValue[index] && <span className="error-message">* Requirement must be unique</span>}
					</Form.Item>
				);
			})}
		</Form>
	);
}

const AdvanceInformationForm = ({
	moveToPreviousForm, moveToNextForm
}: {
	moveToPreviousForm: () => void;
	moveToNextForm: () => void;
}) => {
	const [advanceInformation, setAdvanceInformaiton] = useState<advanceInformationProps>(() => {
		const savedData = window.localStorage.getItem("advanceInformation");

		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);

				if (!Array.isArray(parsedData.objectifs)) {
					parsedData.objectifs = ["", ""];
				}
				if (!Array.isArray(parsedData.requirements)) {
					parsedData.requirements = ["", ""];
				}

				return parsedData;
			} catch (error) {
				console.error("Error parsing advanceInformation from localStorage:", error);
				return defaultAdvanceInformation;
			}
		}

		return defaultAdvanceInformation;
	});

	const [emptyErrors, setEmptyErrors] = useState<ErrorState>({
		objectifsError: [],
		requirementsError: [],
	});

	const [hasSameValue, setHasSameValue] = useState<ErrorState>({
		objectifsError: [],
		requirementsError: [],
	});

	const [showablePopUp, setShowablePopUp] = useState({
		objectifs: false,
		requirements: false,
	});

	const handleStateChange = (name: keyof advanceInformationProps, value: string, index: number) => {
		setAdvanceInformaiton((prevState) => {
			const updatedArray = [...prevState[name]];
			updatedArray[index] = value;

			const newState = { ...prevState, [name]: updatedArray };
			localStorage.setItem("advanceInformation", JSON.stringify(newState));
			return newState;
		});
	};

	const handleDeleteItem = (name: keyof advanceInformationProps, updatedListItems: string[]) => {
		setAdvanceInformaiton((prevState) => {
			const newState = { ...prevState, [name]: updatedListItems };
			localStorage.setItem("advanceInformation", JSON.stringify({
				...advanceInformation,
				[name]: updatedListItems
			}));

			return newState;
		})
	};

	const handleSubmitForm = () => {
		const newErrors = {
			objectifsError: advanceInformation.objectifs.map((item) => item.trim() === ""),
			requirementsError: advanceInformation.requirements.map((item) => item.trim() === ""),
		};
		setEmptyErrors(newErrors);

		checkDuplicateObjectifs();
		checkDuplicateRequirements();

		if (Object.values(newErrors).every((errorArray) => errorArray.every((error) => !error)) && 
			Object.values(hasSameValue).every((errorArray) => errorArray.every((error: any) => !error)) 
		) {
			console.log("Form submitted: ", advanceInformation);
			moveToNextForm();
		} else {
			console.log("Errors: ", newErrors);
		}
	};

	const checkDuplicateObjectifs = () => {
		const hasValue = new Set<string>();
		const updatedErrors = [...advanceInformation.objectifs].map(() => false);

		advanceInformation.objectifs.forEach((item, index) => {
			if (item !== "") {
				if (hasValue.has(item)) {
					updatedErrors[index] = true;
	
					const indexOfDuplicate = advanceInformation.objectifs.findIndex((value) => value === item && value.trim() !== "");
					updatedErrors[indexOfDuplicate] = true;
				}
				else hasValue.add(item);
			}
		});

		setHasSameValue((prevState) => ({ ...prevState, objectifsError: updatedErrors }));
	};

	const checkDuplicateRequirements = () => { 
		const hasValue = new Set<string>();
		const updatedErrors = [...advanceInformation.requirements].map(() => false);

		advanceInformation.requirements.forEach((item, index) => {
			if (item !== "") {
				if (hasValue.has(item)) {
					updatedErrors[index] = true;
	
					const indexOfDuplicate = advanceInformation.requirements.findIndex((value) => value === item);
					updatedErrors[indexOfDuplicate] = true;
				}
				else hasValue.add(item);
			}
		});

		setHasSameValue((prevState) => ({ ...prevState, requirementsError: updatedErrors }));
	};

	return (
		<div className={styles.advanceInformationFormContainer}>
			<HeaderForm headerName="Advance Information" />
			<UploadSection />

			<hr className="my-2" />
			<ObjectifsSection
				handleStateChange={(name, value, index) => handleStateChange(name, value, index)}
				handleDeleteItem={(name, updatedListItems) => handleDeleteItem(name, updatedListItems)}
				listOfObjectifs={advanceInformation.objectifs}
				emptyErrors={emptyErrors.objectifsError}
				hasDuplicateValue={hasSameValue.objectifsError}
				handleShowablePopUp={(name) => setShowablePopUp((prevState) => ({ ...prevState, [name]: true }))}
			/>

			<hr className="my-2" />
			<RequirementsSection 
				handleStateChange={(name, value, index) => handleStateChange(name, value, index)}
				handleDeleteItem={(name, updatedListItems) => handleDeleteItem(name, updatedListItems)}
				listOfRequirements={advanceInformation.requirements}
				emptyErrors={emptyErrors.requirementsError}
				hasDuplicateValue={hasSameValue.requirementsError}
				handleShowablePopUp={(name) => setShowablePopUp((prevState) => ({ ...prevState, [name]: true }))}
			/>

			<Modal title="Max 20 items" 
				open={showablePopUp.objectifs || showablePopUp.requirements} 
				onOk={() => setShowablePopUp({ objectifs: false, requirements: false })} 
			>
				{showablePopUp.objectifs && <p>Objectif must have max 20 items.</p>}
				{showablePopUp.requirements && <p>Requirements must have max 20 items.</p>}
      </Modal>
			<NavigationButton
				leftButton="Previous"
				rightButton="Next"
				actionLeftButton={()=> moveToPreviousForm()}
				actionRightButton={handleSubmitForm}
			/>
		</div>
	);
};

export default AdvanceInformationForm;
