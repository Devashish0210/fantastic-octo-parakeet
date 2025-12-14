// "use client";
// import { Spinner } from "@nextui-org/react";
// import axios from "axios";
// import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";

// export default function MyDropzone({
//   setFiles,
// }: {
//   setFiles: Dispatch<SetStateAction<File[]>>;
// }) {
//   const [filesName, setFileName] = useState("");
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     //@ts-ignore
//     setFiles(acceptedFiles);
//     setFileName(acceptedFiles[0].name);
//   }, []);
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/msword": [".doc"],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         [".docx"],
//       "application/vnd.ms-excel": [".xls"],
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
//         ".xlsx",
//       ],
//       "application/vnd.ms-outlook": [".msg"],
//       "application/zip": [".zip", ".zipx"],
//       "application/x-rar-compressed": [".rar"],
//       "image/jpeg": [".jpg", ".jpeg"],
//       "text/plain": [".txt"],
//       "application/vnd.ms-xpsdocument": [".xps"],
//       "image/png": [".png"],
//       "application/pdf": [".pdf"],
//       "application/vnd.oasis.opendocument.text": [".odt"],
//       "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
//       "message/rfc822": [".eml"],
//       "application/x-7z-compressed": [".7z"],
//       "application/vnd.oasis.opendocument.presentation": [".odp"],
//     },
//     maxFiles: 1,
//   });

//   const [isUploaded, setIsUploaded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   return (
//     <>
//       {loading ? (
//         <div className="flex flex-col absolute z-20 h-full w-[100%] backdrop-blur-[1px] items-center justify-center">
//           <Spinner />
//           <p className="font-bold"> Uploading the file </p>
//         </div>
//       ) : (
//         <></>
//       )}
//       <div
//         {...getRootProps({
//           className: isUploaded
//             ? "border-solid border-3 h-9 bg-success p-5  text-white flex justify-center items-center rounded-lg bg-[#F4F4F5]"
//             : "h-9 p-6 flex justify-start items-center bg-[#F4F4F5] w-full",
//         })}
//       >
//         <input {...getInputProps()} />
//         <div className="flex flex-col items-start">
//           {isUploaded ? (
//             <p> File Uploaded</p>
//           ) : isDragActive ? (
//             <p>Drop the files here ...</p>
//           ) : (
//             <p className="text-sm flex flex-col items-start">
//               Drag 'n' drop some files here, or click to select files
//             </p>
//           )}
//           <p>{filesName}</p>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES = 10;

export default function MyDropzone({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setErrorMessage(""); // Clear previous errors

      // Check for file size violations
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE
      );

      if (oversizedFiles.length > 0) {
        setErrorMessage(
          `Some files exceed the 5MB limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        return;
      }

      // Check if adding these files would exceed max files
      if (files.length + acceptedFiles.length > MAX_FILES) {
        setErrorMessage(`You can only upload up to ${MAX_FILES} files total.`);
        return;
      }

      // Filter out duplicates (files with same name and size)
      const newFiles = acceptedFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );

      if (newFiles.length === 0 && acceptedFiles.length > 0) {
        setErrorMessage("These files have already been added.");
        return;
      }

      // Append new files to existing list
      const updatedFileList = [...files, ...newFiles];
      setFiles(updatedFileList);
    },
    [files, setFiles]
  );

  const removeFile = (indexToRemove: number) => {
    const updatedFileList = files.filter(
      (_, index) => index !== indexToRemove
    );
    setFiles(updatedFileList);
    setErrorMessage(""); // Clear error when user takes action
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-outlook": [".msg"],
      "application/zip": [".zip", ".zipx"],
      "application/x-rar-compressed": [".rar"],
      "image/jpeg": [".jpg", ".jpeg"],
      "text/plain": [".txt"],
      "application/vnd.ms-xpsdocument": [".xps"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
      "message/rfc822": [".eml"],
      "application/x-7z-compressed": [".7z"],
      "application/vnd.oasis.opendocument.presentation": [".odp"],
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          className: isDragActive
            ? "border-solid border-3 border-primary h-24 p-5 flex justify-center items-center rounded-lg bg-blue-50 cursor-pointer transition-colors"
            : "h-24 p-5 flex justify-center items-center bg-[#F4F4F5] rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {isDragActive ? (
            <p className="text-sm text-primary font-medium">
              Drop the files here...
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Drag 'n' drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max {MAX_FILES} files, 5MB each
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            Selected Files ({files.length}/{MAX_FILES}):
          </p>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="material-symbols-outlined text-gray-400 text-sm">
                    description
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors group"
                  aria-label={`Remove ${file.name}`}
                >
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-red-600 text-sm">
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}