import React from "react";
import CourseComponent from "./components/CourseComponent";

// const courses: Course[] = [
//   {
//     id: 1,
//     name: "Introduction to Programming",
//     category: "IT & SOFTWARE",
//     price: "$35",
//     star: 4.2,
//     view: 211334,
//     href: "#",
//     imageSrc: "https://picsum.photos/312/220",
//     imageAlt: "Introduction to Programming",
//   },
//   {
//     id: 2,
//     name: "Introduction to Programming",
//     category: "IT & SOFTWARE",
//     price: "$35",
//     star: 4.2,
//     view: 211334,
//     href: "#",
//     imageSrc: "https://picsum.photos/312/221",
//     imageAlt: "Introduction to Programming",
//   },
//   {
//     id: 3,
//     name: "Introduction to Programming",
//     category: "IT & SOFTWARE",
//     price: "$35",
//     star: 4.2,
//     view: 211334,
//     href: "#",
//     imageSrc: "https://picsum.photos/312/222",
//     imageAlt: "Introduction to Programming",
//   },
//   {
//     id: 4,
//     name: "Introduction to Programming",
//     category: "IT & SOFTWARE",
//     price: "$35",
//     star: 4.2,
//     view: 211334,
//     href: "#",
//     imageSrc: "https://picsum.photos/312/223",
//     imageAlt: "Introduction to Programming",
//   },
//   // {
//   //   id: 5,
//   //   name: "Introduction to Programming",
//   //   category: "IT & SOFTWARE",
//   //   price: "$35",
//   //   star: 4.2,
//   //   view: 211334,
//   //   href: "#",
//   //   imageSrc: "https://picsum.photos/312/224",
//   //   imageAlt: "Introduction to Programming",
//   // },
//   // {
//   //   id: 6,
//   //   name: "Introduction to Programming",
//   //   category: "IT & SOFTWARE",
//   //   price: "$35",
//   //   star: 4.2,
//   //   view: 211334,
//   //   href: "#",
//   //   imageSrc: "https://picsum.photos/312/225",
//   //   imageAlt: "Introduction to Programming",
//   // },
//   // {
//   //   id: 7,
//   //   name: "Introduction to Programming",
//   //   category: "IT & SOFTWARE",
//   //   price: "$35",
//   //   star: 4.2,
//   //   view: 211334,
//   //   href: "#",
//   //   imageSrc: "https://picsum.photos/312/226",
//   //   imageAlt: "Introduction to Programming",
//   // },
//   // {
//   //   id: 8,
//   //   name: "Introduction to Programming",
//   //   category: "IT & SOFTWARE",
//   //   price: "$35",
//   //   star: 4.2,
//   //   view: 211334,
//   //   href: "#",
//   //   imageSrc: "https://picsum.photos/312/227",
//   //   imageAlt: "Introduction to Programming",
//   // },
//   //   {
//   //       id: 9,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/228",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 10,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/229",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 11,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/230",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 12,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/231",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 13,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/232",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 14,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/233",
//   //       imageAlt: "Introduction to Programming",
//   //   },
//   //   {
//   //       id: 15,
//   //       name: "Introduction to Programming",
//   //       category: "IT & SOFTWARE",
//   //       price: "$35",
//   //       star: 4.2,
//   //       view: 211334,
//   //       href: "#",
//   //       imageSrc: "https://picsum.photos/312/234",
//   //       imageAlt: "Introduction to Programming",
//   //   },
// ];

const HomePage = async () => {
  try {
    // Fetch data from the API
    const res = await fetch("http://localhost:5000/courses/procedure", {
      method: "GET",
      // headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch courses");

    // // Parse and validate the response as JSON
    const data = await res.json();

    // console.log('a', data);

    return (
      <div>
        <CourseComponent courses={data} />
      </div>
    );
  } catch (error) {
    console.error("Error loading courses:", error);
    return <div>Error loading courses.</div>;
  }
};

export default HomePage;