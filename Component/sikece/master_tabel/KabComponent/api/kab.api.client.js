export default {
    simpanKab: (data, socket, props) => {
        socket.emit('api.master_tabel.kab/simpanKab', data, (response)=>{
            if(response.type === 'error'){
                props.showErrorMessage(response.data)
            } else{
                props.showSuccessMessage(response.data)
            }
        })
    }
}