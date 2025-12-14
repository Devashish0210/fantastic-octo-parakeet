import FaqTab2 from "./FaqTab/FaqTab2";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";
import { Breadcrumbs,BreadcrumbItem } from "@nextui-org/react";

const Faq = () => {
  return (
    <>
      <section className="mb-10 w-full">
        <Breadcrumbs className="mb-4" aria-label="Breadcrumb">
          <BreadcrumbItem href="/actions" className="text-primary hover:underline">Home</BreadcrumbItem>
          <BreadcrumbItem href="/policies" className="text-primary hover:underline">Policies</BreadcrumbItem>
          </Breadcrumbs>
        <div className="w-full flex justify-center mt-8">
          <FaqTab2 />
        </div>
      </section>
    </>
  );
};
export default Faq;
