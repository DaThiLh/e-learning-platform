import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import styles from "./PublishCourseForm.module.scss";
import { Typography, Form, Select, Button, Tooltip, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import NavigationButton from "./NavigationButton";

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

const PublishCourseForm = ({moveToPreviousForm, handleSubmitForm}: {
	moveToPreviousForm: () => void;
	handleSubmitForm: () => void;
}) => {
	const [publishCourse, setPublishCourse] = useState<PublishCourseProps>(defaultPublishCourse);
	const [availableInstructors, setAvailableInstructors] = useState(initialInstructorOptions);
	const [showablePopupSubmit, setShowablePopupSubmit] = useState(false);

	const addInstructor = (instructorName: string) => {
		const selectedInstructor = availableInstructors.find(
			(instr) => instr.name === instructorName
		);

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
						? { ...instr, disabled: true }
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
				onOk={() => setShowablePopupSubmit(true)} 
				onCancel={() => setShowablePopupSubmit(true)}
				okText="Yes"
			>
				<p>Are you sure you want to submit this course?</p>
				
      </Modal>

			<NavigationButton
				leftButton="Previous"
				rightButton="Submit"
				actionLeftButton={() => moveToPreviousForm()}
				actionRightButton={() => {
					handleSubmitForm(); 
					setShowablePopupSubmit(true);
				}}
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

const InstructorCard = ({
	username,
	role,
	onRemove,
}: {
	username: string;
	role: string;
	onRemove: () => void;
}) => {
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
			<Button onClick={onRemove} type="text">
				<CloseOutlined />
			</Button>
		</div>
	);
};

export default PublishCourseForm;
