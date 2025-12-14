"use client";

import { useEffect, useState } from "react";
import faqrequest from "../../_api-helpers/faq-request";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { setState as setFaqs } from "@/redux-toolkit/features/faqs";
import FaqAccordian from "./FaqAccordian/FaqAccordian";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  searchDocuments,
  setUpSearchDocuments,
} from "@/app/policies/_components/useSearchFunction";
import { useRouter } from "next/navigation";
import React from "react";

type faqsFiles = {
  filename: string;
  filepath: string;
}[];

type Faqs = {
  id: number;
  questions: string;
  answers: string;
  tags: string;
  category: string;
  files: faqsFiles;
}[];

export default function FaqTab() {
  const faqs = useAppSelector((state) => state.faqs);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<String>>(
    new Set([])
  );
  const [searchText, setSearchText] = useState<string>("");
  const categoryBasedSortingInitial: {
    [id: string]: Faqs;
  } = {};
  faqs.forEach((value: any) => {
    if (categoryBasedSortingInitial[value.category]) {
      categoryBasedSortingInitial[value.category].push(value);
    } else {
      categoryBasedSortingInitial[value.category] = [];
      categoryBasedSortingInitial[value.category].push(value);
    }
  });
  const [categorizedFaqs, setCategorizedFaqs] = useState<{
    [id: string]: Faqs;
  }>(JSON.parse(JSON.stringify(categoryBasedSortingInitial)));
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  setUpSearchDocuments(faqs);
  useEffect(() => {
    const updateFaqs = async () => {
      if (faqs && faqs.length === 0) {
        const res: Faqs = await faqrequest(
          employeeLoginState,
          dispatch,
          router
        );
        const categoryBasedSorting: {
          [id: string]: Faqs;
        } = {};
        res.forEach((value) => {
          if (categoryBasedSorting[value.category]) {
            categoryBasedSorting[value.category].push(value);
          } else {
            categoryBasedSorting[value.category] = [];
            categoryBasedSorting[value.category].push(value);
          }
        });
        setCategorizedFaqs(JSON.parse(JSON.stringify(categoryBasedSorting)));
        dispatch(setFaqs(res));
      }
      setLoading(false);
    };
    updateFaqs();
  }, []);
  const onSearch = (value: string) => {
    const categoryBasedSorting: {
      [id: string]: Faqs;
    } = {};
    if (faqs.length > 0 && value.length > 0) {
      setSearchText(value);
      const filter = searchDocuments(value);
      filter.forEach((value) => {
        if (categoryBasedSorting[value.category]) {
          categoryBasedSorting[value.category].push(value);
        } else {
          categoryBasedSorting[value.category] = [];
          categoryBasedSorting[value.category].push(value);
        }
      });
      setCategorizedFaqs(JSON.parse(JSON.stringify(categoryBasedSorting)));
    } else {
      //@ts-ignore
      faqs.forEach((value) => {
        if (categoryBasedSorting[value.category]) {
          categoryBasedSorting[value.category].push(value);
        } else {
          categoryBasedSorting[value.category] = [];
          categoryBasedSorting[value.category].push(value);
        }
      });
      setCategorizedFaqs(JSON.parse(JSON.stringify(categoryBasedSorting)));
      setSearchText(value);
    }
  };
  return loading ? (
    <div className="w-full h-72 flex justify-center items-center">
      <Spinner color="primary" size="lg" />
    </div>
  ) : (
    <div className="w-[80vw] max-w-[80vw]">
      <Input
        type="search"
        startContent={<span className="material-symbols-outlined">search</span>}
        className="mb-4 w-full"
        variant="bordered"
        classNames={{ base: "border-foreground" }}
        value={searchText}
        onValueChange={onSearch}
      />
      <div className="flex flex-wrap justify-between">
        {Object.keys(categorizedFaqs).map((key, index) => (
          <Button
            onClick={() => {
              // const keysSet: Set<String> = new Set(JSON.parse(JSON.stringify(selectedKeys)))
              // console.log("clicked");
              if (selectedKeys.has(String(index))) {
                // keysSet.delete(String(index))
                // setSelectedKeys(keysSet)
                setSelectedKeys(new Set([]));
              } else {
                // selectedKeys.add(String(keysSet))
                // setSelectedKeys()
                setSelectedKeys(new Set([String(index)]));
              }
            }}
            key={index}
            className={
              selectedKeys.has(String(index))
                ? "border-4 border-spacing-4 border-red whitespace-normal min-h-24 w-80 m-4 bg-primary text-white items-center justify-center flex"
                : "whitespace-normal min-h-24 w-80 m-4 bg-primary text-white items-center justify-center flex"
            }
          >
            {key}
          </Button>
        ))}
      </div>
      <Accordion
        isCompact
        selectionMode="single"
        variant="bordered"
        className="bg-background-container shadow-black"
        //@ts-ignore
        selectedKeys={selectedKeys}
        //@ts-ignore
        onSelectionChange={(keys) => setSelectedKeys(keys)}
      >
        {Object.keys(categorizedFaqs).map((value0, index) => {
          const faqsListBasedOnCategory = categorizedFaqs[value0];
          return (
            <AccordionItem
              key={index}
              aria-label={value0}
              title={value0}
              classNames={{ heading: "font-bold" }}
            >
              <FaqAccordian
                items={faqsListBasedOnCategory.map((value) => {
                  return {
                    content: (
                      <div
                        className="m-4"
                        dangerouslySetInnerHTML={{ __html: value.answers }}
                      ></div>
                    ),
                    title: <p className="text-md">{value.questions}</p>,
                    ariaLabel: value.questions,
                    files: value.files,
                    // content: <div className="m-4" dangerouslySetInnerHTML={{ __html: parse(value.answers) }}></div>, title: <p className="font-bold text-md">{value.questions}</p>, ariaLabel: value.questions, files: value.files
                  };
                })}
              />
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
