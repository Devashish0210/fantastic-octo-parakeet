import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";
import NameComponent from "@/app/_components/name-component";
import TicketsTab from "@/app/tickets/_components/TicketsTab";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const TicketsPage = () => {
  return (
    <>
      <section className="mb-10 w-full">
        <div className="w-[85%] mx-auto mt-8 flex flex-col">
          <Breadcrumbs className="mb-4" aria-label="Breadcrumb">
          <BreadcrumbItem href="/actions" className="text-primary hover:underline">Home</BreadcrumbItem>
          <BreadcrumbItem href="/tickets" className="text-primary hover:underline">Tickets</BreadcrumbItem>
          </Breadcrumbs>
          <TicketsTab></TicketsTab>
        </div>
      </section>
    </>
  );
};
export default TicketsPage;
