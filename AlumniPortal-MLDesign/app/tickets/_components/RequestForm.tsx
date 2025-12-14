'use client'
import * as React from "react"; // Import React and its hooks
import RequestDocument from "@/app/_api-helpers/request-documents";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
// import CardCustom from "../request-card";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { DropzoneArea } from "mui-file-dropzone";
import { useDropzone } from "react-dropzone";
import LoadingButton from "./LoadingButton";
import getSMC from "../_api-helpers/smc-cat";
import { useRouter } from "next/navigation";
import { setState } from "@/redux-toolkit/features/create-ticket";
import createTickets from "../_api-helpers/create-ticket";
import DropdownCustom from "./Dropdown";
import MyDropzone from "./CustomDropzone";
import TableCustom from "./Table";

// Define the RequestForm component
export default function RequestForm({ onSuccess }: { onSuccess: () => void }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(["-- Please Select --"])
  );
  const [files, setFiles] = React.useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = React.useState("+91"); // Add state for phone number
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = React.useState("");
  const title = "Alumni Services Ticket";
  const [createTicketLoading, setCreateTicketLoading] = React.useState(false);
  const [createTicketMessage, setCreateTicketMessage] = React.useState(2);
  const [description, setDescription] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const ticketData = useAppSelector((state) => state.ticketCreate);
  const formLoading = useAppSelector((state) => state.ticketCreate.isLoading);
  const ticketStatus = useAppSelector((state) => state.ticketStatus);
  const [showTable, setShowTable] = React.useState(false);
  let selectedCategory: string = "";
  selectedKeys.forEach((element) => {
    selectedCategory = element;
  });
  const getBase64 = async (file: File) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL: string | ArrayBuffer | null = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const router = useRouter();
  React.useEffect(() => {
    const wait = async () => {
      const res = await getSMC(employeeLoginState, dispatch, router);
      dispatch(setState({ isLoading: false, data: res }));
    };
    wait();
  }, []);
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateTicketLoading(true);
    const handleVerifyRequest = async () => {
      let category;
      selectedKeys.forEach((element) => {
        category = element;
      });
      if (title.length < 3) {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Title should be atleast 3 characters long.");
        return;
      }
      if (category === "-- Please Select --") {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Please Select a category");
        return;
      }
      if (phoneNumber.length !== 13) { // Validating phone number length
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Please enter a valid 10-digit phone number.");
        return;
      }

      let dataCreateTicket;
      if (
        category &&
        ticketData.data[category]["attachment_mandatory"] !== "False" &&
        files.length < 1
      ) {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Please add the Attachment as its mandatory");
        return;
      }
     
      // ✅ MODIFIED: Handle single or multiple files
      if (files.length > 0) {
        let attachmentData;
        let attachmentFilename;

        if (files.length === 1) {
          // Single file - use existing logic
          //@ts-ignore
          attachmentData = (await getBase64(files[0])).split("base64,")[1];
          attachmentFilename = files[0].name;
        } else {
          // Multiple files - will be zipped by createTickets function
          // We'll pass files array to createTickets, it will handle zipping
          attachmentData = ""; // Placeholder, will be replaced by createTickets
          attachmentFilename = "attachments.zip";
        }

        dataCreateTicket = {
          attachment_filename: attachmentFilename,
          attachment: attachmentData,
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
          mobile: phoneNumber,
        };
      } else {
        dataCreateTicket = {
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
          mobile: phoneNumber,
        };
      }
      // console.log(dataCreateTicket);
      //@ts-ignore
      // ✅ MODIFIED: Pass files array to createTickets for zipping
      const d = await createTickets(
        //@ts-ignore
        dataCreateTicket,
        employeeLoginState,
        dispatch,
        router,
        files.length > 1 ? files : undefined // ✅ NEW: Pass files if multiple
      );
      if (showTable) {
        return <TableCustom items={ticketStatus} />;
      }
      if (d && d.success) {
  setCreateTicketMessage(0);
  setModalMessage("Ticket created successfully");
  
  // ✅ Optimistic update: Add new ticket to Redux immediately
  const newTicket = {
    ticketDisplayNo: d.ticket_no || "Pending",
    createdOn: new Date().toISOString(), // or use backend response if available
    statusName: "Open", // Default status
    classificationName: selectedCategory,
    lastUpdatedOn: new Date().toISOString(),
  };
  
  // Append to existing tickets
  const updatedTickets = [newTicket, ...ticketStatus.data];
  dispatch(setState({
    isLoading: false,
    data: updatedTickets
  }));
  
  onOpen();
  
  // Clear form
  setSelectedKeys(new Set(["-- Please Select --"]));
  setPhoneNumber("+91");
  setDescription("");
  setFiles([]);
  
  // ✅ Optionally trigger background refresh after 2-3 seconds
  setTimeout(() => {
    onSuccess(); // This should trigger getDetails() in parent
  }, 2000);
} else {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
      }
      setCreateTicketLoading(false);
      onOpen();
    };
    handleVerifyRequest();
  };

  return formLoading ? (
    <div className="flex justify-center items-center w-auto flex-col gap-2 py-32">
      <h1 className="text-primary text-xl">Alumni Services</h1>
      <Spinner />
    </div>
  ) : Object.keys(ticketData["data"]).length > 0 ? (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Alumni Services Ticket
              </ModalHeader>
              <ModalBody>
                <p>{modalMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => {
              onClose(); // Close the modal
              onSuccess(); // Call onSuccess immediately after closing
            }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <form
        className="flex flex-wrap gap-4 justify-center items-center"
        onSubmit={handleFormSubmit}

      >
        <div className={"flex w-full rounded-sm p-4"}>
          <p>
            <span className="font-bold">Ticket Category</span>
          </p>
          <DropdownCustom
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            options={Object.keys(ticketData.data)}
          />
        </div>

        {/* Phone Number Input Field */}
        <div className="flex w-full rounded-sm p-4">
  <p>
    <span className="font-bold pr-4">Mobile Number</span>
  </p>
  <div className="flex items-center w-full">
    <span className="bg-[#E0E0E0] px-3 py-2 rounded-l text-sm">+91</span>
    <Input
      required
      value={phoneNumber.slice(3)} // Exclude the +91 part from the input
      onChange={(e) => setPhoneNumber("+91" + e.target.value)} // Always keep +91 at the start
      placeholder="Enter 10-digit phone number"
      maxLength={10} // Limit to 10 digits (without +91)
      size="sm"
      className="p-1 ml-1 w-full text-sm"
    />
  </div>
</div>

        <div className={"flex w-full rounded-sm p-4"}>
          <p>
            <span className="font-bold pr-4">Description</span>
          </p>
          <div className="w-full">
            <Textarea
              size="sm"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="bg-[#F4F4F5] ml-1 mt-1 min-h-2 text-sm w-full"
              //@ts-ignore
              wrapperClassName="h-2"
              labelClassName="mb-1"
              type="text"
              placeholder="Enter a brief description of your request"
            />
          </div>
        </div>

        {/* Other fields remain unchanged */}
        <div
          className={
            selectedCategory === "-- Please Select --" ||
            selectedCategory === "" ||
            selectedCategory === null ||
            typeof selectedCategory === "undefined"
              ? "hidden"
              //@ts-ignore
              : ticketData.data[selectedCategory]["attachment_message"] === "" ||
              //@ts-ignore
                ticketData.data[selectedCategory]["attachment_message"] ===
                  null ||
                  //@ts-ignore
                typeof ticketData.data[selectedCategory][
                  "attachment_message"
                ] === "undefined"
              ? "hidden"
              : "w-full bg-gray-200 rounded-sm flex flex-col justify-center items-center"
          }
        >
          <p className="m-4">
            <span className="font-bold">Additional Instructions:</span>{" "}
            {selectedCategory === "-- Please Select --" ||
            selectedCategory === "" ||
            selectedCategory === null ||
            typeof selectedCategory === "undefined"
              ? ""
              //@ts-ignore
              : ticketData.data[selectedCategory]["attachment_message"]}
          </p>
        </div>

        <div className={"flex w-full rounded-sm p-4"}>
          <p>
            <span className="font-bold pr-4">Attachment</span>
          </p>
          <MyDropzone files={files} setFiles={setFiles} />
        </div>

        <div className="w-full">
          <LoadingButton
            loading={createTicketLoading}
            message={createTicketMessage}
            setMessage={setCreateTicketMessage}
            text="Create Ticket"
            isDisabled={false}
            type="submit"
            buttonColor="primary"
            onClick={() => {
              // console.log("raised a ticket");
            }}
            spinnerColor="white"
          />
        </div>
        <p className="text-danger">{errorMessage}</p>
      </form>
    </>
  ) : (
    <div>
      <p>Some Error Occured</p>
    </div>
  );
}
