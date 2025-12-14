import DocumentsTab from "./DocumentsTab";
import RequestForm from "./RequestForm";
import { Tabs, Tab } from "@nextui-org/react";

const DocumentsPage = () => {
  const variants = ["solid", "underlined", "bordered", "light"];
  return (
    <>
      <section className="mb-10 w-full">
        <div className="w-[85%] mx-auto mt-8 flex flex-col">
          {/* <Tabs>
            <Tab key="photos" title="Self Service" />
          </Tabs> */}
          <DocumentsTab>
            <RequestForm />
          </DocumentsTab>
        </div>
      </section>
    </>
  );
};
export default DocumentsPage;
