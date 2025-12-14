"use client";
import { useAppSelector } from "@/redux-toolkit/hooks";

export default function HtmlComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeObject = useAppSelector((state) => state.theme);
  return (
    <html
      lang="en"
      className={themeObject.mode}
    >
      {children}
    </html>
  );
}