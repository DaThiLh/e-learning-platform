import React, { useState, useEffect } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, Button, Typography, Radio, message, Select } from "antd";
import styles from "./CurriculumForm.module.scss";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import NavigationButton from "./NavigationButton";
import { set } from "zod";

const { Title } = Typography;

type QuizItemType = {
	question: string;
	answer: [choice: string[], explanation: string[]];
	correctAnswer: string;
};

type ItemCardType = {
	type: "lecture" | "quiz" | "";
	title: string;
	description: string;
};

type SectionType = {
	title: string;
	items: ItemCardType[];
};

type CurriculumFormType = {
	sections: SectionType[];
};

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
	handleAdd(): void;
	setTitle(title: string): void;
	setDescription(description: string): void;
	onSendItemType(itemType: string): void;
}

interface Lecture_TitleCardProps {
	handleBack(): void;
	handleAdd(): void;
	setTitle(title: string): void;
	onSendItemType(itemType: string): void;
}

interface ItemsInQuizCardProps {
	quizzes: QuizItemType[];
}

interface ItemCardProps {
	item: ItemCardType;
	index: number;
	onDelete: () => void;
}

interface SectionTypeProps {
	section: SectionType;
	index: number;
	onDelete: () => void;
}

interface CurriculumFormProps {
	curriculumForm: CurriculumFormType;
	onAddSection: () => void;
	onSubmit: (curriculumForm: CurriculumFormType) => void;
}

interface ItemTypeProps {
	onSendItemType: (itemType: string) => void;
	handleBack: () => void;
	handleAdd: () => void;
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

const defaultItemQuiz = (): QuizItemType => ({
	question: "",
	answer: [["", "", "", ""], ["", "", "", ""]],
	correctAnswer: "",
});

const defaultCurriculum: CurriculumFormType = {
	sections: [
		{
			title: "",
			items: [
				{
					type: "lecture",
					title: "",
					description: "Lecture 1 Description",
				},
			],
		},
	],
};

const CurriculumForm = ({
	curriculumForm = defaultCurriculum,
	onAddSection,
	onSubmit,
}: CurriculumFormProps) => {
	const [sectionsInForm, setSections] = useState<SectionType[]>(curriculumForm.sections);

	const handleAddSection = () => {
		const newSection: SectionType = {
			title: "",
			items: [],
		};
		setSections([...sectionsInForm, newSection]);
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
									onDelete={() => { }}
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
			<NavigationButton leftButton="Previous" rightButton="Next" />
		</div>
	);
};

const SectionCard = ({ section, index, onDelete }: SectionTypeProps) => {
	const [itemsInSection, setItemsInSection] = useState<ItemCardType[]>([]);

	const handleAddItem = () => {
		const newItemCard: ItemCardType = {
			type: "",
			title: "",
			description: "",
		};
		setItemsInSection([...itemsInSection, newItemCard]);
	}

	return (
		<div className={styles.sectionContainer}>
			<div className="flex flex-row space-x-2 pb-2">
				<Title level={4}>{`Section ${index + 1}`}</Title>
				<Input placeholder="Section Title" />
				<Button className="btn-menu-section" onClick={onDelete}>
					<DeleteOutlined />
				</Button>
			</div>
			{itemsInSection.map((item, index) => (
				<>
					<div className="pb-2">
						<ItemCard
							key={index}
							item={item}
							index={index}
							onDelete={() => { }}
						/>
					</div>
				</>
			))}
			<Button onClick={handleAddItem} className="btn-add-item">
				Curriculum Item
				<PlusOutlined />
			</Button>
		</div>
	);
};

const ItemCard = ({ item, index, onDelete }: ItemCardProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>("chooseItemTyp");
	const [title, setTitle] = useState<string>(item.title);
	const [description, setDescription] = useState<string>(item.description);

	const handleAdd = () => {
		console.log("handleAdd called with values");
		console.log("selectedItemType:", selectedItemType);
		console.log("title:", title);
		console.log("description:", description);
	};

	const handleSetItemTypeFromChild = (itemType: string) => {
		setSelectedItemType(itemType);
	};

	return (
		<div className={styles.itemContainer}>
			{selectedItemType === "chooseItemTyp" && (
				<ItemType
					handleBack={() => setSelectedItemType(null)}
					handleAdd={handleAdd}
					setTitle={setTitle}
					setDescription={setDescription}
					onSendItemType={handleSetItemTypeFromChild}
				/>
			)}

			{(selectedItemType === "quiz" || selectedItemType === "lecture") && (
				<>
					<div className="flex flex-col w-full">

						<div className="flex flex-row space-x-2 items-start">
							<Title level={5} className="mt-1">
								{selectedItemType === "quiz"
									? `Quiz ${index + 1}`
									: `Lecture ${index + 1}`}
							</Title>
							<Input
								placeholder="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<Button
								className="btn-delete-quiz"
								onClick={onDelete}
							>
								<DeleteOutlined />
							</Button>
						</div>
						{selectedItemType === "quiz" && (
							<ItemsInQuizCard
								quizzes={[defaultItemQuiz()]}
							/>
						)}
						{selectedItemType === "lecture" &&
							<ItemsInLectureCard />
						}
					</div>

				</>
			)}
		</div>
	);
};

const ItemsInQuizCard = ({ quizzes }: ItemsInQuizCardProps) => {
	const [listOfQuizs, setQuizs] = useState<QuizItemType[]>([defaultItemQuiz()]);
	const [showableQuizItem, setShowableQuizItem] = useState<boolean>(false);
	const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (saveSuccess) {
			setShowableQuizItem(false);
		}
	}, [saveSuccess]);

	const handleAddQuizItem = () => {
		setQuizs([...listOfQuizs, defaultItemQuiz()]);
	};

	const saveAllItemsInQuiz = () => {
		console.log("Save all items in quiz");
		console.log(listOfQuizs);

		let indexItem: number = 0;

		for (let item of listOfQuizs) {
			if (item.question === "") {
				message.error(`Please fill question ${indexItem + 1}`);
				return;
			}

			let hasCorrectAnswer: boolean = false;
			let indexAnswer: number = 0;
			for (let answer of item.answer[0]) {
				if (answer === "") {
					message.error(`Please fill answer ${indexAnswer + 1} in question ${indexItem + 1}`);
					return;
				}
				if (item.correctAnswer === `answer-${indexAnswer}`) {
					hasCorrectAnswer = true;
				}
				indexAnswer++;
			}

			if (!hasCorrectAnswer) {
				message.error(`Please select correct answer in question ${indexItem + 1}`);
				return;
			}
			indexItem++;
		}

		message.success("All questions are filled");
		setSaveSuccess(true);
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

const ItemType = ({
	handleBack,
	handleAdd,
	setTitle,
	setDescription,
	onSendItemType,
}: ItemTypeProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>(null);

	return (
		<div className={"flex gap-2 w-full"}>
			{!selectedItemType && (
				<>
					<Button onClick={() => setSelectedItemType("lecture")}>
						<PlusOutlined />
						Lecture
					</Button>
					<Button onClick={() => setSelectedItemType("quiz")}>
						<PlusOutlined />
						Quiz
					</Button>
				</>
			)}

			{selectedItemType === "lecture" && (
				<Lecture_TitleCard
					handleBack={handleBack}
					handleAdd={handleAdd}
					setTitle={setTitle}
					onSendItemType={onSendItemType}
				/>
			)}

			{selectedItemType === "quiz" && (
				<Quiz_TitleCard
					handleBack={handleBack}
					handleAdd={handleAdd}
					setTitle={setTitle}
					setDescription={setDescription}
					onSendItemType={onSendItemType}
				/>
			)}
		</div>
	);
};

const Quiz_TitleCard = ({
	handleBack,
	handleAdd,
	setTitle,
	setDescription,
	onSendItemType,
}: Quiz_TitleCardProps) => {
	const [title, setTitleState] = useState<string>("");
	const [description, setDescriptionState] = useState<string>("");

	const onFinish = () => {
		setTitle(title);
		setDescription(description);
		handleAdd();
		onSendItemType("quiz");
		console.log("onFinish called with :", { title, description });
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

// use for lecture 
const Lecture_TitleCard = ({
	handleBack,
	handleAdd,
	setTitle,
	onSendItemType
}: Lecture_TitleCardProps) => {
	const [title, setTitleState] = useState<string>("");

	const onFinish = () => {
		setTitle(title);
		handleAdd();
		onSendItemType("lecture");
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
						onChange={(e) => setTitleState(e.target.value)}
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
	)
}

const ItemsInLectureCard = () => {
	const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
	const [showableContentType, setShowableContentType] = useState<boolean>(true);
	const [urlVideo, setUrlVideo] = useState<string>("");
	const [showableComponent, setShowableComponent] = useState<boolean>(true);

	const handleSetContentType = (value: string) => {
		setSelectedContentType(value);
		setShowableContentType(false);
	}

	return (
		<div className={styles.ItemsInLectureContainer}>
			{
				showableContentType && (
					<Select
						placeholder="Content Type"
						onChange={(e) => handleSetContentType(e)}>
						{contentTypes.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				)
			}

			{showableComponent && 
			<div>
				{
					selectedContentType === "Video" && (
						<>
							<div className="contentVideo">
								<Title level={5}>Video:</Title>
								<div className="flex">
									<Input
										placeholder="Enter the video URL"
										value={urlVideo}
										onChange={(e) => setUrlVideo(e.target.value)}
									/>
									<Button onClick={() => setShowableComponent(false)}>
										Submit
									</Button>
									{
										showableComponent && (
											<span>hihi</span>
										)
									}
								</div>
							</div>
						</>
					)
				}
				{
					selectedContentType === "Article" && (
						<span>hihiarticle</span>
					)
				}
			</div>
			}
		</div>
	)
}

const LectureTableCard = ({
	selectedContentType, 
	urlVideo

}) => {

}
export default CurriculumForm;
