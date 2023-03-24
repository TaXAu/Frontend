export enum ROUTE_NAME {
  HOME = 'home',
  OCR = 'ocr',
  OCR_PROJECTS = 'ocr-projects',
  OCR_PROJECT_CONFIG = 'ocr-project-config',
  OCR_PROJECT_IMAGES = 'ocr-project-images',
  OCR_PROJECT_IMAGE_DETAIL = 'ocr-project-image-detail',
  OCR_PROJECT_DATA = 'ocr-project-data',
  RPA = 'rpa',
  SETTINGS = 'settings',
}

interface ocrSubNavItemType {
  readonly key: ocrPageKeyType
  readonly name: string
}

export type ocrPageKeyType =
  ROUTE_NAME.OCR_PROJECTS |
  ROUTE_NAME.OCR_PROJECT_IMAGES |
  ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL |
  ROUTE_NAME.OCR_PROJECT_DATA |
  ROUTE_NAME.OCR_PROJECT_CONFIG

export const ocrSubNavItem: ocrSubNavItemType[] = [{
  key: ROUTE_NAME.OCR_PROJECTS,
  name: '项目总览',
}, {
  key: ROUTE_NAME.OCR_PROJECT_CONFIG,
  name: '项目配置',
}, {
  key: ROUTE_NAME.OCR_PROJECT_IMAGES,
  name: '图片概览',
}, {
  key: ROUTE_NAME.OCR_PROJECT_IMAGE_DETAIL,
  name: '图片详情',
}, {
  key: ROUTE_NAME.OCR_PROJECT_DATA,
  name: '数据管理',
}]
