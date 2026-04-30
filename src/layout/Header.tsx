import { CircleUser } from "lucide-react";

const Header = () => {

    return (
        <header className="flex items-center justify-between px-5 py-4">
            <h2>
                Dashboard
            </h2>
            <div className="flex items-center gap-2" >
                <CircleUser  className="text-gray-600"  width={50} height={50}  />
                <div className="flex flex-col" >
                    <h6>Jhon Doe</h6>
                    <span className="text-sm text-gray-600" >Admin</span>
                </div>
            </div>
        </header>
    )
}


export default Header;