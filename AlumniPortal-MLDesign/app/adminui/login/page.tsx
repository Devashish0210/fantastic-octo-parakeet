
import NavBar from "@/app/_layout_components/navbar";
import LoginCard from "./components/login-card";
import ProtectedRoute from "./components/protected-route";
import Footer from "./components/footer";

const LoginPage = () => {
    return (
        <>
            <NavBar />
            <section className="relative h-[90vh] w-full">
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
                <div className="relative w-full flex flex-wrap h-full items-center justify-evenly">
                    <div className="text-[3rem] pr-24 text-white -mt-8 max-md:text-[2rem] max-md:pr-0 max-md:pl-4 max-md:w-full max-md:-mt-16">
                        <h1 className="max-md:hidden">Welcome to</h1>
                        <h1 className="max-md:hidden">Microland Alumni</h1>
                        <h1 className="max-md:hidden">Community</h1>

                        <div className="hidden max-md:block max-md:leading-tight">
                            <h1>Welcome to</h1>
                            <h1>Microland</h1>
                            <h1>Alumni</h1>
                            <h1>Community</h1>
                        </div>
                    </div>
                    <div className="mt-[-4rem] mb-14 md:mb-0 w-full md:w-auto">

                        <LoginCard />

                    </div>
                </div>
                <p className="text-white absolute bottom-0 w-full text-center pb-4 md:text-sm">
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
            <Footer />
        </>
    );
};

export default LoginPage;