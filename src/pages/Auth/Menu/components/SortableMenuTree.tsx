import {FC, useCallback, useState} from "react";
import {queryMenus,hideMenu,displayMenu} from "@/api/auth/MenuController.ts";
import {useAsyncEffect} from "ahooks";
import {
    closestCorners,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {useTranslation} from "react-i18next";
import {App} from "antd";
import CreateOrEdit from "./CreateOrEdit";
import SortableMenuItem from "./SortableMenuItem";

export interface ISortableMenuTreeProps {
    isModalVisible: boolean,
    setIsModalVisible: (isModalVisible: boolean) => void,
    editId : number | string | undefined,
    setEditId: (id?: string | number | undefined  ) => void,
}

//
const SortableMenuTree:FC<ISortableMenuTreeProps> = ({
    isModalVisible,
    setIsModalVisible,
    editId,
    setEditId
 }) =>{
    const { t } = useTranslation();
    const [menuData,setMenuData] = useState<any>([])

    const { message } = App.useApp();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
    const isShowModal = (show: boolean, id?: number | string| undefined) => {
        setIsModalVisible(show);
        setEditId(id);
    };

    //显示菜单
    const onDisplayMenu = async (id: number | string) =>{
        try{
            await displayMenu(id);
            message.success(t('global.update.success'));
        }catch (error: any){
            message.error(error.message);
        }
    }

    //关闭菜单
    const onHideMenu = async (id: number | string) =>{
        try{
            await hideMenu(id);
            message.success(t('global.update.success'));
        }catch (error: any){
            message.error(error.message);
        }
    }

    const handleDragEnd = (event: any)=>{
        const { active, over } = event;

        console.log(active,over);

    }





    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={menuData.map((item: any) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ol className={"p-0 m-0 mt-1"}>
                        {menuData.map((item:any) => (
                            <SortableMenuItem
                                key={item.id}
                                item={item}
                                isShowModal={isShowModal}
                                onDisplayMenu ={onDisplayMenu}
                                onHideMenu={onHideMenu}
                                level={1}
                            />
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