import React, { useState } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, message, Upload, Button, Typography, Tooltip } from "antd";
import { UploadOutlined, PlusOutlined, CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import styles from "./AdvanceInformationForm.module.scss";
import NavigationButton from "./NavigationButton";
const { Title } = Typography;

const { Dragger } = Upload;

interface advanceInformationProps {
	objectifs: string[];
	requirements: string[];
}

const AdvanceInformationForm = () => {
	const [fileList, setFileList] = useState([]);
	const [preview, setPreview] = useState("");
	const [listOfObjectifs, setListOfObjectifs] = useState([1, 2]);
	const [listOfRequirements, setListOfRequirements] = useState([1, 2]);

	const handleChange = (info) => {
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

	const beforeUpload = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview(e.target.result);
		};
		reader.readAsDataURL(file);
		return false; // Prevent automatic upload to allow custom behavior
	};

	const uploadProps: UploadProps = {
		name: "file",
		multiple: true,
		action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
		onChange: handleChange,
		beforeUpload: beforeUpload,
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
		fileList: fileList,
	};

	const addObjectif = () => {
		const newObjectif = listOfObjectifs.length + 1;
		setListOfObjectifs([...listOfObjectifs, newObjectif]);
	};

	const deleteItemObjectif = (index: number) => {
		if (listOfObjectifs.length <= 2) return;
		setListOfObjectifs(listOfObjectifs.filter((item) => item !== index));
	};

	const addRequirement = () => {
		const newRequirement = listOfRequirements.length + 1;
		setListOfRequirements([...listOfRequirements, newRequirement]);
	};

	const deleteItemRequirement = (index: number) => {
		if (listOfRequirements.length <= 2) return;
		setListOfRequirements(listOfRequirements.filter((item) => item !== index));
	}

	return (
		<div className={styles.advanceInformationFormContainer}>
			<HeaderForm headerName="Advance Information" />
			<div
				className={`flex flex-row items-center pb-2 ${preview ? "justify-start" : "justify-center"
					}`}
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
				<div
					className={`w-${preview ? "2/5" : "full"
						} flex justify-center`}
				>
					<Upload {...uploadProps}>
						<Button icon={<UploadOutlined />}>
							Click to Upload
						</Button>
					</Upload>
				</div>
			</div>
			<hr />
			<Form layout="vertical">
				<div className="flex flex-row justify-between py-2 gap-4">
					<Title level={5}>
						What do you will teach in this course?
					</Title>
					<Button
						danger
						onClick={addObjectif}
						className="w-1/12 lg:w-full "
					>
						<PlusOutlined />
						<span className="text-btn-add-new">Add new</span>
					</Button>
				</div>
				{listOfObjectifs.map((objectif) => {
					const label = objectif > 9 ? `${objectif}` : `0${objectif}`;
					return (
						<Form.Item
							label={label}
							name={`objective-${objectif}`}
							key={objectif}
						>
							<div className="flex justify-between">
								<Input
									placeholder="What students are expected to achieve by the end of the course."
									showCount
									maxLength={160}
								/>
								<Tooltip title={listOfObjectifs.length <= 2 && objectif <= 2 ?
									<>
										<CloseCircleOutlined />
										<span> Objectif must have one item.</span>
									</> : ""}>
									<Button className="buttonDeleteItem" onClick={() => deleteItemObjectif(objectif)}>
										<CloseOutlined />
									</Button>
								</Tooltip>
							</div>
						</Form.Item>
					);
				})}
			</Form>

			<hr className="my-2" />

			<Form layout="vertical">
				<div className="flex flex-row justify-between py-2 gap-4">
					<Title level={5}>Course requirements</Title>
					<Button danger onClick={addRequirement}>
						<PlusOutlined />
						<span className="text-btn-add-new">Add new</span>
					</Button>
				</div>
				{listOfRequirements.map((requirement) => {
					const label =
						requirement > 9 ? `${requirement}` : `0${requirement}`;
					return (
						<Form.Item
							label={label}
							name={`requirement-${requirement}`}
							key={requirement}
						>
							<div className="flex justify-between">
								<Input
									placeholder="What is you course requirements."
									showCount
									maxLength={160}
								/>
								<Tooltip title={listOfRequirements.length <= 2 && requirement <= 2 ?
									<>
										<CloseCircleOutlined />
										<span> Objectif must have one item.</span>
									</> : ""}>
									<Button className="buttonDeleteItem" onClick={() => deleteItemRequirement(requirement)}>
										<CloseOutlined />
									</Button>
								</Tooltip>
							</div>
						</Form.Item>
					);
				})}
			</Form>
			<NavigationButton leftButton="Previous" rightButton="Next" actionRightButton={() => { }} />
		</div>
	);
};

export default AdvanceInformationForm;
