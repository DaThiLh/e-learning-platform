import React, { useState, useEffect } from "react";
import HeaderForm from "./HeaderForm";
import { Form, Input, Button, Typography, Radio } from "antd";
import styles from "./CurriculumForm.module.scss";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import NavigationButton from "./NavigationButton";

const { TextArea } = Input;
const { Title } = Typography;

type QuizItemType = {
	question: string;
	answer: [choice: string[], explanation: string[]];
	correctAnswer: string;
};

type ItemCardType = {
	type: "lecture" | "quiz";
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

interface QuizCardProps {
	handleBack(): void;
	handleAdd(): void;
	setTitle(title: string): void;
	setDescription(description: string): void;
	onSendItemType(itemType: string): void;
	quizzes: QuizItemType[];
}

interface Item_QuizCardProps {
	title: string;
	description: string;
	quizzes: QuizItemType[];
}

interface ItemCardProps {
	item: ItemCardType;
	index: number;
	onDelete: () => void;
}

interface SectionTypeProps {
	sections: SectionType;
	index: number;
	onAddItem: () => void;
	onDelete: () => void;
}

interface CurriculumFormProps {
	curriculum: CurriculumFormType;
	onAddSection: () => void;
	onSubmit: (curriculum: CurriculumFormType) => void;
}

interface ItemTypeButtonProps {
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

const defaultItemQuiz: QuizItemType  = {
	question : "",
	answer : [["", "", "", ""], ["", "", "", ""]],
	correctAnswer : ""
}

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
	curriculum = defaultCurriculum,
	onAddSection,
	onSubmit,
}: CurriculumFormProps) => {
	return (
		<div className={styles.curriculumFormContainer}>
			<HeaderForm headerName="Curriculum Form" />
			<hr className="mb-2" />
			<div>
				<Form layout="vertical">
					<div className="flex flex-col justify-center items-center p-2">
						{curriculum.sections.map((section, index) => (
							<SectionCard
								key={index}
								sections={section}
								index={index}
								onAddItem={() => { }}
								onDelete={() => { }}
							/>
						))}
					</div>
				</Form>
			</div>
			<NavigationButton leftButton="Previous" rightButton="Next" />
		</div>
	);
};

const SectionCard = (sectionTypeProps: SectionTypeProps) => {
	const { sections, index, onAddItem, onDelete } = sectionTypeProps;

	return (
		<div className={styles.sectionContainer}>
			<div className="flex flex-row space-x-2">
				<Title level={4}>{`Section ${index + 1}`}</Title>
				<Form.Item>
					<Input placeholder="Section Title" />
				</Form.Item>
				<Button className="btn-menu-section" onClick={onDelete}>
					<DeleteOutlined />
				</Button>
			</div>
			{sections.items.map((item, index) => (
				<ItemCard
					key={index}
					item={item}
					index={index}
					onDelete={() => { }}
				/>
			))}
		</div>
	);
};

const ItemCard = ({ item, index, onDelete }: ItemCardProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>(null);
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
			{!selectedItemType && !title && (
				<Button onClick={() => setSelectedItemType("chooseItemType")}>
					Curriculum Item
				</Button>
			)}

			{selectedItemType && selectedItemType === "chooseItemType" && (
				<ItemTypeButton
					handleBack={() => setSelectedItemType(null)}
					handleAdd={handleAdd}
					setTitle={setTitle}
					setDescription={setDescription}
					onSendItemType={handleSetItemTypeFromChild}
				/>
			)}

			<div className="flex flex-col">
				{title && (
					<>
						<div className="flex flex-row space-x-2 items-start">
							<Title level={5} className="mt-1">
								{selectedItemType === "quiz"
									? `Quiz ${index + 1}`
									: `Lecture ${index + 1}`}
							</Title>
							<Form.Item>
								<Input
									placeholder="Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</Form.Item>
							<Button
								className="btn-menu-lecture"
								onClick={onDelete}
							>
								<DeleteOutlined />
							</Button>
						</div>
						{/* <Select
            placeholder={"Content"}
            className={styles.selectedButton}
            value={item.type}
          >
            {contentTypes.map((option) => (
              <Select.Option
                key={option.label}
                value={option.value}
                className={styles.selectedButtonItem}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select> */}
						{selectedItemType === "quiz" && (
							<Item_QuizCard title={title} description={description} quizzes={[]} />
						)}
					</>
				)}
			</div>
		</div>
	);
};

const Item_QuizCard = ({ title, description }: Item_QuizCardProps) => {
  const [listOfQuizs, setQuizs] = useState<QuizItemType[]>([defaultItemQuiz]);
  const [showableQuizItem, setShowableQuizItem] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number | null>(null);
  const [currentQuizItem, setCurrentQuizItem] = useState<QuizItemType>(defaultItemQuiz);

  const handleAddOrUpdateQuizItem = () => {
    if (currentQuizIndex !== null) {
      // Update existing quiz item
      const updatedQuizItems = listOfQuizs.map((quiz, index) =>
        index === currentQuizIndex ? currentQuizItem : quiz
      );
      setQuizs(updatedQuizItems);
    } else {
      // Add new quiz item
      setQuizs([...listOfQuizs, currentQuizItem]);
    }
    // Reset states
    setCurrentQuizItem(defaultItemQuiz);
    setCurrentQuizIndex(null);
  };

  return (
    <div>
      {showableQuizItem ? (
        <>
          <div className="flex flex-col bg-red-200">
            {listOfQuizs.map((quizItem, index) => (
              <QuizItemCard
                key={index}
                question={quizItem.question}
                setQuestion={(value: string) => setCurrentQuizItem({ ...currentQuizItem, question: value })}
                answer={quizItem.answer[0]}
                setAnswer={(value: string[]) => setCurrentQuizItem({ ...currentQuizItem, answer: [value, quizItem.answer[1]] })}
                explanation={quizItem.answer[1]}
                setExplanation={(value: string[]) => setCurrentQuizItem({ ...currentQuizItem, answer: [quizItem.answer[0], value] })}
                correctAnswer={quizItem.correctAnswer}
                setCorrectAnswer={(value: string) => setCurrentQuizItem({ ...currentQuizItem, correctAnswer: value })}
              />
            ))}
          </div>
          <br />
          <div className="flex justify-between">
            <Button type="primary" onClick={handleAddOrUpdateQuizItem}>
						Add Quiz Item <PlusOutlined />
            </Button>
          </div>
        </>
      ) : (
        <Button type="primary" onClick={() => setShowableQuizItem(true)}>
          Add Quiz Item <PlusOutlined />
        </Button>
      )}
    </div>
  );
};

const ItemTypeButton = ({
	handleBack,
	handleAdd,
	setTitle,
	setDescription,
	onSendItemType,
}: ItemTypeButtonProps) => {
	const [selectedItemType, setSelectedItemType] = useState<string | null>(
		null
	);

	const handleSetItemTypeFromChild = (itemType: string) => {
		setSelectedItemType(itemType);
		onSendItemType(itemType);
	};

	return (
		<div className="flex flex-row space-x-4">
			{!selectedItemType && (
				<Button onClick={() => setSelectedItemType("lecture")}>
					Lecture
				</Button>
			)}
			{!selectedItemType && (
				<Button onClick={() => setSelectedItemType("quiz")}>
					Quiz
				</Button>
			)}
			{selectedItemType === "lecture" && <div>Lecture Component</div>}
			{selectedItemType === "quiz" && <div>
				<QuizCard
					handleBack={handleBack}
					handleAdd={handleAdd}
					setTitle={setTitle}
					setDescription={setDescription}
					onSendItemType={onSendItemType}
					quizzes={[]}
				/>
			</div>}
		</div>
	);
};

const QuizCard = ({
	handleBack,
	handleAdd,
	setTitle,
	setDescription,
	onSendItemType,
	quizzes
}: QuizCardProps) => {
	const [title, setTitleState] = useState<string>("");
	const [description, setDescriptionState] = useState<string>("");
	const [quizItems, setQuizItems] = useState<QuizItemType[]>(quizzes);

	const onFinish = () => {
		setTitle(title);
		setDescription(description);
		handleAdd();
		onSendItemType("quiz");
		console.log("onFinish called with :", { title, description });
	};

	const addQuizItemFromChild = (quizItem: QuizItemType) => {
		setQuizItems([...quizItems, quizItem]);
	}

	return (
		<div className={styles.quizCardContainer}>
			<div>
				<div className="flex justify-items-center justify-between gap-2 pb-2">
					<Title level={5}>New Quiz:</Title>
					<div className="flex flex-col w-4/5 gap-2">
						<Input
							name="title"
							placeholder="Enter a title"
							value={title}
							onChange={(e) => setTitleState(e.target.value)}
							allowClear
						/>
						<Input.TextArea
							placeholder="Enter a description"
							value={description}
							onChange={(e) =>
								setDescriptionState(e.target.value)
							}
							allowClear
						/>
					</div>
				</div>
				<div className="flex flex-row justify-end gap-2">
					<Button onClick={handleBack}>Cancel</Button>
					<Button type="primary" onClick={onFinish}>
						Add <PlusOutlined />
					</Button>
				</div>
			</div>
		</div>
	);
};

// const QuizItemCard = ({
// 	question,
// 	setQuestion,
// 	answer,
// 	setAnswer,
// 	explanation,
// 	setExplanation,
// 	correctAnswer,
// 	setCorrectAnswer,
// }: {
// 	question: string;
// 	setQuestion: (value: string) => void;
// 	answer: string[];
// 	setAnswer: (value: string[]) => void;
// 	explanation: string[];
// 	setExplanation: (value: string[]) => void;
// 	correctAnswer: string;
// 	setCorrectAnswer: (value: string) => void;
// }) => {
// 	const [questionValue, setQuestionValue] = useState<string>(question);
// 	const [answerValue, setAnswerValue] = useState<string[]>(answer);
// 	const [explanationValue, setExplanationValue] = useState<string[]>(explanation);


// 	const handleAnswerChange = (index: number, value: string) => {
// 		const newAnswers = [...answer];
// 		newAnswers[index] = value;
// 		setAnswer(newAnswers);
// 	};

// 	const handleExplanationChange = (index: number, value: string) => {
// 		const newExplanations = [...explanation];
// 		newExplanations[index] = value;
// 		setExplanation(newExplanations);
// 	};

// 	const addAnswer = () => {
// 		setAnswer([...answer, ""]);
// 		setExplanation([...explanation, ""]);
// 		console.log("answer:", answer);
// 	};

// 	return (
// 		<div className={styles.quizItemCardContainer}>
// 			<Form layout="vertical">
// 				<div className="item">
// 					<div className="question">
// 						<Title level={5}>Question</Title>
// 						<Input
// 							placeholder="Question"
// 							value={questionValue}
// 							onChange={(e) => setQuestionValue(e.target.value)}
// 							showCount
// 							maxLength={160}
// 						/>
// 					</div>
// 					<br />
// 					<div className="answer">
// 						<div className="flex justify-between">
// 							<Title level={5}>Answer</Title>
// 							<Button onClick={addAnswer}>
// 								Add <PlusOutlined />
// 							</Button>
// 						</div>
// 						<Radio.Group
// 							value={correctAnswer}
// 							onChange={(e) => setCorrectAnswer(e.target.value)}
// 							className="answer"
// 						>
// 							{answerValue.map((choice, index) => (
// 								<Radio
// 									key={index}
// 									value={`answer-${index}`}
// 									className="radio"
// 								>
// 									<div className="flex flex-col items-end gap-1">
// 										<Input
// 											placeholder={`Answer ${index + 1}`}
// 											allowClear
// 											showCount
// 											maxLength={160}
// 											value={choice}
// 											onChange={(e) =>
// 												handleAnswerChange(
// 													index,
// 													e.target.value
// 												)
// 											}
// 										/>
// 										<Input
// 											placeholder={`Explanation ${index + 1
// 												} (optional)`}
// 											allowClear
// 											showCount
// 											maxLength={160}
// 											className="w-2"
// 											value={explanation[index]}
// 											onChange={(e) =>
// 												handleExplanationChange(
// 													index,
// 													e.target.value
// 												)
// 											}
// 										/>
// 									</div>
// 								</Radio>
// 							))}
// 						</Radio.Group>
// 					</div>
// 				</div>
// 			</Form>
// 		</div>
// 	);
// };


const QuizItemCard = ({
  question,
  setQuestion,
  answer,
  setAnswer,
  explanation,
  setExplanation,
  correctAnswer,
  setCorrectAnswer,
}: {
  question: string;
  setQuestion: (value: string) => void;
  answer: string[];
  setAnswer: (value: string[]) => void;
  explanation: string[];
  setExplanation: (value: string[]) => void;
  correctAnswer: string;
  setCorrectAnswer: (value: string) => void;
}) => {
  const [questionValue, setQuestionValue] = useState<string>(question);
  const [answerValue, setAnswerValue] = useState<string[]>(answer);
  const [explanationValue, setExplanationValue] = useState<string[]>(explanation);

  useEffect(() => {
    setQuestion(questionValue);
  }, [questionValue]);

  useEffect(() => {
    setAnswer(answerValue);
  }, [answerValue]);

  useEffect(() => {
    setExplanation(explanationValue);
  }, [explanationValue]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answerValue];
    newAnswers[index] = value;
    setAnswerValue(newAnswers);
  };

  const handleExplanationChange = (index: number, value: string) => {
    const newExplanations = [...explanationValue];
    newExplanations[index] = value;
    setExplanationValue(newExplanations);
  };

  const addAnswer = () => {
    setAnswerValue([...answerValue, ""]);
    setExplanationValue([...explanationValue, ""]);
  };

  return (
    <div className={styles.quizItemCardContainer}>
      <Form layout="vertical">
        <div className="item">
          <div className="question">
            <Title level={5}>Question</Title>
            <Input
              placeholder="Question"
              value={questionValue}
              onChange={(e) => setQuestionValue(e.target.value)}
              showCount
              maxLength={160}
            />
          </div>
          <br />
          <div className="answer">
            <div className="flex justify-between">
              <Title level={5}>Answer</Title>
              <Button onClick={addAnswer}>
                Add <PlusOutlined />
              </Button>
            </div>
            <Radio.Group
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="answer"
            >
              {answerValue.map((choice, index) => (
                <Radio
                  key={index}
                  value={`answer-${index}`}
                  className="radio"
                >
                  <div className="flex flex-col items-end gap-1">
                    <Input
                      placeholder={`Answer ${index + 1}`}
                      allowClear
                      showCount
                      maxLength={160}
                      value={choice}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                    />
                    <Input
                      placeholder={`Explanation ${index + 1} (optional)`}
                      allowClear
                      showCount
                      maxLength={160}
                      className="w-2"
                      value={explanationValue[index]}
                      onChange={(e) =>
                        handleExplanationChange(index, e.target.value)
                      }
                    />
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CurriculumForm;

