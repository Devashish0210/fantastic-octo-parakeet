import Link from "next/link";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  var currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="bg-content2-text flex gap-4 flex-col md:flex-row justify-between items-center w-full py-6">
        <div className="md:ml-8">
          <img
            src="/microland-logo-footer.png"
            alt="footer-logo-min"
            className="w-[40vw] sm:w-[30vw] md:w-[20vw]"
          />
        </div>
        <div className="flex gap-1 justify-center items-center md:mr-8">
          <SocialIcon
            target="_blank"
            network="twitter"
            bgColor="transparent"
            fgColor="white"
            className="w-16 h-16 border-white border-2 rounded-full"
            url="https://twitter.com/MicrolandLtd"
          />
          <SocialIcon
            target="_blank"
            network="facebook"
            bgColor="transparent"
            fgColor="white"
            className="w-16 h-16 border-white border-2 rounded-full"
            url="https://www.facebook.com/MicrolandLtd/"
          />
          <SocialIcon
            target="_blank"
            network="linkedin"
            bgColor="transparent"
            fgColor="white"
            className="w-16 h-16 border-white border-2 rounded-full"
            url="https://www.linkedin.com/company/microland"
          />
          <SocialIcon
            target="_blank"
            network="youtube"
            bgColor="transparent"
            fgColor="white"
            className="w-16 h-16 border-white border-2 rounded-full"
            url="https://www.youtube.com/user/MicrolandTV"
          />
          <SocialIcon
            target="_blank"
            network="instagram"
            bgColor="transparent"
            fgColor="white"
            className="w-16 h-16 border-white border-2 rounded-full"
            url="https://www.instagram.com/microlandltd/"
          />
        </div>
      </footer>
    </>
  );
}
