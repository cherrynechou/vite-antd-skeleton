import useAuthUserStore from '@/stores/user';
import { matchPermission } from './utils/permission';

export default ()  => {
    // 用 useState 管理权限，支持动态更新
    const currentUser = useAuthUserStore(state => state.currentUser);

    return {
        canSeeAdmin: currentUser && currentUser?.roles?.includes('administrator'),
        hasPermissions: (perms: string): boolean => {
            return matchPermission(currentUser?.allPermissions, perms);
        },
    }
}