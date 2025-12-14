import LoginCard from "./login-card";

const LoginPage = () => {
  return (
    <>
      <section className="relative min-h-screen w-full flex flex-col">
        <div
          className="absolute h-full w-full -z-40"
          style={{
            backgroundImage: "url('background-login.jpg')",
            backgroundSize: "100vw 90vh",
          }}
        />
        <div
          className="absolute h-full w-full -z-30"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>
        <div className="relative w-full flex flex-col lg:flex-row h-full flex-1 items-center justify-center lg:justify-evenly px-4 py-8 gap-8 lg:gap-0">
          <div className="text-center lg:text-left text-white lg:pr-24 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight hidden lg:block">
              Welcome to
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight hidden lg:block">
              Microland Alumni
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight hidden lg:block">
              Community
            </h1>

            <h1 className="text-2xl sm:text-3xl font-bold leading-tight lg:hidden">
              Welcome to Microland Alumni Community
            </h1>
          </div>
          <div className="w-full sm:w-auto flex justify-center">
            <LoginCard />
          </div>
        </div>
        <p className="text-white text-xs sm:text-sm text-center pb-4 px-4 mt-auto">
          Having trouble logging in? Contact us at{" "}
          <a
            href="mailto:alumnisupport@microland.com"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            alumnisupport@microland.com
          </a>{" "}
          for assistance.
        </p>
      </section>
    </>
  );
};

export default LoginPage;