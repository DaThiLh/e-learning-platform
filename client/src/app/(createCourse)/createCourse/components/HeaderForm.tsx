"use client";
import React from "react";
import s from "./HeaderForm.module.scss";

type HeaderFormProps = {
	headerName: string;
};

const HeaderForm = ({ headerName }: HeaderFormProps) => {
	return (
		<header className={s.headerFormContainer}>
			<h2 className="text-sm md:text-xl">{headerName}</h2>
		</header>
	);
};

export default HeaderForm;
