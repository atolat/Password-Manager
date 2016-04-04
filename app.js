console.log('Starting Password Manager...');
var storage= require('node-persist');
var crypto= require('crypto-js');
storage.initSync();

var argv = require('yargs')
            .command('create','Set account data',function(yargs){
                yargs.options({
                    name: {
                        demand: true,
                        alias: 'n',
                        description:'Your account name goes here'
                    },
                    username:{
                        demand: true,
                        alias: 'u',
                        description:'Your username goes here'
                    },
                    password:{
                        demand: true,
                        alias: 'p',
                        description: 'Your password goes here'
                },
                    masterPassword:{
                        demand: true,
                        alias: 'm',
                        description: 'Password to add data to system'
                    }
                }).help('help');
            })
            .command('get','Get account data',function(yargs){
                yargs.options({
                    name:{
                        demand: true,
                        alias: 'n',
                        description: 'Account name goes here'
                    },
                    masterPassword:{
                        demand: true,
                        alias: 'm',
                        description: 'Password to get data from system'
                    }
                }).help('help');
    
})
            .help('help')
            .argv;
var command= argv._[0];



function getAccounts(masterPassword){
    //fetch accounts from storage
    var encryptedAccounts= storage.getItemSync('accounts');
    var decryptedAccounts=[];
    //decrypt
    if(typeof encryptedAccounts!=='undefined'){
    var bytes = crypto.AES.decrypt(encryptedAccounts,masterPassword);
    decryptedAccounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }//return accounts
    return decryptedAccounts;
}

function saveAccounts(accounts, masterPassword){
    //Encrypt Accounts
    var encryptedAccounts=crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
    //setItemSync
    storage.setItemSync('accounts',encryptedAccounts.toString());
    //return accounts
    return accounts;
}

function createAccount (account, masterPassword){
    var accounts = getAccounts(masterPassword);
//    if(typeof accounts==='undefined'){
//        accounts=[];
//    }
    accounts.push(account);
    saveAccounts(accounts, masterPassword);
    return account;
};

function getAccount (accountName, masterPassword){
    var accounts= getAccounts(masterPassword);
    var matchAccount;
    for(var i=0;i<accounts.length;i++){
        if(accounts[i].name===accountName){
            matchAccount=accounts[i];
        }
        
    } return matchAccount;
}



//createAccount({
//    name:'Facebook',
//    username:'someone@gmail.com',
//    password:'Password123!'
//});
//
// var Facebook=getAccount('Facebook');
//console.log(Facebook);

if(command==='create'){
    try{
        var createdAccount=createAccount({
        name: argv.name,
        username: argv.username,
        password:argv.password
    }, argv.masterPassword);
    console.log('Account created');
    console.log(createdAccount);
    } catch(e){
        console.log('Unable to create account, Master Password invalid.');
    }
} else if(command==='get'){
    try{
        var fetchedAccount=getAccount(argv.name, argv.masterPassword);
    
    if(typeof fetchedAccount==='undefined'){
        console.log('Account not found');
    }else{
        console.log('Account found');
        console.log(fetchedAccount);
    }
    } catch(e){
        console.log('Unable to get account details, Master Password is invalid.');
    }
}