##弹框组件使用说明

### 1.组件引用

`import CameraPhoto from '@/components/CameraPhoto/CameraPhoto'`

### 2.组件使用

<camera-photo ref="CameraPhoto" :uploadImg="uploadImg" @changeImg="changeImg"></camera-photo>

#### 2.1参数说明
| 参数名 | 类型 | 默认值 | 必选 | 说明 |
| :-----: | :----: | :------: | :---: | :---- |
| uploadImg | Object | 参见属性说明 | - | 拍照成功后传给父组件图片信息 |
| changeImg | Boolean | false | - | 通知父组件接收图片并改变父组件照片预览显示|

##### 2.1.1 uploadImg属性说明
| 属性名 | 属性 | 类型 | 默认值 | 必选 | 说明 |
| :-----: | :----: | :----: | :------: | :---: | :---- |
| 照片名| imgName  | String | 'cameraPhote.jpg' | - | 固定值，后台处理图片必要参数|
| 照片Base64| imgBase64  | String | '' | - | 拍照完成后Ocx生成的照片                             |
