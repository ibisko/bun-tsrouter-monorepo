import { ReplaceSpecificLeaf } from "@packages/tsrouter/server";
//#region ../../node_modules/.pnpm/@prisma+client@7.8.0_prisma@7.8.0_@types+react-dom@19.2.4_@types+react@19.2.17__@types+_076114b246c794e6a3662fe8893f4f7f/node_modules/@prisma/client/runtime/client.d.ts
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON array.
 */
declare interface JsonArray extends Array<JsonValue> {}
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
 */
declare type JsonObject = { [Key in string]?: JsonValue; };
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
declare type JsonValue = string | number | boolean | JsonObject | JsonArray | null;
//#endregion
//#region src/router/tsrouter.d.ts
declare const mainWhiteListRouterTree: {
  iconSet: {
    list: {
      _method: "post";
      _func: (params: {
        skip?: unknown;
        take?: unknown;
        kw?: string | undefined;
        categoryId?: number | undefined;
        tags?: number[] | undefined;
        palette?: boolean | undefined;
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        skip: number;
        take: number;
        data: ({
          tag_relationships: {
            icon_set_tag: {
              id: number;
              created_at: Date;
              updated_at: Date;
              name: string;
              type: string;
            };
          }[];
          _count: {
            icons: number;
            tag_relationships: number;
          };
        } & {
          palette: boolean;
          id: number;
          created_at: Date;
          updated_at: Date;
          deleted_at: Date | null;
          filename: string;
          sha: string;
          prefix: string;
          samples: JsonValue;
          last_modified: Date | null;
          hidden: boolean | null;
          name: string;
          version: string | null;
        })[];
        total: number;
      }>;
    };
    listTags: {
      _method: "get";
      _func: (params: {
        type: "tag" | "category";
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        name: string;
        type: string;
      }[]>;
    };
  };
  icon: {
    list: {
      _method: "post";
      _func: (params: {
        kw: string;
        skip?: unknown;
        take?: unknown;
        iconSets?: number[] | undefined;
        categoryId?: number | null | undefined;
        tags?: number[] | undefined;
        palette?: boolean | undefined;
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        skip: number;
        take: number;
        data: Omit<{
          id: number;
          pid?: number;
          name: string;
          body: string;
          top: number;
          left: number;
          width: number;
          height: number;
          h_flip?: boolean;
          v_flip?: boolean;
          animate?: boolean;
          prefix: string;
        }, "body" | "pid">[];
        total: number;
      }>;
    };
    getIcons: {
      _method: "post";
      _func: (params: {
        icons: number[];
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        id: number;
        pid?: number;
        name: string;
        body: string;
        top: number;
        left: number;
        width: number;
        height: number;
        h_flip?: boolean;
        v_flip?: boolean;
        animate?: boolean;
        prefix: string;
      }[]>;
    };
  };
  iconifyLocal: {
    listIcon: {
      _method: "post";
      _func: (params: {
        skip?: unknown;
        take?: unknown;
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        skip: number;
        take: number;
        total: number;
        data: {
          name: string;
          prefix: string;
          sign: string;
          fileName: string;
          filePath: string;
          animate: boolean;
          left: number;
          top: number;
          width: number;
          height: number;
        }[];
      }>;
    };
    appendIcon: {
      _method: "post";
      _func: (params: {
        sign: string;
        body: string;
        top: number;
        left: number;
        width: number;
        height: number;
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        filePath: string;
      }>;
    };
    reactCompoment: {
      _method: "post";
      _func: (params: {
        sign: string;
        body: string;
        top: number;
        left: number;
        width: number;
        height: number;
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        componentName: string;
        filePath: string;
        code: string;
      }>;
    };
    listLocalIconInfo: {
      _method: "post";
      _func: (params: {
        filePaths: string[];
      }, options?: {
        query?: Record<string, string>;
        headers?: Record<string, string>;
        signal?: AbortSignal;
        timeout?: number;
        skipRefreshToken?: boolean;
      }) => Promise<{
        id: string;
        filePath: string;
        prefix: string;
        name: string;
        animate: boolean;
        left: number;
        top: number;
        width: number;
        height: number;
        content: string;
        body: string;
      }[]>;
    };
  };
};
type AppRouter = ReplaceSpecificLeaf<typeof mainWhiteListRouterTree>;
//#endregion
export type { AppRouter };