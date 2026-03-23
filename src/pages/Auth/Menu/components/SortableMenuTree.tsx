import {FC, useCallback, useState} from "react";
import {queryMenus} from "@/api/auth/MenuController.ts";
import {useAsyncEffect} from "ahooks";
import IconFont from "@/components/IconFont";
import {Button, Space, Tag} from "antd";
import {DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import {closestCorners, DndContext, DragEndEvent} from "@dnd-kit/core";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CreateOrEdit} from ".";

export interface IMenuItemProps  {
    item: any,
    level: number
}

const SortableMenuItem:FC<IMenuItemProps>=({
   item,
   level
})=>{
    const [expanded, setExpanded] = useState(true);
    const hasChildren = item.children && item.children.length > 0;

    // 初始化sortable
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: {
            type: 'category',
            item,
            parentId: item.parent_id,
        },
    });

    return (
        <li
            className={"my-1"}
            style={{ paddingLeft: `${level * 20}px` }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
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
                    <Button
                        icon={<EditOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                    />
                    {item.visible && <Button
                        icon={<EyeInvisibleOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                    />}
                    {!item.visible && <Button
                        icon={<EyeOutlined />}
                        className="px-1.5 py-0.5 text-xs border-none hover:bg-gray-50"
                    />}
                </div>
            </div>
            {item.children && item.children.length > 0 && (
                <ol className="list-none p-0 m-0 mt-1">
                    {item.children.map((child:any)=>(
                        <SortableMenuItem key={child.id} item={child} level={level+1}/>
                    ))}
                </ol>
            )}
        </li>
    )
}

const SortableMenuTree:FC = () =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editId, setEditId] = useState<number | string | undefined>(0);
    const [menuData,setMenuData] = useState<any>([])

    //自定查询
    const requestData = async () =>{
        const ret = await queryMenus();
        const menuData = ret.data;
        setMenuData(menuData);
    }

    useAsyncEffect(async () => {
        await requestData();
    }, []);


    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowModal = (show: boolean, id?: number | undefined) => {
        setEditId(id);
        setIsModalVisible(show);
    };


    const handleDragEnd = useCallback((event: DragEndEvent)=>{

    },[])

    return (
        <>
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={(event) => handleDragEnd(event)}
            >
                <SortableContext
                    items={menuData.map((item: any) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ol className={"p-0 m-0 mt-1"}>
                        {menuData.map((item:any) => (
                            <SortableMenuItem key={item.id} item={item} level={1}/>
                        ))}
                    </ol>
                </SortableContext>
            </DndContext>

            {isModalVisible &&
                <CreateOrEdit
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    editId={editId}
                    menuData={menuData}
                />
            }
        </>

    )
}

export default SortableMenuTree;