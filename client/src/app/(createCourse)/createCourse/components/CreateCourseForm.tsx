"use client";
import React, { useState } from "react";
import { Menu, notification } from "antd";
import styles from "./CreateCourseForm.module.scss";
import BasicInfomationForm from "./BasicInfomationForm";
import AdvanceInformationForm from "./AdvanceInformationForm";
import CurriculumForm from "./CurriculumForm";
import PublishCourseForm from "./PublishCourseForm";
import { Button } from "antd";

const items = [
  { label: "Basic Information", key: "basic-information" },
  { label: "Advance Information", key: "advance-information" },
  { label: "Curriculum", key: "curriculum" },
  { label: "Publish Course", key: "publish-course" },
];

interface CreateFormProps {
  basicInformation: {};
  advanceInformation: {};
  curriculum: {};
  publishCourse: {};
}

const CreateCourseForm = () => {
  const [selectedKey, setSelectedKey] = useState(items[1]?.key);

  const [createForm, setCreateForm] = useState<CreateFormProps>({
    basicInformation: {},
    advanceInformation: {},
    curriculum: {},
    publishCourse: {},
  });

  const handleNextButton = () => {
    const currentIndex = items.findIndex((item) => item.key === selectedKey);
    if (currentIndex < items.length - 1) {
      setSelectedKey(items[currentIndex + 1].key);
    }
    handleButtonClick(items[currentIndex + 1].key);
  };

  const handlePreviousButton = () => {
    const currentIndex = items.findIndex((item) => item.key === selectedKey);
    if (currentIndex > 0) {
      setSelectedKey(items[currentIndex - 1].key);
      handleButtonClick(items[currentIndex - 1].key);
    }
  };

  const openNotification = () => {
    notification.success({
      message: "Success",
      description: "Create course success!",
    });
  };

  const handleSubmitForm = async () => {

    const basicInformation = window.localStorage.getItem("basicInformation");
    const advanceInformation =
      window.localStorage.getItem("advanceInformation");
    const curriculum = window.localStorage.getItem("curriculumInformation");
    const publishCourse = window.localStorage.getItem("publishCourse");

    const createForm = {
      basicInformation: basicInformation ? JSON.parse(basicInformation) : {},
      advanceInformation: advanceInformation
        ? JSON.parse(advanceInformation)
        : {},
      curriculum: curriculum ? JSON.parse(curriculum) : {},
      publishCourse: publishCourse ? JSON.parse(publishCourse) : {},
    };

    console.log("Form Submitted: ", createForm);
    openNotification();

    // Send POST request to the server
    // try {
    //   const response = await fetch("http://localhost:5000/modulecourses", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(createForm),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const result = await response.json();
    //   console.log("Response from server:", result);
    // } catch (error) {
    //   console.error("There was a problem with the fetch operation:", error);
    // }

    // Cleanup localStorage
    const removedKey = [];
    for (let i in localStorage) {
      if (i.includes(`selectedItemType-`)) {
        removedKey.push(i);
      }
      if (i.includes(`selectedContentType-`)) {
        removedKey.push(i);
      }
    }

    removedKey.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Optionally clear other localStorage items
    window.localStorage.removeItem("basicInformation");
    window.localStorage.removeItem("advanceInformation");
    window.localStorage.removeItem("curriculumInformation");
    window.localStorage.removeItem("publishCourse");
	window.location.href = `/course/1000`;

  };

  const [activeButton, setActiveButton] = useState("basic-information");

  const handleButtonClick = (key) => {
    setActiveButton(key);
    // Additional logic for button click
    setSelectedKey(key);
  };
  return (
    <div className={styles.topNavBarContainer}>
      <div className="w-full border-b mt-2">
        {items.map((item) => (
          <Button
            key={item.key} // Use 'key' from the item
            type="primary"
            id={item.key} // Use 'key' for the id
            className={
              activeButton === item.key ? "clicked disabled" : "disabled"
            }
            onClick={() => handleButtonClick(item.key)}
            disabled={true}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {selectedKey === "basic-information" && (
        <BasicInfomationForm moveToNextForm={() => handleNextButton()} />
      )}

      {selectedKey === "advance-information" && (
        <AdvanceInformationForm
          moveToPreviousForm={() => handlePreviousButton()}
          moveToNextForm={() => handleNextButton()}
        />
      )}

      {selectedKey === "curriculum" && (
        <CurriculumForm
          moveToPreviousForm={() => handlePreviousButton()}
          moveToNextForm={() => handleNextButton()}
        />
      )}

      {selectedKey === "publish-course" && (
        <PublishCourseForm
          moveToPreviousForm={handlePreviousButton}
          handleSubmitForm={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default CreateCourseForm;
