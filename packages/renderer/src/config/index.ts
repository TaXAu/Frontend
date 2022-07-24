export interface ocrSubNavItemType {
  readonly key: ocrPageKeyType,
  readonly name: string,
}

export type ocrPageKeyType =
  'prj-overview' |
  'img-overview' |
  'img-info' |
  'data-management' |
  'prj-settings';

export const ocrSubNavItem: ocrSubNavItemType[] = [{
  key: 'prj-overview',
  name: '项目总览',
}, {
  key: 'prj-settings',
  name: '项目配置',
}, {
  key: 'img-overview',
  name: '图片概览',
}, {
  key: 'img-info',
  name: '图片详情',
}, {
  key: 'data-management',
  name: '数据管理',
}];
