import {cloneDeep, pick} from 'lodash-es';
import { ITreeOption, ITreeDataObj } from '@/interfaces/treeOptions'
/**
 * 将树结构转的是成列表形貌（ 树型结构 ）
 * @param trees
 * @param name
 * @param children
 * @param fields
 * 需要递归方式
 */
const treeToOrderList =  (
  trees: any[],
  name: string = 'name',
  children: string = 'children',
  fields: any[] = ['order']) =>
{
    const root = { name: '顶级', id: 0 ,level: 0};
    const rows: any = [];
    const result: any[] = [];
    
    rows.push(root);
    
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
    
    const formatLabelName = (level: number) => {
        let str= '';
        for( let i = 0; i < level; ++i){
            str += '-';
        }
        return level == 0 ? '' : '|' + str
    }
    
    //展开
    deepTrees(trees);
    
    //格式化树
    rows.forEach((item: any)=>{
        const formatLabel = formatLabelName(item.level);
        const filterFields = pick(item,fields);
        result.push({
            label:formatLabel + item[name],
            value:item.id,
            ...filterFields
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
const listToTree=(trees: any[], options: ITreeOption) =>
{
    //1.格式化
    const formatTrees: any[] = [];
    trees.forEach(item=>{
        formatTrees.push({
            id: item[options.idKey],
            title: item[options.nameKey],
            key: item[options.idKey],
            parent_id: item[options.parentIdKey],
        });
    })
    
    
    const getTopList = (beforeTrees: any,options:ITreeOption )=>{
        return beforeTrees.filter(item => item[options.parentIdKey] === options.rootValue);
    }
    
    const topList = cloneDeep(getTopList(formatTrees, options));
    
    const recurseTree = (parentList, formatTrees, options, deep: number = 1)=>{
        if(trees.length === 0){
            return;
        }
        parentList.forEach(item=>{
            const children = cloneDeep(formatTrees.filter(child => child[options.parentIdKey] === item[options.idKey]))
            
            item.children = children;
            item.deep = deep;
            
            recurseTree(children, formatTrees, options,deep+1);
        });
    }
    
    recurseTree(topList, formatTrees, options);
    
    return topList;
}


/**
 * 获取树型结构叶子节点
 * @param trees
 * @param children
 */
const filterTreeLeafNode=(
  trees: any[],
  children: string = 'children') =>
{
    const leafRecords: any[] = [];
    const expandTree = (
      arr: any[]
    )=>{
        arr.forEach((item: any)=>{
            if(item[children]){
                expandTree(item[children]);
            }else{
                leafRecords.push(item);
            }
        })
    }
    
    expandTree(trees);
    
    return leafRecords;
}

/**
 * 获取数组某一列最大值
 * @param list
 * @param field
 */
const queryListMaxValue=(
  list: any[],
  field: string=''
)=>{
    const sortListValues = list.map((item: any) => {return item[field]});
    const sort_max_array: number[] = [];
    sortListValues.forEach((item: any) => {
        if(item){
            sort_max_array.push(item);
        }
    })
    
    return Math.max(...sort_max_array);
}

export {
    treeToOrderList,
    listToTree,
    queryListMaxValue,
    filterTreeLeafNode
}
