import {FC, useState} from "react";
import IconFont from "@/components/IconFont";
import {Button, Space, Tag} from "antd";
import {DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";


export interface ISortableMenuItemProps  {
    item: any,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    onDisplayMenu: ( id: number | string) => void,
    onHideMenu: ( id: number | string) => void,
    level: number
}


const SortableMenuItem:FC<ISortableMenuItemProps>=({
   item,
   isShowModal,
   onDisplayMenu,
   onHideMenu,
   level
})=>{
    const [expanded, setExpanded] = useState(true);
    const hasChildren = item.children && item.children.length > 0;


    return (
        <li
            className={"my-1"}
            style={{ paddingLeft: `${level * 20}px` }}
        >
            <div
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer"
            >
                {item.icon && <IconFont name={item.icon}/>}
                <div className={"flex-1"}>
                    <Space>
                        <span>{item.name}</span>
                        <Tag color="blue">{item.path}</Tag>
                    </Space>
                </div>

                <div className="flex gap-1">
                    {/*编辑*/}
                    <Button
                        icon={<EditOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                        onClick={() => isShowModal(true, item.id)}
                    />

                    {/*删除*/}
                    <Button
                        icon={<DeleteOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                    />

                    {/*显示*/}
                    {item.visible && <Button
                        icon={<EyeInvisibleOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                        onClick={()=>onDisplayMenu(item.id)}
                    />}
                    {/*隐藏*/}
                    {!item.visible && <Button
                        icon={<EyeOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                        onClick={()=>onHideMenu(item.id)}
                    />}
                </div>
            </div>

            {item.children && item.children.length > 0 && (
                <ol className="list-none p-0 m-0 mt-1">
                    {item.children.map((child:any)=>(
                        <SortableMenuItem
                            key={child.id}
                            item={child}
                            isShowModal={isShowModal}
                            onDisplayMenu ={onDisplayMenu}
                            onHideMenu={onHideMenu}
                            level={level+1}
                        />
                    ))}
                </ol>
            )}
        </li>
    )
}

export default SortableMenuItem;