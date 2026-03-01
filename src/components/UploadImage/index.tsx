import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import {Modal, Upload} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import {UploadFile, UploadListType} from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { uploadImageFile } from '@/api/system/CommonController';
import { useTranslation } from 'react-i18next';
import { nanoid } from "nanoid";

export interface IUploadImageProps {
    /** 最大上传数量，1为单张，大于1为多张 */
    maxCount?: number;
    /** 上传列表的内建样式 text, picture, picture-card 和 picture-circle*/
    listType: UploadListType;
    /** 初始文件列表（编辑场景回显用） */
    initialFileList?: UploadFile[];
    /** 文件列表变化回调 */
    onUploadChange?: (fileList: UploadFile[]) => void;
    /** 上传前校验 */
    beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<void>;
    /** 限制文件类型，如 ['image/jpeg', 'image/png'] */
    accept?: string;
    /** 限制文件大小（单位：MB） */
    maxSize?: number;
}

const UploadImage : FC<IUploadImageProps> = (props)=>{
    const {
        maxCount = 1,
        initialFileList = [],
        onUploadChange,
        beforeUpload,
        listType = 'picture-card',
        accept = 'image/*',
        maxSize = 5,
    } = props;

    // 内部状态管理
    const { t } = useTranslation();
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    //显示文件列表
    const [fileList, setFileList] = useState<UploadFile[]>(initialFileList);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    //预览
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewOpen(false);

    // 上传按钮
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
                { t('component.upload.file') }
            </div>
        </button>
    );

    // 处理文件列表变化
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam) => {
        let newFileList = [...info.fileList];

        // 限制文件数量
        if (maxCount && newFileList.length > maxCount) {
            newFileList = newFileList.slice(-maxCount);
        }

        // 更新状态
        setFileList(newFileList);
    };

    // 自定义上传前校验
    const customBeforeUpload = (file: RcFile, fileList: RcFile[]) => {
        // 文件类型校验
        if (accept && accept !== 'image/*') {
            const acceptTypes = accept.split(',');
            if (!acceptTypes.includes(file.type)) {
                return Upload.LIST_IGNORE;
            }
        }

        // 文件大小校验
        if (maxSize) {
            const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
            if (!isLtMaxSize) {
                return Upload.LIST_IGNORE;
            }
        }

        // 调用外部 beforeUpload
        if (beforeUpload) {
            const result = beforeUpload(file, fileList);
            if (result === false) {
                return Upload.LIST_IGNORE;
            }
        }

        return true;
    };

    // 自定义上传请求
    const customRequest = async (options: any) => {
        const { file, onSuccess, onError, onProgress } = options;
        onProgress({ percent: 50 });

        getBase64(file).then((r: any) => {
            // 创建 FormData
            const formData = new FormData();
            formData.append('base64', r.split(',')[1]);
            formData.append('extension', file.name.split('.').pop());

            uploadImageFile(formData).then((response: any)=>{
                const uuid: string = nanoid();
                const filteredFiles = fileList.filter((f: UploadFile<any>) => f.status === 'done');
                const finalFiles:UploadFile<any>[] = [...filteredFiles,  {
                    uid: uuid,
                    name: response.data.path,
                    status: 'done',
                    url: response.data.fullPath,
                } as UploadFile];

                setFileList(finalFiles);

                if (onUploadChange) {
                    onUploadChange(finalFiles);
                }
            })
        });
    }

    //删除
    const handleRemove:UploadProps['onRemove'] = (file: UploadFile<any>)=>{
        if (onUploadChange) {
            onUploadChange(fileList.filter((f: UploadFile<any>)=>f.uid!==file.uid));
        }
    }

    // 计算是否显示上传按钮
    const showUploadButton = maxCount ? fileList.length < maxCount : true;

    return (
        <>
            <Upload
                accept={accept}
                listType={listType}
                fileList={fileList}
                beforeUpload={customBeforeUpload}
                customRequest={customRequest}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
            >
                {showUploadButton ? uploadButton : null}
            </Upload>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>

    )
}


// 导出组件
export default UploadImage;