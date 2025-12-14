import { Link } from "@nextui-org/react";

const PageNotFound = () => {
  return (
    <>
      <section className="flex justify-center items-center flex-col p-4">
        <div className="max-w-[400px] h-100 pt-4 px-4 mt-4">
          <img
            src="/404.png"
            className="img-responsive textaligncenter"
            alt="404"
          />
        </div>
        <div className="font-bold text-[50px] my-7 text-content2-tertiary">
          <h1>Oops! Page Not Found</h1>
        </div>
        <div>
          The link you followed may be broken, or the page may have been
          removed.
        </div>
        <div className="my-4 font-extrabold text-3xl">
          <Link href="/">
            HOME{" "}
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </Link>
        </div>
      </section>
    </>
  );
};
export default PageNotFound;
