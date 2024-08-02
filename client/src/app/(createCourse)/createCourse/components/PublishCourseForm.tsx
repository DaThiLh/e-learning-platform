import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import styles from "./PublishCourseForm.module.scss";
import { Typography, Form, Select, Button, Tooltip } from "antd";
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

const initialInstructorOptions = [
	{
		name: "JackJackJackJackJackJackJackJackJackJackJackJack",
		role: "Instructor",
	},
	{ name: "Lucy", role: "Instructor" },
	{ name: "Tom", role: "VIP Instructor" },
];

const PublishCourseForm = () => {
	const [instructors, setInstructors] = useState<
		{ name: string; role: string }[]
	>([]);
	const [availableInstructors, setAvailableInstructors] = useState(
		initialInstructorOptions
	);

	const addInstructor = (instructorName: string) => {
		const selectedInstructor = availableInstructors.find(
			(instr) => instr.name === instructorName
		);

		if (selectedInstructor) {
			setInstructors([...instructors, selectedInstructor]);
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
		setInstructors(
			instructors.filter((instr) => instr.name !== instructorName)
		);
		setAvailableInstructors(
			availableInstructors.map((option) =>
				option.name === instructorName
					? { ...option, disabled: false }
					: option
			)
		);
	};

	return (
		<div className="w-full p-4">
			<HeaderForm headerName="Publish Course" />
			<hr className="mb-2" />
			<div className={styles.publishCourseFormContainer}>
				<SetPriceCard />
				
				<br />

				<AddInstructorCard
					instructors={instructors}
					availableInstructors={availableInstructors}
					addInstructor={addInstructor}
					removeInstructor={removeInstructor}
				/>

				<NavigationButton
					leftButton="Previous"
					rightButton="Submit For Review"
				/>
			</div>
		</div>
	);
};

const SetPriceCard = () => {
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
							<Select>
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
							<Select>
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
