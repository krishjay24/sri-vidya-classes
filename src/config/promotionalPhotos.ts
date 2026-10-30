// Licensed promotional photos. Never use these as approved institute records.
export const promotionalPhotos = {
  "classroom": {
    "alt": "Students concentrating on their work in a classroom",
    "author": "RDNE Stock project",
    "source": "https://www.pexels.com/photo/students-studying-inside-the-classroom-6936022/"
  },
  "mentoring": {
    "alt": "A teacher and student discussing mathematics at a blackboard",
    "author": "Yan Krukau",
    "source": "https://www.pexels.com/photo/student-and-teacher-looking-at-the-blackboard-8197536/"
  },
  "school": {
    "alt": "A teacher helping a child work through mathematics on a whiteboard",
    "author": "Gustavo Fring",
    "source": "https://www.pexels.com/photo/woman-and-child-writing-on-whiteboard-5621937/"
  },
  "molecular-model": {
    "alt": "Hands holding a colourful molecular teaching model",
    "author": "RF._.studio _",
    "source": "https://www.pexels.com/photo/crop-chemist-holding-in-hands-molecule-model-3825527/"
  },
  "senior-study": {
    "alt": "Students studying with books and notes in a library",
    "author": "Yan Krukau",
    "source": "https://www.pexels.com/photo/students-studying-inside-the-library-8199659/"
  },
  "study-discussion": {
    "alt": "Students discussing study materials around a library table",
    "author": "Ludovic Delot",
    "source": "https://www.pexels.com/photo/a-group-of-students-sitting-in-a-library-and-studying-16420458/"
  },
  "problem-solving": {
    "alt": "A student writing notes beside a laptop",
    "author": "Mikhail Nilov",
    "source": "https://www.pexels.com/photo/a-man-writing-on-a-notebook-while-studying-7594201/"
  },
  "revision": {
    "alt": "A student reviewing notes and writing at a library desk",
    "author": "SHVETS production",
    "source": "https://www.pexels.com/photo/focused-female-student-writing-in-notebook-during-exam-preparation-in-library-7516381/"
  },
  "glassware": {
    "alt": "Laboratory glassware arranged on a work surface",
    "author": "Ivan S",
    "source": "https://www.pexels.com/photo/close-up-shot-of-laboratory-glasswares-9628840/"
  },
  "science-learning": {
    "alt": "Two pupils exploring science with laboratory equipment",
    "author": "MART PRODUCTION",
    "source": "https://www.pexels.com/photo/students-experimenting-using-laboratory-equipment-inside-the-laboratory-8471975/"
  },
  "study-method": {
    "alt": "A student organising notes and books for revision",
    "author": "cottonbro studio",
    "source": "https://www.pexels.com/photo/student-preparing-for-a-test-7128752/"
  }
} as const
export type PromotionalPhotoKey = keyof typeof promotionalPhotos
export const programPhotos: Record<string, PromotionalPhotoKey> = {
 'school-academics-foundation':'school',
 'board-jee-neet':'senior-study',
 'organic-chemistry-mentorship':'molecular-model',
}
