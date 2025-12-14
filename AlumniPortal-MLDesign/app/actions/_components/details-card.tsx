// "use client";
// import { useAppSelector } from "@/redux-toolkit/hooks";

// export default function DetailsCard() {
//   const employeeDetails = useAppSelector((state) => state.employeeDetails);
//   // console.log("Employee Details from Redux:", employeeDetails);

//   return (
//     <>
//       {employeeDetails.name ? (
//         <>
//           <div className="flex flex-col">
//             <h1 className="text-3xl font-bold">Hi {employeeDetails.name},</h1>
//             <p>{employeeDetails.title}</p>
//             <p>
//               <span className="font-bold">Employee ID: </span>
//               {employeeDetails.empID}
//             </p>
//             <p>
//               <span className="font-bold">Joining Date: </span>
//               {employeeDetails.doj}
//             </p>
//             {employeeDetails.lwd ? (
//               <p>
//                 <span className="font-bold">Exit Date: </span>
//                 {employeeDetails.lwd}
//               </p>
//             ) : (
//               <p>
//                 We notice that you are an active employee, please use MiHR for
//                 your exit related queries/formalities.{" "}
//                 <a
//                   href="https://performancemanager.successfactors.eu/sf/home?bplte_company=microlandl&_s.crb=FT30Fk22gCCDizO8o6Usmfa0LbBX943u4FbWCL4nIvI%3d"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 underline"
//                 >
//                   Click here to go to MiHR
//                 </a>
//               </p>
//             )}
//           </div>
//         </>
//       ) : (
//         <h1 className="text-3xl font-bold">Welcome</h1>
//       )}
//     </>
//   );
// }

"use client";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { Card, CardBody } from "@nextui-org/react";

export default function DetailsCard() {
  const employeeDetails = useAppSelector((state) => state.employeeDetails);
  // console.log("Employee Details from Redux:", employeeDetails);

  return (
    <>
      {employeeDetails.name ? (
        <>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 w-[16rem] h-[26rem] rounded-xl overflow-hidden">
            <CardBody className="flex flex-col p-6 overflow-hidden">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Hi {employeeDetails.name},</h1>
                <p className="text-sm">{employeeDetails.title}</p>
                <p className="text-sm">
                  <span className="font-bold">Employee ID: </span>
                  {employeeDetails.empID}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Joining Date: </span>
                  {employeeDetails.doj}
                </p>
                {employeeDetails.lwd ? (
                  <p className="text-sm">
                    <span className="font-bold">Exit Date: </span>
                    {employeeDetails.lwd}
                  </p>
                ) : (
                  <p className="text-xs">
                    We notice that you are an active employee, please use MiHR for
                    your exit related queries/formalities.{" "}
                    <a
                      href="https://performancemanager.successfactors.eu/sf/home?bplte_company=microlandl&_s.crb=FT30Fk22gCCDizO8o6Usmfa0LbBX943u4FbWCL4nIvI%3d"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Click here to go to MiHR
                    </a>
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 w-[16rem] h-[26rem] rounded-xl overflow-hidden flex items-center justify-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
        </Card>
      )}
    </>
  );
}