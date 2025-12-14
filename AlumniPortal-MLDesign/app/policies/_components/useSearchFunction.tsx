"use client";
//@ts-ignore
import Fuse from "fuse.js";

type faqsFiles = {
  filename: string;
  filepath: string;
}[];

interface Document {
  id: number;
  questions: string;
  answers: string;
  tags: string;
  category: string;
  files: faqsFiles;
}

const options = {
  keys: ["questions", "answers"], // Search in these fields
  threshold: 0.4, // Minimum match score (0-1)
};

let fuse = new Fuse<Document>([], options);

export function setUpSearchDocuments(documents: Document[]) {
  fuse = new Fuse(documents, options);
}

export function searchDocuments(query: string): Document[] {
  const results = fuse.search(query);
  //@ts-ignore
  return results.map((result) => result.item);
}
