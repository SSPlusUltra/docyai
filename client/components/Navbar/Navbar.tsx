import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <Link
      href={"/"}
      className="self-start ml-5 mt-2 w-20 rounded-md text-center text-black bg-white h-10 pt-2 font-bold"
    >
      FloVibe:
    </Link>
  );
};
export default NavBar;
