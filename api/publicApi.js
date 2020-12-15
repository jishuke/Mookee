export const upImg = (image) => {
    return new Promise(() => {

        let filename = path.substring ( path.lastIndexOf ( '/' ) + 1 , path.length );
        let formData = new FormData ();
        let file = {
            uri : image.path ,
            type : 'multipart/form-data' ,
            name : filename ,
            'size' : image.size ,
            tmp_name : image.filename
        };
        formData.append ( 'file' , file );
        formData.append ( 'name' , 'file' );
        formData.append ( 'key' , key );
        let url = AppSldUrl + '/index.php?app=sns_album&mod=file_upload';
        fetch ( url , {
            method : 'POST' ,
            mode : 'cors' ,
            credentials : 'include' ,
            headers : {} ,
            body : formData
        } )
            .then ( response => response.json () )
            .then ( result => {
                console.log('uploadImage--', result);
                // this.setState ( {
                // 	[ name ] : result.datas.name ,
                // 	[ name + '_base64' ] : result.datas.img_url ,
                // } )
            } )
            .catch ( error => {
                //上传出错
            })
    });
}