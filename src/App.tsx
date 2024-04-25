
import request from '@/utils/request'

function App() {

    request.post('/oauth/login').then((res: any)=>{
        console.log(res);
    })


  return (
    <>

    </>
  )
}

export default App
