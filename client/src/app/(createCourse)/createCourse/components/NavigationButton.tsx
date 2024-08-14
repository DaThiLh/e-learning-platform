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
	actionRightButton,
}: {
	leftButton: string;
	rightButton: string;
	actionRightButton: () => void;
}) => {
	return (
		<div className={styles.NavigationButtonContainer}>
			{
				leftButton !== "BasicInfo" ? (
					<div className="button-form-row">
						<Button className="button-icon-only" danger>
							<ArrowLeftOutlined />
							<span className="button-text">{leftButton}</span>
						</Button>
						<Button className="button-icon-only" type="primary" danger>
							<span className="button-text">{rightButton}</span>
							{rightButton === "Next" ? (
								<ArrowRightOutlined />
							) : (
								<FileDoneOutlined />
							)}
						</Button>
					</div>
				) : (
					<div className="flex flex-row-reverse">
						<Button className="button-icon-only" type="primary" danger onClick={actionRightButton}>
							<span className="button-text">{rightButton}</span>
							<ArrowRightOutlined />
						</Button>
					</div>
				)
			}
		</div>
	);
};

export default NavigationButton;
