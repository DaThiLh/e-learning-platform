'use client';
import React, { useState, useEffect } from "react";
import HeaderForm from "./HeaderForm";
import styles from "./PublishCourseForm.module.scss";
import { Typography, Form, Select, Button, Tooltip, Modal } from "antd";
import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import NavigationButton from "./NavigationButton";
import { Input } from "antd/lib";

const { Title } = Typography;


const currencyOptions = [
	{ value: "USD" },
	{ value: "EUR" },
	{ value: "JPY" },
	{ value: "GBP" },
	{ value: "AUD" },
];

const priceOptions = [
	{ value: 10 },
	{ value: 20 },
	{ value: 30 },
	{ value: 40 },
	{ value: 50 },
	{ value: 60 },
	{ value: 70 },
	{ value: 80 },
	{ value: 90 },
	{ value: 100 },
];

interface InstructorProps {
	name: string;
	role: string;
}

interface PublishCourseProps {
	instructors: InstructorProps[];
	currency: string;
	price: number;
}

const initialInstructorOptions: InstructorProps[] = [
	{
		name: "JackJackJackJackJackJackJackJackJackJackJackJack",
		role: "Instructor",
	},
	{ name: "Lucy", role: "Instructor" },
	{ name: "Tom", role: "VIP Instructor" },
];

const defaultPublishCourse: PublishCourseProps = {
	instructors: [],
	currency: currencyOptions[0]?.value,
	price: priceOptions[0]?.value,
};
const PublishCourseForm = ({ moveToPreviousForm, handleSubmitForm }: {
	moveToPreviousForm: () => void;
	handleSubmitForm: () => void;
}) => {
	const [availableInstructors, setAvailableInstructors] = useState(initialInstructorOptions);
	const [showablePopupSubmit, setShowablePopupSubmit] = useState(false);
	const [publishCourse, setPublishCourse] = useState<PublishCourseProps>(() => {
		const savedData = window.localStorage.getItem("publishCourse");
		if (savedData) console.log(JSON.parse(savedData));
		return savedData
			? JSON.parse(savedData)
			: defaultPublishCourse;
	});
	useEffect(() => {
		if (publishCourse.instructors.length !== 0) {
			const disabledInstructors = new Set(publishCourse.instructors.map(instr => instr.name));

			setAvailableInstructors((prev) =>
				prev.map((instructor) =>
					disabledInstructors.has(instructor.name)
						? { ...instructor, disabled: true }
						: instructor
				)
			);
		}
	}, []);


	const addInstructor = (instructorName: string) => {
		console.log("add ");
		const selectedInstructor = availableInstructors.find(
			(instr) => instr.name === instructorName
		);
		const storedData = window.localStorage.getItem("publishCourse");

		if (storedData) {
			console.log("hear");

			// Parse JSON string into an object
			const parsedData = JSON.parse(storedData);

			// Check if instructors exist
			console.log("1: ", parsedData.instructors);
			if (parsedData.instructors.length == 0) {
				console.log("3");
				// Print the instructors
				setPublishCourse((prev) => {
					const updatedInstructors = [{ name: "me", role: "Instructor" }];
					const newState: PublishCourseProps = { ...prev, instructors: updatedInstructors };
					localStorage.setItem("publishCourse", JSON.stringify(newState));
					return newState;
				});
			}
		} else {
			setPublishCourse((prev) => {
				const updatedInstructors = [{ name: "me", role: "Instructor" }];
				const newState: PublishCourseProps = { ...prev, instructors: updatedInstructors };
				localStorage.setItem("publishCourse", JSON.stringify(newState));
				return newState;
			});
		}

		if (selectedInstructor) {
			setPublishCourse((prev) => {
				const updatedInstructors = [...prev.instructors, selectedInstructor];
				const newState: PublishCourseProps = { ...prev, instructors: updatedInstructors };
				localStorage.setItem("publishCourse", JSON.stringify(newState));
				return newState;
			});

			setAvailableInstructors((prev) =>
				prev.map((instr) =>
					instr.name === instructorName
						? { ...instr, disabled: true }
						: instr
				)
			);
		}
	};

	const removeInstructor = (instructorName: string) => {
		const storedData = localStorage.getItem("publishCourse");

		if (storedData) {
			const parsedData = JSON.parse(storedData);
			console.log("hi1");
			if (parsedData.instructors.length == 2) {
				console.log("hi");
				setPublishCourse((prev) => {
					const updatedInstructors: InstructorProps[] = [];
					const newState: PublishCourseProps = { ...prev, instructors: updatedInstructors };
					localStorage.setItem("publishCourse", JSON.stringify(newState));
					return newState;
				});

			}
		}
		setPublishCourse((prev) => {
			const updatedInstructors = prev.instructors.filter(
				(instr) => instr.name !== instructorName
			);

			const newState = { ...prev, instructors: updatedInstructors };
			localStorage.setItem("publishCourse", JSON.stringify(newState));
			return newState;
		});

		setAvailableInstructors((prev) =>
			prev.map((instr) =>
				instr.name === instructorName
					? { ...instr, disabled: false }
					: instr
			)
		);
	};

	const handleSetPrice = (value: number) => {
		setPublishCourse((prev) => {
			const newState = { ...prev, price: value };
			localStorage.setItem("publishCourse", JSON.stringify(newState));
			return newState;
		});
	};

	const handleSetCurrency = (value: string) => {
		setPublishCourse((prev) => {
			const newState = { ...prev, currency: value };
			localStorage.setItem("publishCourse", JSON.stringify(newState));
			return newState;
		})
	}

	return (
		<div className={styles.publishCourseFormContainer}>
			<HeaderForm headerName="Publish Course" />
			<hr className="mb-2" />
			<SetPriceCard
				handleSetPrice={handleSetPrice}
				handleSetCurrency={handleSetCurrency}
			/>

			<br />
			<AddInstructorCard
				instructors={publishCourse.instructors}
				availableInstructors={availableInstructors}
				addInstructor={addInstructor}
				removeInstructor={removeInstructor}
			/>
			<Modal title="Submit Course"
				open={showablePopupSubmit}
				onOk={() => {
					setShowablePopupSubmit(false);
					handleSubmitForm();
				}}
				onCancel={() => setShowablePopupSubmit(false)}
				okText="Yes"
			>
				<p>Are you sure you want to submit this course?</p>
			</Modal>

			<NavigationButton
				leftButton="Previous"
				rightButton="Submit"
				actionLeftButton={() => moveToPreviousForm()}
				actionRightButton={() => setShowablePopupSubmit(true)}
			/>
		</div>
	);
};

const SetPriceCard = ({
	handleSetPrice, handleSetCurrency
}: {
	handleSetPrice: (value: number) => void;
	handleSetCurrency: (value: string) => void;
}) => {
	return (
		<div>
			<Title level={4} className="sm:text-lg md:text-xl lg:text-2xl">
				Set Price
			</Title>
			<Form
				initialValues={{
					currency: currencyOptions[0]?.value,
					price: priceOptions[0]?.value,
				}}
			>
				<div className="flex flex-row space-x-5">
					<div className="flex flex-col md:w-1/3 lg:w-1/5">
						<Title level={5}>Currency</Title>
						<Form.Item name="currency">
							<Select onChange={handleSetCurrency}>
								{currencyOptions.map((option) => (
									<Select.Option
										key={option.value}
										value={option.value}
									>
										{option.value}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<div className="flex flex-col w-1/5">
						<Title level={5}>Price</Title>
						<Form.Item name="price">
							<Select onChange={handleSetPrice}>
								{priceOptions.map((option) => (
									<Select.Option
										key={option.value}
										value={option.value}
									>
										{option.value}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	);
};

const AddInstructorCard = ({
	instructors,
	availableInstructors,
	addInstructor,
	removeInstructor,
}: {
	instructors: { name: string; role: string }[];
	availableInstructors: { name: string; role: string; disabled?: boolean }[];
	addInstructor: (name: string) => void;
	removeInstructor: (name: string) => void;
}) => {
	return (
		<div>
			<Title level={4} className="sm:text-lg md:text-xl lg:text-2xl">
				Add Instructors
			</Title>
			<Select
				showSearch
				placeholder="Search by instructor name"
				options={availableInstructors.map((option) => ({
					value: option.name,
					label: (
						<Tooltip title={option.name}>
							<span>
								{option.name.length > 15
									? `${option.name.substring(0, 15)}...`
									: option.name}
							</span>
						</Tooltip>
					),
					disabled: option.disabled,
				}))}
				onSelect={addInstructor}
				className="xl:w-1/3 md:w-1/2 lg:w-2/5"
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
				{instructors.map((instructor, index) => (
					<InstructorCard
						key={index}
						username={instructor.name}
						role={instructor.role}
						onRemove={() => removeInstructor(instructor.name)}
					/>
				))}
			</div>
		</div>
	);
};

interface NumericInputProps {
	value: string;
	onChange: (value: string) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumericInput = (props: NumericInputProps) => {
	const { value, onChange } = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		const reg = /^\d*$/; // Only allows digits
		if ((reg.test(inputValue) || inputValue === '') && Number(inputValue) <= 100) {
			onChange(inputValue);
		}
	};

	const handleBlur = () => {
		let valueTemp = value;
		if (value === '') {
			valueTemp = '1'; // Default to 1 if the input is empty
		}
		onChange(valueTemp.replace(/0*(\d+)/, '$1'));
	};

	return (
		<Input
			{...props}
			addonAfter={"%"}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			maxLength={3}
			id={"input_percentage"}
		/>
	);
};

const InstructorCard = ({
	username,
	role,
	onRemove,
}: {
	username: string;
	role: string;
	onRemove: () => void;
}) => {
	const [value, setValue] = useState('50'); // Default value within range

	const truncatedName =
		username.length > 15 ? `${username.substring(0, 15)}...` : username;

	return (
		<div className="flex items-center justify-between bg-slate-100 w-full p-2 rounded-md">
			<div className="text-xs">
				<Tooltip title={username} placement="top">
					<strong>{truncatedName}</strong>
				</Tooltip>
				<br />
				{role}
			</div>
			<div className="flex flex-row">
				<NumericInput value={value} onChange={setValue} />
				<Button
					onClick={onRemove}
					type="text"
					disabled={username === "me"}
				>
					<CloseOutlined />
				</Button>

			</div>

		</div>
	);
};

export default PublishCourseForm;
