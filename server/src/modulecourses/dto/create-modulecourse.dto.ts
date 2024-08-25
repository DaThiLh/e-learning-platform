export class CreateModulecourseDto {
    basicInformation: BasicInformation;
    advanceInformation: AdvanceInformation;
    curriculum: Curriculum;
    publishCourse: PublishCourse;
}

export class BasicInformation {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    subcategory: string;
    language: string;
}

export class AdvanceInformation {
    objectifs: string[];
    requirements: string[];
}

export class Curriculum {
    sections: Section[];
}

export class Section {
    title: string;
    items: Item[];
}

export class Item {
    title: string;
    description: string;
    content?: Content; // Optional, as it might be empty
}

export class Content {
    urlVideo: string;
    description: string;
    resource: string;
    caption: string[];
    article: string;
}

export class PublishCourse {
    instructors: Instructor[];
    currency: string;
    price: number;
}

export class Instructor {
    name: string;
    role: string;
}
