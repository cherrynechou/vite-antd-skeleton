export interface TreeToListOptions {
    childrenKey?: string;
    idKey?: string;
    parentKey?: string;
    levelKey?: string;
    keepChildren?: boolean;
}
/**
 * 将树结构转的是成列表形貌（ 树型结构 ）
 * @param trees
 * @param options
 * 需要递归方式
 */
const treeToOrderList=(trees : any[], options: TreeToListOptions = {})=>{
    const {
        childrenKey = 'children',
        idKey = 'id',
        parentKey = 'parentId',
        levelKey = 'level',
        keepChildren = false
    } = options;

    const result: any[] = [];

    function traverse(nodes: any[], parentId: number | string | null = null, level: number = 0) {
        nodes.forEach(node => {
            const newNode = { ...node };
            const children = newNode[childrenKey] as any[] | undefined;

            // 设置额外属性
            newNode[parentKey] = parentId;
            newNode[levelKey] = level;

            // 是否保留children
            if (!keepChildren && childrenKey !== 'children') {
                delete newNode[childrenKey];
            }

            result.push(newNode);

            if (children && children.length > 0) {
                traverse(children, node[idKey], level + 1);
            }
        });
    }

    traverse(trees);
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
 * 生成树型列表(数据是从数据库查询出来的记录)
 * @param trees
 * @param options
 * refre: https://www.jb51.net/article/234063.htm
 */
const listToTree=()=>{

}



export {
    treeToOrderList,
    treeToList,
    listToTree,
}

