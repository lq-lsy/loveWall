var BottosWalletSDK = window.BottosWalletSDK
const config = {
    baseUrl:'http://192.168.52.130:8689/v1',
    version:1
}
var SDK = new BottosWalletSDK(config)
var Tool = SDK.Tool
var Wallet = SDK.Wallet
var Contract = SDK.Contract
var Api = SDK.Api

let account = 'testaccount'
let password = 'testpassword'
let keystore = null

// 创建账户
function createAccount(){
    console.log("createAccount")
    let params = {account:account,password:password}
    Wallet.createAccount(params)
        .then(response=>{
            keystore = response
            document.getElementById('createAccount').innerHTML = JSON.stringify(response)
        }).catch(error=>{
            console.log({error})
            document.getElementById('createAccount').innerHTML = JSON.stringify(error)

        })
}

// 调用合约
function callContract(requestParam){

    let params = {
        method:'reguser',
        contract:'john',
        sender:account,

        param:{
            userName:'john',
            userInfo:JSON.stringify({phone:'110120',age:18})
        }
    }

    if(keystore == null){
        alert('请先创建账户')
        return
    }
    let privateKey = Wallet.recover(password,keystore)
    let privateKeyStr = Tool.buf2hex(privateKey)

    Contract.callContract(params,privateKeyStr)
        .then(response=>{
            console.log({response})
            document.getElementById('pushTransaction').innerHTML = JSON.stringify(response)
        }).catch(error=>{
            console.log({error})
            document.getElementById('pushTransaction').innerHTML = JSON.stringify(error)
        })
}

// 发布联系人
function pushTransaction(){
    console.log("pushTransaction")
    callContract()
}

// 读取联系人
function getTransaction(){
    console.log("getTransaction")
    // callContract()
    let url =  config.baseUrl + '/common/query'
    let params = {
        contract:'john',
        object:'userreginfo',
        key:'john'

    }

    fetch(url,{
        method:'POST',
        body:JSON.stringify(params)
    }).then(function(response){return response.json()})
    .then(function(response){
        document.getElementById('getTransaction').innerHTML = JSON.stringify(response)
    }).catch(function(error){
        document.getElementById('getTransaction').innerHTML = JSON.stringify(error)
    })
}
