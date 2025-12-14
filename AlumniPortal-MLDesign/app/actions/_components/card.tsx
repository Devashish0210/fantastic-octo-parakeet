import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

export default function CardLink({
  headerText,
  bodyText,
  href,
  className = null,
  icon,
}: {
  headerText: string;
  bodyText: string;
  href: string;
  className: null | string;
  icon: string; // e.g. "self-service.png" under /public
}) {
  return (
    <Link href={href}>
      <Card className={className ? className : `bg-content1 w-[25rem] h-[25rem]`}>
        <CardHeader className="flex items-center justify-center text-center">
          <p className="text-2xl">{headerText}</p>
        </CardHeader>

        {/* Stack text and icon; anchor icon in a consistent, centered well */}
        <CardBody className="flex h-full flex-col">
          <p className="text-md">{bodyText}</p>

          {/* Icon well: same height across all cards, centered icon */}
          <div className="mt-auto h-48 flex items-center justify-center">
            <img
              src={icon}
              alt={headerText}
              className="max-h-40 w-auto object-contain"
            />
          </div>
        </CardBody>

        <Divider />
      </Card>
    </Link>
  );
}
