"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";

interface ModalComponentProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setcode: React.Dispatch<React.SetStateAction<number>>;
  modalIsOpen: boolean;
  modaltext: string;
  code: number;
}

export default function ModalComponent({
  setIsOpen,
  setcode,
  modalIsOpen,
  modaltext,
  code,
}: ModalComponentProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  function closeModal() {
    setIsOpen(false);
    setcode(0);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onOpenChange={onOpenChange}
      placement="auto"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"> </ModalHeader>
            <ModalBody>
              {code === 404 ? (
                <div>
                  <p className="text-[1rem] inline">
                    Data mismatch, re-verify the data submitted. Please write to
                    us at{" "}
                  </p>
                  <Link
                    href="mailto:alumniverification@microland.com"
                    className="inline underline text-tertiary"
                  >
                    alumniverification@microland.com
                  </Link>
                  <p className="inline" style={{ fontSize: "1rem" }}>
                    {" "}
                    for further assistance.{" "}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: "1rem" }}>{modaltext} </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="solid" onPress={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
