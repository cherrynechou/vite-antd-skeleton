import {FC, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons'
import { Upload } from 'antd';
import FormData from 'form-data';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import {uploadImageFile} from "@/api/system/CommonController";
import {nanoid} from "nanoid";

export interface UploadImageProps {
    /** 最大上传数量，1为单张，大于1为多张 */
    maxCount?: number;
    /** 文件列表（受控） */
    value?: UploadFile[];
    /** 文件列表变化回调 */
    onChange?: (fileList: UploadFile[]) => void;
    /** 上传前校验 */
    beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<void>;
    /** 限制文件类型，如 ['image/jpeg', 'image/png'] */
    accept?: string;
    /** 限制文件大小（单位：MB） */
    maxSize?: number;
}


const UploadImage : FC<UploadImageProps> = (props)=>{
    const {
        maxCount = 1,
        value,
        onChange,
        beforeUpload,
        accept = 'image/*',
        maxSize = 5,
    } = props;

    // 内部状态管理
    const [fileList, setFileList] = useState<UploadFile[]>(value || []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    // 上传按钮
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
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

        // 触发外部 onChange
        if (onChange) {
            onChange(newFileList);
        }
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

                setUploadFileList([
                    ...uploadFileList.filter((item) => item.status === 'done'),
                    {
                        uid: uuid,
                        name: response.data.path,
                        status: 'done',
                        url: response.data.fullPath,
                    } as UploadFile,
                ]);
            })

        });

    }



    // 计算是否显示上传按钮
    const showUploadButton = maxCount ? fileList.length < maxCount : true;

    return (
        <Upload
            accept={accept}
            listType="picture-card"
            fileList={fileList}
            beforeUpload={customBeforeUpload}
            customRequest={customRequest}
            onChange={handleChange}
        >
            {showUploadButton ? uploadButton : null}
        </Upload>
    )
}


// 导出组件
export default UploadImage;