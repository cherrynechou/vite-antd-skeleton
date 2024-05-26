import '@wangeditor/editor/dist/css/style.css'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useState, useEffect, FC } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { uploadImageFile } from '@/services/admin/system/basic'

export interface EditorProps {
  //value: string; // 富文本内容
  //onChange: (value: string) => void; // 处理更改内容
  height?: number; // 富文本高度
  className?: string;
}

/**
 * base编码
 * @param file
 */
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });



/**
 * 自定义上传
 * @param file
 * @param insertFn
 */
const customerUpload = (file: File, insertFn: any)=>{
  let fileExtension: string = '';
  if(file.type == 'image/jpeg'){
    fileExtension = 'jpg';
  }else if(file.type == 'image/png'){
    fileExtension = 'png';
  }
  
  getBase64(file).then((r: any) => {
    const index = r.indexOf('base64');
    const fileData = r.substring(index + 7);
    
    const formData = {
      extension: fileExtension,
      fileData: fileData
    }
    
    uploadImageFile(formData).then((response: any)=>{
      if (response.status === 200) {
        insertFn(response.data.remotePath);
      }
    });
  });
}


/**
 *
 * @param props
 * @constructor
 */
const WangEditor:FC<EditorProps> = (props: any) => {
  const { value, height, className, onChange } = props
  
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  
  // 编辑器内容
  const [html, setHtml] = useState(value)
  
  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'headerSelect',
      'italic',
      'group-more-style' // 排除菜单组，写菜单组 key 的值即可
    ]
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 4 * 1024 * 1024, // 4M

        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
        
        //自定义上传
        customUpload: customerUpload
      }
    }
  }
  
  // 监听值变化
  useEffect(() => {
    setHtml(value || '')
  }, [value])
  
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])
  
  /**
   * 更改富文本内容
   */
  const handleChange = (editor: IDomEditor) => {
    setHtml(editor.getHtml())
    onChange(editor.getHtml())
  }
  
  return (
    <div
      className={className}
      style={{ border: '1px solid #ccc', zIndex: 100}}
    >
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        style={{ height: height || 300, overflowY: 'hidden' }}
      />
    </div>
  )
}

export default WangEditor