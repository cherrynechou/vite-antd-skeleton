import { FC, useState } from 'react'
import {App, Form, Input, InputNumber, Modal, Select, Skeleton, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useAsyncEffect} from "ahooks";
import routers from '@/routers/config'; // 导入全局路由配置
import {buildAntdTreeData, extractRoutes, treeToOrderList} from "@/utils/utils.ts";
import {LOGIN_PATH} from "@/constants/pages.ts";
import {queryAllRoles} from "@/api/auth/RoleController.ts";
import {getMenu} from "@/api/auth/MenuController.ts";
import IconSelector from "@/components/IconSelector";


export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    menuData: any[];
    actionRef: any
}

const CreateOrEdit : FC<ICreateOrEditProps>=(props: any)=>{
    const { t } = useTranslation();
    const [treeData, setTreeData] = useState<any>([]);
    const [initialValues, setInitialValues] = useState<any>({});
    const [linkTarget, setLinkTarget] = useState<any>([]);
    const { isModalVisible, isShowModal, editId, menuData } = props;
    const [roles, setRoles] = useState<any>([]);
    const [routes, setRoutes] = useState<any>([]);


    const [form] = Form.useForm();
    const { message } = App.useApp();


    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        const orderList = treeToOrderList(menuData);
        const treeValues = buildAntdTreeData(orderList,{
            rootLabel: t('global.tree.root')
        })
        setTreeData(treeValues);

        const targets = [
            {
                label: t('modal.createOrUpdateForm.target.blank'),
                value: '_blank'
            },
            {
                label: t('modal.createOrUpdateForm.target.current'),
                value: ''
            },
        ];

        setLinkTarget(targets);
        //提取路由
        const routes = extractRoutes(routers);
        const filter_routes = routes.map(item=>item.path);
        const routeList = filter_routes.filter(item=>item!== LOGIN_PATH);
        //生成路由列表
        if (routeList.length > 0) {
            const _routeList: any[] = [];
            routeList.forEach((item: string) => {
                _routeList.push({
                    label: item,
                    value: item,
                });
            });
            setRoutes(_routeList);
        }


        const roleRes = await queryAllRoles();
        const roleData = roleRes.data;
        const roleList: any[] = [];
        roleData.forEach((item: any) => {
            roleList.push({ label: item.name, value: item.id });
        });
        setRoles(roleList);

        if(editId !== undefined){
            const menuRes = await getMenu(editId);

            const currentData = menuRes.data;
            let rolesValue: any[] = [];
            if (currentData.roles.length > 0) {
                rolesValue = currentData.roles.map((item: any) => {
                    return item.id;
                });
            }

            setInitialValues({
                name: currentData.name,
                key:currentData.key,
                locale: currentData.locale,
                parent_id: currentData.parent_id,
                icon: currentData.icon,
                path: currentData.path,
                target: currentData.target,
                order: currentData.order,
                roles: rolesValue,
                status: currentData.status,
            });
        }else{
            console.log(treeValues);
        }



    }



    useAsyncEffect(async () => {
        await fetchApi();
    }, []);



    const handleOk = async () => {

    }

    return (
        <Modal
            title={title}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => isShowModal(false)}
            destroyOnHidden
            width={750}
        >
            {Object.keys(initialValues).length === 0 && editId !== undefined ? (
                <Skeleton paragraph={{ rows: 4 }} />
            ) : (
                <Form
                    form={form}
                    initialValues={initialValues}
                    autoComplete="off"
                >
                    <Form.Item
                        name="parent_id"
                        label={
                            t('modal.createOrUpdateForm.parent')
                        }
                        labelCol={{ span: 3 }}
                        rules={[
                            {
                                required: true,
                                message: (
                                    t('validator.admin.parent.required')
                                )
                            }
                        ]}
                    >
                        <Select
                            options={treeData}
                            style={{ width: 400 }}
                            placeholder={
                                t('modal.createOrUpdateForm.parent.placeholder')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="icon"
                        label={
                            t('modal.createOrUpdateForm.icon')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <IconSelector />
                    </Form.Item>

                    <Form.Item
                        name="key"
                        label={
                            t('modal.createOrUpdateForm.key')
                        }
                        labelCol={{ span: 3 }}
                        rules={[
                            {
                                required: true,
                                message: (
                                    t('validator.admin.key.required')
                                )
                            }
                        ]}
                    >
                        <Input
                            placeholder={
                                t('modal.createOrUpdateForm.key.placeholder')
                            }
                            style={{ width: 500 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="locale"
                        label={
                            t('modal.createOrUpdateForm.locale')
                        }
                        labelCol={{ span: 3 }}
                        rules={[
                            {
                                required: true,
                                message: (
                                    t('validator.admin.locale.required')
                                )
                            }
                        ]}
                    >
                        <Input
                            placeholder={
                                t('modal.createOrUpdateForm.locale.placeholder')
                            }
                            style={{ width: 500 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="path"
                        label={
                            t('modal.createOrUpdateForm.router')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <Select
                            options={routes}
                            style={{ width: 400 }}
                            placeholder={
                                t('modal.createOrUpdateForm.router.placeholder')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="url"
                        label={
                            t('modal.createOrUpdateForm.url')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <Input
                            placeholder={
                                t('modal.createOrUpdateForm.url.placeholder')
                            }
                            style={{ width: 500 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="target"
                        label={
                            t('modal.createOrUpdateForm.target')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <Select
                            options={linkTarget}
                            style={{ width: 250 }}
                            placeholder={
                                t('modal.createOrUpdateForm.target.placeholder')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="order"
                        label={
                            t('modal.createOrUpdateForm.sort')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <InputNumber
                            style={{ width: 400 }}
                            placeholder={
                                t('modal.createOrUpdateForm.sort.placeholder')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label={
                            t('model.createOrUpdateForm.display')
                        }
                        labelCol={{ span: 3 }}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('global.switch.checked.label')}
                            unCheckedChildren={t('global.switch.unChecked.label')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="roles"
                        label={
                            t('modal.createOrUpdateForm.role')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <Select
                            mode="multiple"
                            options={roles}
                            style={{ width: 500 }}
                            placeholder={
                                t('modal.createOrUpdateForm.role.placeholder')
                            }
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    )
}

export default CreateOrEdit;