export interface TreeNode {
    id: string | number;
    name: string;
    children?: TreeNode[];
    parentId: string | number;
    [key: string]: any;
}

export interface ListNode {
    id: number;
    parentId: number | null;
    name: string;
    order?: number; // 排序字段
    children?: ListNode[];
    [key: string]: any;
}

/**
 * 将树结构转的是成列表形式（ 树型结构 ）
 * @param trees
 * @param options
 * 需要递归方式
 */
const treeToOrderList=(trees : TreeNode[], options: {
    idKey?: string | number;
    nameKey?: string ;
    rootLabel?: string;
    parentKey?: string;
    levelKey?: string;
    childrenKey?: string;
    keepChildren?: boolean;
  } = {}
)=>{

    const {
        idKey = 'id',
        nameKey = 'name',
        rootLabel = 'Root',
        parentKey = 'parent_id',
        levelKey = 'level',
        childrenKey = 'children',
        keepChildren = false
    } = options;

    //根节点
    const root = { id: 0 , name: rootLabel, level: 0, parent_id: -1 };

    //中间变量
    const rows: any[] = [];
    rows.push(root);

    function traverse(nodes: any[], parentId: number | string | null = null, level: number = 1) {
        nodes.forEach(node => {
            const newNode = { ...node };
            const children = newNode[childrenKey] as any[] | undefined;

            // 设置额外属性
            newNode[parentKey] = parentId ?? 0 ;
            newNode[levelKey] = level;
            newNode[childrenKey] = children;

            // 是否保留children
            if (!keepChildren && childrenKey === 'children') {
                delete newNode[childrenKey];
            }

            rows.push(newNode);

            if (children && children.length > 0) {
                traverse(children, node[idKey], level + 1);
            }
        });
    }

    traverse(trees);

    const result: any[] = [];
    //格式化列表
    const formatLabelName = (level: number) => {
        let str= '';
        for( let i = 0; i < level; ++i){
            str += '-';
        }
        if(level == 0){
            return '';
        }else {
            return '|' + str;
        }
    }
    //格式化树
    rows.forEach((item: any)=>{
        const formatLabel = formatLabelName(item.level);

        result.push({
            label: formatLabel + item[nameKey],
            value: item.id,
            key: item[parentKey] + "-" + item[idKey]
        })
    })

    return result;
}


const treeToList = (  trees: any[],  children: string = 'children')=>{

    const rows: any = [];
    const result: any[] = [];

    const deepTrees = (
        arr: any[],
        level: number = 1
    ) => {
        arr.forEach(item =>{
            const row = Object.assign({}, item,{level:level});
            if(item[children]){
                rows.push(row);
                deepTrees(item[children],level + 1);
            } else {
                rows.push(row);
            }
        });
    }

    //展开
    deepTrees(trees);

    //格式化树
    rows.forEach((item: any)=>{
        result.push({
            ...item
        })
    })

    return result;
}


/**
 * 生成antd tree树型结构
 * @param data
 * @param options
 */
const listToTree = (data: ListNode[], options:{
    idKey?: string,
    titleKey?: string,        //现在的标题
    nameKey?: string,         //原来的标题
    parentIdKey?: string,
    treeKey?: string,
    childrenKey?: string,
    keepNameField?: boolean,   //保存name
    rootId?: number | null,
  } = {}
) : ListNode[] => {

    const {
        idKey = 'id',
        titleKey = 'title',
        nameKey = 'name',
        treeKey =  'key',
        parentIdKey = 'parent_id',
        childrenKey = 'children',
        keepNameField = false,
        rootId = 0,
    } = options;

    if (!data || !Array.isArray(data)) return [];

    // 创建哈希映射和树结构
    const nodeMap = new Map<string | number, ListNode>();
    data.forEach(node => {
        nodeMap.set(node[idKey], { ...node }); // 浅拷贝，避免修改原数据
    });

    const trees: ListNode[] = [];
    nodeMap.forEach(node => {
        const parentId = node[parentIdKey];
        //通用字段
        node[titleKey] = node[nameKey];
        node[treeKey] = parentId.toString().concat("-" +node[idKey]);
        if(!keepNameField){
            delete node[nameKey];
        }
        // 找到根节点：pid匹配rootPid，直接加入树形根节点数组
        if (parentId === rootId) {
            trees.push(node);
        } else {
            // 找到父节点，将当前节点加入父节点的children数组
            const parentNode = nodeMap.get(parentId);
            if (parentNode) {
                parentNode[childrenKey] = parentNode[childrenKey] || [];
                parentNode[childrenKey].push(node);
            }
        }
    });
    return trees;
}


/**
 * 获取树型结构叶子节点
 * @param trees
 * @param childrenKey
 */
const filterTreeLeafNode=(trees: any[], childrenKey: string = 'children') =>  {
    const leafRecords: any[] = [];

    function traverse(node: any) {
        if (!node[childrenKey] || node[childrenKey].length === 0) {
            leafRecords.push(node);
        } else {
            node.children.forEach(traverse);
        }
    }

    trees.forEach(traverse);
    return leafRecords;
}

export {
    treeToOrderList,
    listToTree,
    treeToList,
    filterTreeLeafNode
}

