import { FC } from 'react'
import {useGlobalStore} from "@/stores";

const SiderMenuHeader:FC = ()=>{
    const logo = useGlobalStore(state => state.logo);
    const title = useGlobalStore(state => state.title);
    const collapsed = useGlobalStore(state => state.collapsed);

    return (
        <div className={"flex items-center h-14 justify-center"}>
            <img className={"w-10 h-auto"} src={logo} alt="logo"/>
            {!collapsed && <span className={"font-semibold text-[20px] ml-2"}>{title}</span>}
        </div>
    )
}

export default SiderMenuHeader;

