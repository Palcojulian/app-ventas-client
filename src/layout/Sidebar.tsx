import { ChartColumnStacked, ChartPie } from "lucide-react";

const Sidebar = () => {
    return (  
        <div className="min-w-[250px] p-5"  >
            <ul className="space-y-3"  >
                <li className="flex items-center gap-3 rounded-xl p-3 bg-indigo-500  text-white hover:cursor-pointer hover:bg-indigo-400 " >
                    <ChartPie  />
                    Dashboard
                </li>
                <li className="flex items-center gap-3 rounded-xl p-3 text-gray-700 font-light hover:cursor-pointer hover:bg-gray-100 " >
                    <ChartColumnStacked className="text-gray-500" />
                    Leaderboard
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;