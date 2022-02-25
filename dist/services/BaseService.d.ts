import { ServicesContext } from './ServicesContext';
export declare const SERVICE_SETUP_CONTEXT_ACCESSOR: unique symbol;
export declare class BaseService {
    private preparedInjections;
    private context;
    [SERVICE_SETUP_CONTEXT_ACCESSOR]: (context: ServicesContext) => ServicesContext;
    resolve(): void;
    protected static inject: (dependency: new (context: ServicesContext) => BaseService) => (target: any, memberName: string) => void;
}
