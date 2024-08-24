"use client";

import React, { useState, useEffect } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, Button, Typography, Radio, message, Select, Table, InputNumber, Modal, Tooltip } from "antd";
import styles from "./CurriculumForm.module.scss";
import { DeleteOutlined, PlusOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import NavigationButton from "./NavigationButton";
import type { TableProps } from 'antd';
import languages from './languages.json';
import TextArea from "antd/es/input/TextArea";
const { Title } = Typography;

type CaptionType = {
	caption: string;
	language: string;
};

type QuizItemType = {
	question: string;
	answer: [choice: string[], explanation: string[]];
	correctAnswer: string;
};

type LectureItemType = {
	urlVideo: string;
	description?: string;
	resource?: string;
	caption?: CaptionType[];
};

type ItemCardType = {
	title: string;
	description: string;
	content?: [QuizItemType] | LectureItemType;
};

type SectionType = {
	title: string;
	items: ItemCardType[];
};

type CurriculumFormType = {
	sections: SectionType[];
};

interface Lecture_ItemCardProps {
	indexSection: number;
	indexItem: number;
	lectureInfo: LectureItemType;
	setUrlVideoValue(value: string): void;
	setDescriptionValue(value: string): void;
	setResourceValue(value: string): void;
	setCaptionValue(value: CaptionType[]): void;
}

interface Quiz_ItemCardProps {
	question: string;
	answer: string[];
	explanation: string[];
	correctAnswer: string;
	setQuestion(value: string): void;
	setAnswer(value: string[]): void;
	setExplanation(value: string[]): void;
	setCorrectAnswer(value: string): void;
}

interface Quiz_TitleCardProps {
	handleBack(): void;
	setTitle(title: string): void;
	setDescription(description: string): void;
	setItemType(itemType: string): void;
}

interface Lecture_TitleCardProps {
	handleBack(): void;
	setTitle(title: string): void;
	setItemType(itemType: string): void;
}

interface ItemsInQuizCardProps {
	indexSection: number;
	indexItem: number;
	quizzes: QuizItemType[];
}

interface ItemCardProps {
	item: ItemCardType;
	indexSection: number;
	indexItem: number;
	onDelete: () => void;
	isLastItem: boolean;
}

interface SectionTypeProps {
	section: SectionType;
	index: number;
	onDelete: () => void;
	isLastSection: boolean;
}

interface CurriculumFormProps {
	moveToPreviousForm: () => void;
	moveToNextForm: () => void;
}

interface ItemTypeProps {
	setItemType: (itemType: string) => void;
	setTitle: (title: string) => void;
	setDescription: (description: string) => void;
}

const contentTypes = [
	{ value: "Video", label: "Video" },
	{ value: "Article", label: "Article" },
];

const itemTypes = [
	{ value: "lecture", label: "Lecture" },
	{ value: "quiz", label: "Quiz" },
];

const defaultItemQuiz: QuizItemType = {
	question: "",
	answer: [["", "", "", ""], ["", "", "", ""]],
	correctAnswer: "",
};

const defaultItemLecture: LectureItemType = {
	urlVideo: "",
	description: "",
	resource: "",
	caption: [],
};

const defaultCurriculum: CurriculumFormType = {
	sections: [
		{
			title: "",
			items: [
				{
					title: "",
					description: "",
					content: defaultItemLecture,
				},
			],
		},
	],
};

interface DataTableLectureType {
	key: React.Key;
	lectureType: string;
	fileName: string;
	type: string;
	date: Date;
	align: string;
	onHeaderCell?: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: any;
	inputType: 'number' | 'text';
	record: DataTableLectureType;
	index: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const CurriculumForm = ({
	moveToPreviousForm,
	moveToNextForm
}: CurriculumFormProps) => {
	const [curriculumInformation, setCurriculumInformation] = useState<CurriculumFormType>(() => {
		const savedData = window.localStorage.getItem("curriculumInformation");
		return savedData
			? JSON.parse(savedData)
			: defaultCurriculum;
	});

	const [sectionsInForm, setSections] = useState<SectionType[]>(curriculumInformation.sections);

	const handleSubmitForm = () => {
		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		console.log(CurriculumFrom);
		moveToNextForm();
	}

	const handleAddSection = () => {
		const newSection = {
			title: "",
			items: [],
		};

		setSections([...sectionsInForm, newSection]);

		// handle save to local storage
		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumFrom ? JSON.parse(CurriculumFrom) : defaultCurriculum;
		curriculum.sections.push(newSection);
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
		setCurriculumInformation(curriculum);
	};

	const handleDeleteSection = (index: number) => {
		if (sectionsInForm.length < 2) return;

		const newSections = sectionsInForm.filter((_, i) => i !== index);
		setSections(newSections);

		// handle save to local storage
		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumFrom ? JSON.parse(CurriculumFrom) : defaultCurriculum;
		curriculum.sections = newSections;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));

		const removedKey: string[] = [];

		for (let i in localStorage) {
			if (i.includes(`selectedItemType-${index}-`)) {
				removedKey.push(i);
			}
			if (i.includes(`selectedContentType-${index}-`)) {
				removedKey.push(i);
			}
		}

		removedKey.forEach((key) => {
			localStorage.removeItem(key);
		});

		setCurriculumInformation(curriculum);
	};

	return (
		<div className={styles.curriculumFormContainer}>
			<HeaderForm headerName="Curriculum Form" />
			<hr className="mb-2" />
			<div>
				<Form layout="vertical">
					<div className="flex flex-col justify-center items-center p-2">
						{sectionsInForm.map((section, index) => (
							<>
								<SectionCard
									key={index}
									section={section}
									index={index}
									onDelete={() => handleDeleteSection(index)}
									isLastSection={sectionsInForm.length === 1}
								/>
								<br />
							</>
						))}
						<Button className="btn-add-section" onClick={handleAddSection}>
							Section <PlusOutlined />
						</Button>
					</div>
				</Form>
			</div>
			<NavigationButton
				leftButton="Previous"
				rightButton="Next"
				actionLeftButton={moveToPreviousForm}
				actionRightButton={handleSubmitForm}
			/>
		</div>
	);
};

const SectionCard = ({ section, index, onDelete, isLastSection }: SectionTypeProps) => {
	const [itemsInSection, setItemsInSection] = useState<ItemCardType[]>(section.items);
	const [title, setTitle] = useState<string>(section.title || '');

	const handleAddItem = () => {
		const newItem: ItemCardType = {
			title: "",
			description: "",
			content: undefined,
		};

		setItemsInSection([...itemsInSection, newItem]);
		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumFrom ? JSON.parse(CurriculumFrom) : defaultCurriculum;
		curriculum.sections[index].items.push(newItem);
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
	};

	const handleDeleteItem = (indexItem: number) => {
		if (itemsInSection.length < 2) return;

		const newItems = itemsInSection.filter((_, i) => i !== indexItem);
		setItemsInSection(newItems);

		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumFrom ? JSON.parse(CurriculumFrom) : defaultCurriculum;
		curriculum.sections[index].items = newItems;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
		localStorage.removeItem(`selectedItemType-${index}-${indexItem}`);

		//change all index of items in local storage
		for (let i = indexItem; i < newItems.length; i++) {
			const itemType = localStorage.getItem(`selectedItemType-${index}-${i + 1}`);
			if (itemType) {
				localStorage.setItem(`selectedItemType-${index}-${i}`, itemType);
				localStorage.removeItem(`selectedItemType-${index}-${i + 1}`);
			}
		}
	};

	const handleSetTitle = (value: string) => {
		setTitle(value);
		
		const CurriculumForm = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumForm ? JSON.parse(CurriculumForm) : defaultCurriculum;
		curriculum.sections[index].title = value;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
	};

	useEffect(() => { setTitle(section.title) }, [section.title]);
	useEffect(() => { setItemsInSection(section.items) }, [section.items]);

	return (
		<div className={styles.sectionContainer}>
			<div className="flex flex-row space-x-2 pb-2">
				<Title level={4}>{`Section ${index + 1}`}</Title>
				<Input
					placeholder="Section Title"
					value={title}
					onChange={(e) => handleSetTitle(e.target.value)}
				/>
				<Tooltip title={isLastSection ? "Section must have at least one item" : ""}>
					<Button
						className="btn-menu-section"
						onClick={onDelete}
						disabled={isLastSection}
					>
						<DeleteOutlined />
					</Button>
				</Tooltip>
			</div>
			{itemsInSection?.map((item, indexItem) => (
				<div key={`${index}-${indexItem}`} className="pb-2">
					<ItemCard
						item={item}
						indexSection={index}
						indexItem={indexItem}
						onDelete={() => handleDeleteItem(indexItem)}
						isLastItem={itemsInSection.length === 1}
					/>
				</div>
			))}
			<Button onClick={handleAddItem} className="btn-add-item">
				Curriculum Item
				<PlusOutlined />
			</Button>
		</div>
	);
};

const ItemCard = ({ item, indexSection, indexItem, onDelete, isLastItem }: ItemCardProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>(() => {
		const storedItemType = localStorage.getItem(`selectedItemType-${indexSection}-${indexItem}`);
		return storedItemType || null;
	});

	const [title, setTitle] = useState<string>(item.title);
	const [description, setDescription] = useState<string>(item.description);
	const [lectureInfo, setLectureInfo] = useState<LectureItemType | null>(() => {
		const content = item.content;
		return content && 'urlVideo' in content ? (content as LectureItemType) : defaultItemLecture;
	});

	const [quizInfo, setQuizInfo] = useState<QuizItemType | null>(() => {
		const content = item.content;
		return content && 'question' in content ? (content as QuizItemType) : defaultItemQuiz;
	});

	const handleSetTitle = (value: string) => {
		setTitle(value);
		const CurriculumForm = localStorage.getItem("curriculumInformation");
		const curriculumn = CurriculumForm ? JSON.parse(CurriculumForm) : defaultCurriculum;
		curriculumn.sections[indexSection].items[indexItem].title = value;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculumn));
	}

	const handleSetDescription = (value: string) => {
		setDescription(value);
		const CurriculumForm = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumForm ? JSON.parse(CurriculumForm) : defaultCurriculum;
		curriculum.sections[indexSection].items[indexItem].description = value;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
	}

	const handleSetItemType = (itemType: string) => {
		setSelectedItemType(itemType);
		localStorage.setItem(`selectedItemType-${indexSection}-${indexItem}`, itemType);

		const CurriculumFrom = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumFrom ? JSON.parse(CurriculumFrom) : defaultCurriculum;
		curriculum.sections[indexSection].items[indexItem].content =
			itemType === "quiz" ? quizInfo : lectureInfo;
		localStorage.setItem("curriculumInformation", JSON.stringify(curriculum));
	};

	const setUrlVideoValue = (value: string) => {
		setLectureInfo(prevLectureInfo => ({
			...prevLectureInfo,
			urlVideo: value
		}));
	};

	const setDescriptionValue = (value: string) => {
		// setLectureInfo(prevLectureInfo => ({
		// 	...prevLectureInfo,
		// 	description: value
		// }));
	};

	const setResourceValue = (value: string) => {
		// setLectureInfo(prevLectureInfo => ({
		// 	...prevLectureInfo,
		// 	resource: value
		// }));
	}

	const setCaptionValue = (value: CaptionType[]) => {
		// setLectureInfo(prevLectureInfo => ({
		// 	...prevLectureInfo,
		// 	caption: value
		// }));
	}

	return (
		<div className={styles.itemContainer}>
			{selectedItemType === null && (
				<ItemType
					setTitle={handleSetTitle}
					setDescription={handleSetDescription}
					setItemType={handleSetItemType}
				/>
			)}

			{(selectedItemType === "quiz" || selectedItemType === "lecture") && (
				<>
					<div className="flex flex-col w-full">
						<div className="flex flex-row space-x-2 items-start">
							<Title level={5} className="mt-1">
								{selectedItemType === "quiz"
									? `Quiz ${indexItem + 1}`
									: `Lecture ${indexItem + 1}`}
							</Title>
							<Input
								placeholder="Title"
								value={title}
								onChange={(e) => handleSetTitle(e.target.value)}
							/>
							<Tooltip title={isLastItem ? "Item must have at least one" : ""}>
								<Button
									className="btn-delete-quiz"
									onClick={onDelete}
									disabled={isLastItem}
								>
									<DeleteOutlined />
								</Button>
							</Tooltip>
						</div>
						{selectedItemType === "quiz" && (
							<ItemsInQuizCard
								indexSection={indexSection}
								indexItem={indexItem}
								quizzes={quizInfo ? [quizInfo] : []}
							/>
						)}
						{selectedItemType === "lecture" && (
							<>
								<ItemInLectureCard
									lectureInfo={defaultItemLecture}
									indexSection={indexSection}
									indexItem={indexItem}
									setUrlVideoValue={setUrlVideoValue}
									setDescriptionValue={setDescriptionValue}
									setResourceValue={setResourceValue}
									setCaptionValue={setCaptionValue}
								/>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

const ItemType = ({
	setTitle,
	setDescription,
	setItemType,
}: ItemTypeProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>(null);

	const handleBack = () => {
		setSelectedItemType(null);
	};

	const handleSetItemType = (value: string) => {
		setSelectedItemType(value);
	}

	return (
		<div className={"flex gap-2 w-full"}>
			{!selectedItemType && (
				<>
					<Button onClick={() => {
						handleSetItemType("lecture");
					}}>
						<PlusOutlined />
						Lecture
					</Button>
					<Button onClick={() => {
						handleSetItemType("quiz");
					}}>
						<PlusOutlined />
						Quiz
					</Button>
				</>
			)}

			{selectedItemType === "lecture" && (
				<Lecture_TitleCard
					handleBack={handleBack}
					setTitle={setTitle}
					setItemType={setItemType}
				/>
			)}

			{selectedItemType === "quiz" && (
				<Quiz_TitleCard
					handleBack={handleBack}
					setTitle={setTitle}
					setDescription={setDescription}
					setItemType={setItemType}
				/>
			)}
		</div>
	);
};

const ItemsInQuizCard = ({indexSection, indexItem, quizzes }: ItemsInQuizCardProps) => {
	const [listOfQuizs, setQuizs] = useState<QuizItemType[]>([defaultItemQuiz]);
	const [showableQuizItem, setShowableQuizItem] = useState<boolean>(false);
	const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (saveSuccess) {
			setShowableQuizItem(false);
		}
	}, [saveSuccess]);

	const handleAddQuizItem = () => {
		setQuizs([...listOfQuizs, defaultItemQuiz]);
	};

	const saveAllItemsInQuiz = () => {
    let quizIndex = 0;

    for (let item of listOfQuizs) {
        if (item.question === "") {
            message.error(`Please fill question ${quizIndex + 1}`);
            return;
        }

        let hasCorrectAnswer = false;
        let answerIndex = 0;
        for (let answer of item.answer[0]) {
            if (answer === "") {
                message.error(`Please fill answer ${answerIndex + 1} in question ${quizIndex + 1}`);
                return;
            }
            if (item.correctAnswer === `answer-${answerIndex}`) {
                hasCorrectAnswer = true;
            }
            answerIndex++;
        }

        if (!hasCorrectAnswer) {
            message.error(`Please select correct answer in question ${quizIndex + 1}`);
            return;
        }
        quizIndex++;
    }

    message.success("All questions are filled");
    setSaveSuccess(true);

    const CurriculumForm = localStorage.getItem("curriculumInformation");
    const curriculum = CurriculumForm ? JSON.parse(CurriculumForm) : defaultCurriculum;
    const updatedItems = [...curriculum.sections[indexSection].items];
    updatedItems[indexItem].content = listOfQuizs;
    const updatedCurriculum = { ...curriculum, sections: updatedItems };

    localStorage.setItem("curriculumInformation", JSON.stringify(updatedCurriculum));
	};


	const setQuestionInItem = (index: number, value: string) => {
		const newQuizs = [...listOfQuizs];
		newQuizs[index].question = value;
		setQuizs(newQuizs);
	};

	const setAnswerInItem = (index: number, value: string[]) => {
		const newQuizs = [...listOfQuizs];
		newQuizs[index].answer[0] = value;
		setQuizs(newQuizs);
	};

	const setExplanationInItem = (index: number, value: string[]) => {
		const newQuizs = [...listOfQuizs];
		newQuizs[index].answer[1] = value;
		setQuizs(newQuizs);
	};

	const setCorrectAnswerInItem = (index: number, value: string) => {
		const newQuizs = [...listOfQuizs];
		newQuizs[index].correctAnswer = value;
		setQuizs(newQuizs);
	};

	return (
		<div className={styles.ItemsInQuizContainer}>
			{showableQuizItem ? (
				<>
					<div className="flex flex-col w-full">
						{listOfQuizs.map((quizItem, index) => (
							<Quiz_ItemCard
								key={index}
								question={quizItem.question}
								setQuestion={(value: string) => setQuestionInItem(index, value)}
								answer={quizItem.answer[0]}
								setAnswer={(value: string[]) => setAnswerInItem(index, value)}
								explanation={quizItem.answer[1]}
								setExplanation={(value: string[]) => setExplanationInItem(index, value)}
								correctAnswer={quizItem.correctAnswer}
								setCorrectAnswer={(value: string) => setCorrectAnswerInItem(index, value)}
							/>
						))}
					</div>
					<div className="flex justify-between w-full px-2 mt-4">
						<Button
							type="primary"
							onClick={handleAddQuizItem}
						>
							Add Question <PlusOutlined />
						</Button>
						<Button
							type="primary"
							onClick={saveAllItemsInQuiz}
							className="btn-save"
						>
							Save
						</Button>
					</div>
				</>
			) : (
				<div className="flex items-center justify-between">
					<Button
						type="primary"
						onClick={() => {
							setShowableQuizItem(true);
							if (saveSuccess === true) {
								setSaveSuccess(false);
							}
						}}
					>
						{saveSuccess === true && <span>Edit Question</span>}
						{saveSuccess === false && <span>Add Question <PlusOutlined /></span>}
					</Button>
				</div>
			)}
		</div>
	);
};

const Quiz_TitleCard = ({
	handleBack,
	setTitle,
	setDescription,
	setItemType,
}: Quiz_TitleCardProps) => {
	const [title, setTitleState] = useState<string>("");
	const [description, setDescriptionState] = useState<string>("");

	const onFinish = () => {
		setTitle(title);
		setDescription(description);
		setItemType("quiz");
	};

	return (
		<div className={styles.quizTitleCardContainer}>
			<div className="content">
				<Title level={5} className="w-1/4">New Quiz:</Title>
				<div className="flex flex-col w-4/5 gap-1">
					<Input
						name="title"
						placeholder="Enter a title"
						value={title}
						allowClear
						onChange={(e) => setTitleState(e.target.value)}
					/>
					<Input.TextArea
						placeholder="Enter a description"
						value={description}
						onChange={(e) => setDescriptionState(e.target.value)}
						allowClear
					/>
				</div>
			</div>
			<div className="flex flex-row justify-end gap-4">
				<Button onClick={handleBack}>Cancel</Button>
				<Button type="primary" onClick={onFinish}>
					Add <PlusOutlined />
				</Button>
			</div>
		</div>
	);
};

const Quiz_ItemCard = ({
	question,
	answer,
	explanation,
	correctAnswer,
	setQuestion,
	setAnswer,
	setExplanation,
	setCorrectAnswer,
}: Quiz_ItemCardProps) => {

	const handleAnswerChange = (index: number, value: string) => {
		const newAnswers = [...answer];
		newAnswers[index] = value;
		setAnswer(newAnswers);
	};

	const handleExplanationChange = (index: number, value: string) => {
		const newExplanations = [...explanation];
		newExplanations[index] = value;
		setExplanation(newExplanations);
	};

	const addAnswer = () => {
		const newAnswers = [...answer, ""];
		const newExplanations = [...explanation, ""];
		setAnswer(newAnswers);
		setExplanation(newExplanations);
	};


	return (
		<div className={styles.quizItemCardContainer}>
			<div className="item">
				<div className="question">
					<Title level={5}>Question</Title>
					<Form.Item
						rules={[{ required: true, message: 'Question is required' }]}
					>
						<Input
							placeholder="Question"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							showCount
							maxLength={600}
						/>
					</Form.Item>
				</div>
				<div className="answer">
					<div className="flex justify-between pb-2">
						<Title level={5}>Answer</Title>
						<Button onClick={addAnswer}>
							Add <PlusOutlined />
						</Button>
					</div>
					<Radio.Group
						value={correctAnswer}
						onChange={(e) => setCorrectAnswer(e.target.value)}
					>
						{answer.map((choice, index) => (
							<div key={index} className="flex items-start w-full">
								<Radio value={`answer-${index}`} className="mr-2" />
								<div className="flex flex-col w-full pb-2">
									<Form.Item
										rules={[{ required: true, message: 'Answer is required' }]}
									>
										<Input
											placeholder={`Answer ${index + 1}`}
											allowClear
											showCount
											maxLength={600}
											value={choice}
											onChange={(e) => handleAnswerChange(index, e.target.value)}
										/>
									</Form.Item>
									<Form.Item
									>
										<Input
											placeholder={`Explanation ${index + 1} (optional)`}
											allowClear
											showCount
											maxLength={600}
											value={explanation[index]}
											onChange={(e) =>
												handleExplanationChange(index, e.target.value)
											}
										/>
									</Form.Item>
								</div>
							</div>
						))}
					</Radio.Group>
				</div>
			</div>
		</div>
	);
};

const Lecture_TitleCard = ({
	handleBack,
	setTitle,
	setItemType
}: Lecture_TitleCardProps) => {
	const [title, setTitleState] = useState<string>("");
	const [errorTitle, setErrorTitle] = useState<boolean>(false);

	const handleAddTitle = () => {
		if (title.trim() === "") {
			setErrorTitle(true);
			return;
		}

		setTitle(title); 
		setItemType("lecture");
	}

	return (
		<div className={styles.quizTitleCardContainer}>
			<div className="content">
				<Title level={5} className="w-1/4">New Lecture:</Title>
				<div className="flex flex-col w-4/5 gap-1">
					<Input
						name="title"
						placeholder="Enter a title"
						value={title}
						allowClear
						onChange={(e) => {
							setTitleState(e.target.value);
						}}
					/>
					{errorTitle && <span className="error-message">* Title is required</span>}
				</div>
			</div>
			<div className="flex flex-row justify-end gap-4">
				<Button onClick={handleBack}>Cancel</Button>
				<Button type="primary" onClick={handleAddTitle}>
					Add <PlusOutlined />
				</Button>
			</div>
		</div>
	)
};

const ItemInLectureCard = ({
	lectureInfo, indexSection, indexItem, setUrlVideoValue, setDescriptionValue, setResourceValue, setCaptionValue
}: Lecture_ItemCardProps) => {
	const [lecture, setLecture] = useState<LectureItemType>(() => {
		const CurriculumnForm = localStorage.getItem("curriculumInformation");
		const curriculum = CurriculumnForm ? JSON.parse(CurriculumnForm) : defaultCurriculum;
		return curriculum.sections[indexSection].items[indexItem].content as LectureItemType;
	});
	const [errors, setErrors] = useState({
		urlVideo: false,
		description: false,
		resource: false,
		caption: false,
	});

	const [selectedContentType, setSelectedContentType] = useState<string | null>(
		() => {
			const storedContentType = localStorage.getItem(
				`selectedContentType-${indexSection}-${indexItem}`
			);
			return storedContentType || null;
		}
	);
	const [showableContentType, setShowableContentType] = useState<boolean>(true);
	const [showableComponent, setShowableComponent] = useState<boolean>(true);
	const [form] = Form.useForm();
	const [data, setData] = useState<DataTableLectureType[]>([]);
	const [editingKey, setEditingKey] = useState('');
	const [popups, setPopups] = useState({
		description: false,
		resource: false,
		caption: false,
	});
	const [captions, setCaptions] = useState<CaptionType[]>([]);
	const [captionError, setCaptionError] = useState(false);
	const [noChooseLanguage, setNoChooseLanguage] = useState(false);
	const [contentDescription, setContentDescription] = useState<string>("");
	const [urlResource, setUrlResource] = useState<string>("");
	const [urlCaption, setUrlCaption] = useState<string>("");
	const [captionLanguage, setCaptionLanguage] = useState<string>("");
	const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

	const handleSetContentType = (value: string) => {
		setSelectedContentType(value);
		setShowableContentType(false);
		localStorage.setItem(`selectedContentType-${indexSection}-${indexItem}`, value);
	}

	const isEditing = (record: DataTableLectureType) => record.key === editingKey;

	const edit = (record: Partial<DataTableLectureType> & { key: React.Key }) => {
		form.setFieldsValue({ fileName: '', action: '', align: '', ...record });
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields()) as DataTableLectureType;

			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setData(newData);
				setEditingKey('');
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const deleteRow = (key: React.Key) => {
		const newData = data.filter((item) => item.key !== key);
		setData(newData);
		setEditingKey('');

		if (data.find((item) => item.key === key)?.lectureType.includes('Description')) {
			setContentDescription("");
		}

		if (data.find((item) => item.key === key)?.lectureType.includes('Resource')) {
			setUrlResource("");
		}
	};

	const columns = [
		{
			title: 'Lecture Type',
			dataIndex: 'lectureType',
			align: 'center',
			width: '30%',
			ellipsis: true,
		},
		{
			title: 'Content',
			dataIndex: 'fileName',
			editable: true,
			align: 'center',
			width: '50%',
			ellipsis: true,
		},
		{
			title: 'Action',
			dataIndex: 'action',
			align: 'center',
			width: '20%',
			render: (_: any, record: DataTableLectureType) => {
				const editable = isEditing(record);
				return editable ? (
					<span className="space-x-2">
						{
							record.lectureType === 'Lecture' ? <>
								<Tooltip title="Save">
									<Typography.Link className="mr-1" onClick={() => save(record.key)}>
										<SaveOutlined />
									</Typography.Link>
								</Tooltip>
							</> : <>
								<Tooltip title="Save">
									<Typography.Link className="mr-1" onClick={() => save(record.key)}>
										<SaveOutlined />
									</Typography.Link>
								</Tooltip>
								<Tooltip title="Delete">
									<Typography.Link className="mr-1" onClick={() => deleteRow(record.key)}>
										<DeleteOutlined />
									</Typography.Link>
								</Tooltip>
							</>
						}
						<Tooltip title="Cancel">
							<Typography.Link onClick={cancel} className="mr-1">
								<CloseOutlined />
							</Typography.Link>
						</Tooltip>
					</span>
				) : (
					<Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
						Edit
					</Typography.Link>
				);
			},
			ellipsis: true,
		},
	];

	const mergedColumns: TableProps['columns'] = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: DataTableLectureType) => ({
				record,
				inputType: col.dataIndex === 'age' ? 'number' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	const optionsLanguage = languages.map(lang => ({
		label: lang.name,
		value: lang.code,
	}));

	const handleSaveAllItems = () => {
		handleStateChange("description", contentDescription);
		handleStateChange("resource", urlResource);
		handleStateChange("caption", captions);
		setSaveSuccess(true);
	};

	const hanldeAddDescription = () => {
		setPopups(prevPopups => ({ ...prevPopups, description: false }));
		setData([...data, {
			key: data.length,
			lectureType: 'Description',
			fileName: contentDescription,
			type: 'TEXT',
			date: new Date(),
			align: 'center',
		}]);
	}

	const hanldeAddResource = () => {
		setPopups(prevPopups => ({ ...prevPopups, resource: false }));
		setData([...data, {
			key: data.length,
			lectureType: 'Resource',
			fileName: urlResource,
			type: 'URL',
			date: new Date(),
			align: 'center',
		}]);
	}

	const handleAddCaption = () => {
		if (urlCaption === "" || captionLanguage === "") {
			setCaptionError(urlCaption === "");
			setNoChooseLanguage(captionLanguage === "");
		} else {
			setCaptionError(false);
			setNoChooseLanguage(false);
			setPopups(prevPopups => ({ ...prevPopups, caption: false }));
			setCaptions([...captions, {
				caption: urlCaption,
				language: captionLanguage,
			}]);
			setData([...data, {
				key: data.length,
				lectureType: `Caption: ${captionLanguage}`,
				fileName: urlCaption,
				type: 'URL',
				date: new Date(),
				align: 'center',
			}]);
			setUrlCaption("");
			setCaptionLanguage("");
		}
	}

	const handleAddUrlVideo = () => {
		if (lecture.urlVideo === "") {
			setErrors(prevErrors => ({
				...prevErrors,
				urlVideo: true,
			}));
		} else {
			handleStateChange("urlVideo", lecture.urlVideo);
			setShowableComponent(false);
			setShowableContentType(false);
			setData([...data, {
				key: data.length,
				lectureType: 'Lecture URL',
				fileName: lecture.urlVideo,
				type: 'url',
				date: new Date(),
				align: 'center',
			}]);
		}
	};

	const handleStateChange = (name: keyof Lecture_ItemCardProps["lectureInfo"], value: string | CaptionType[]) => {
		setLecture((prevLectureInfo) => {
			const newState = { ...prevLectureInfo, [name]: value };

			const curriculum = localStorage.getItem("curriculumInformation");
			const curriculumn = curriculum ? JSON.parse(curriculum) : defaultCurriculum;
			curriculumn.sections[indexSection].items[indexItem].content = newState;
			localStorage.setItem("curriculumInformation", JSON.stringify(curriculumn));

			return newState;
		});
	};

	return (
		<div className={styles.ItemsInLectureContainer}>
			{
				showableContentType && (
					<Select
						placeholder="Content Type"
						onChange={(e) => handleSetContentType(e)}
					>
						{contentTypes.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				)
			}

			{
				showableComponent && (
					<div>
						{selectedContentType === "Video" && (
							<>
								<div className="contentVideo">
									<Title level={5}>Video:</Title>
									<div className="flex">
										<Input
											placeholder="Enter the video URL"
											value={lecture.urlVideo}
											onChange={(e) => handleStateChange("urlVideo", e.target.value)}
											status={errors.urlVideo ? "error" : ""}
										/>
										<Button onClick={handleAddUrlVideo}>
											Submit
										</Button>
									</div>
									{errors.urlVideo && <p style={{ color: 'red' }}>Video URL is required.</p>}
								</div>
							</>
						)}
						{
							selectedContentType === "Article" && (
								<span>hihiarticle</span>
							)
						}
					</div>
				)
			}

			{
				!showableComponent && !saveSuccess && (
					<>
						<div className="w-full pt-2">
							<Form form={form} component={false}>
								<Table
									components={{
										body: {
											cell: EditableCell,
										},
									}}
									bordered
									dataSource={data}
									columns={mergedColumns}
									rowClassName="editable-row"
									pagination={false}
								/>
							</Form>
							<div className="flex justify-between mt-8">
								<div className="flex space-x-1">
									{
										contentDescription === "" &&
										<Button onClick={() => setPopups(prevPopups => ({ ...prevPopups, description: true }))}>
											Add Description
											<PlusOutlined />
										</Button>
									}
									{
										urlResource === "" &&
										<Button onClick={() => setPopups(prevPopups => ({ ...prevPopups, resource: true }))}>
											Add Resource
											<PlusOutlined />
										</Button>
									}
									<Button onClick={() => setPopups(prevPopups => ({ ...prevPopups, caption: true }))}>
										Add Caption
										<PlusOutlined />
									</Button>
								</div>
								<Button onClick={handleSaveAllItems}>
									Save
								</Button>
							</div>
							<Modal title="Add Description(Optional)" centered open={popups.description} onOk={hanldeAddDescription} onCancel={() => setPopups(prevPopups => ({ ...prevPopups, description: false }))}>
								<TextArea placeholder="Enter a description" showCount className="mb-2" value={contentDescription}
									onChange={(e) => setContentDescription(e.target.value)}
								/>
								<span>
									* Each lecture can have a description.
								</span>
							</Modal>
							<Modal title="Add Resource" centered open={popups.resource} onOk={hanldeAddResource} onCancel={() => setPopups(prevPopups => ({ ...prevPopups, resource: false }))}>
								<Input placeholder="Enter an url resource" value={urlResource} onChange={(e) => setUrlResource(e.target.value)} />
								<span className="mt-2">
									* Each lecture can have a resource.
								</span>
							</Modal>
							<Modal title="Add Caption(Optional)" centered open={popups.caption} onOk={handleAddCaption} onCancel={() => setPopups(prevPopups => ({ ...prevPopups, caption: false }))}>
								<div className="flex space-x-4">
									<div className="flex flex-col w-1/2">
										<Title level={5} className="mb-2">Caption</Title>
										<Input placeholder="Enter an url caption" onChange={(e) => setUrlCaption(e.target.value)} status={captionError ? "error" : ""} />
										<span className="text-[10px]">
											*Caption must be a valid URL.
										</span>
									</div>
									<div className="flex flex-col w-1/2">
										<Title level={5}>Language</Title>
										<Select
											showSearch
											placeholder="Select Language"
											optionFilterProp="label"
											options={optionsLanguage}
											filterSort={(optionA, optionB) =>
												(optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
											}
											onChange={(value) => setCaptionLanguage(value)}
											status={noChooseLanguage ? "error" : ""}
										/>
										<span className="text-[10px]">
											*Please choose the language.
										</span>
									</div>
								</div>
							</Modal>
						</div>
					</>
				)
			}
			{
				saveSuccess && (
					<Button onClick={() => setSaveSuccess(false)}>
						Edit Lecture
					</Button>
				)
			}
		</div>
	)
};

export default CurriculumForm;
