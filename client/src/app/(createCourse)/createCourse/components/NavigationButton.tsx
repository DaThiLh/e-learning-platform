import React from "react";
import { Button } from "antd";
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	FileDoneOutlined,
} from "@ant-design/icons";
import styles from "./NavigationButton.module.scss";

const NavigationButton = ({
	leftButton,
	rightButton,
	actionLeftButton,
	actionRightButton,
}: {
	leftButton: string;
	rightButton: string;
	actionLeftButton: () => void;
	actionRightButton: () => void;
}) => {
	const isLeftButtonHidden = leftButton === "firstPage";

	return (
		<div className={styles.NavigationButtonContainer}>
			<div className="button-form-row">
				<Button className={`button-icon-only ${isLeftButtonHidden ? "hidden-button" : ""}`} danger onClick={actionLeftButton}>
					<ArrowLeftOutlined />
					<span className="button-text">{leftButton}</span>
				</Button>
				<Button className="button-icon-only" type="primary" danger onClick={actionRightButton}>
					<span className="button-text">{rightButton}</span>
					{rightButton === "Next" ? (
						<ArrowRightOutlined />
					) : (
						<FileDoneOutlined />
					)}
				</Button>
			</div>
		</div>
	);
};

export default NavigationButton;
