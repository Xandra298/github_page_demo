const express = require('express'); //引入express模块
const mysql = require('mysql'); //引入mysql模块
const app = express(); //创建express的实例
const bodyParser = require('body-parser');
const ejs = require('ejs');
const moment = require('moment');
var current_userID;
var current_padmID = 1;
var current_sadmID;
var order ={};
//数据库连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12306',
    database: 'park_system'
})
connection.connect();

app.engine("html", ejs.__express);
app.set("view engine", "html");
//配置静态目录
app.use(express.static("static"));
//内置中间件，配置静态文件
//配置body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})
//render
// ------------------------------------user-------------------------------------------------------
app.get('/index/user', (req, res) => {
    res.render("user/index_user");
    
})
app.get('/reservation', (req, res) => {
    res.render("user/reservation");
})
app.get('/positionChoose', (req, res) => {
    res.render("user/positionChoose");
})
app.get('/dateChoose', (req, res) => {
    res.render("user/dateChoose");
})
app.get('/login', (req, res) => {
    res.render("login");
})
app.get('/', (req, res) => {
    res.render("login");
})
app.get('/record', (req, res) => {
    res.render("user/record"); 
})

app.get('/money', (req, res) => {
    res.render("user/money");
})
app.get('/alert', (req, res) => {
    res.render("user/alert");
})
app.get('/information', (req, res) => {
    res.render("user/information");
})
app.get('/spotChoose', (req, res) => {
    res.render("user/spotChoose");
})
app.get('/redirect',(req,res) =>{
    res.render("user/redirect2");
});
app.get('/redirect404',(req,res)=>{
    res.render("user/redirect");
});
//----------------------------------------------------------------------------
//-----------------------system_manager--------------------------------------------
app.get('/index/sadm', (req, res) => {
    res.render("system_manager/index");
});
app.get('/sys/set/user/info', (req, res) => {
    res.render("system_manager/set/user/info");
});
app.get('/sys/set/user/password', (req, res) => {
    res.render("system_manager/set/user/password");
});
app.get('/sys/home/console', (req, res) => {
    res.render("system_manager/home/console");
});
app.get('/sys/app/message/index', (req, res) => {
    res.render("system_manager/app/message/index");
});
app.get('/sys/component/table/toolbar', (req, res) => {
    res.render("system_manager/component/table/toolbar");
});
app.get('/sys/component/table/toolbar1', (req, res) => {
    res.render("system_manager/component/table/toolbar1");
});
app.get('/sys/component/table/cellEdit', (req, res) => {
    res.render("system_manager/component/table/cellEdit");
});
app.get('/sys/component/table/cellEdit1', (req, res) => {
    res.render("system_manager/component/table/cellEdit1");
});
app.get('/sys/component/panel/index', (req, res) => {
    res.render("system_manager/component/panel/index");
});
app.get('/sys/template/personalpage', (req, res) => {
    res.render("system_manager/template/personalpage");
});
app.get('/sys/template/addresslist', (req, res) => {
    res.render("system_manager/template/addresslist");
});
app.get('/sys/template/msgboard', (req, res) => {
    res.render("system_manager/template/msgboard");
});
app.get('/sys/set/system/website', (req, res) => {
    res.render("system_manager/set/system/website");
});
app.get('/sys/set/system/email', (req, res) => {
    res.render("system_manager/set/system/email");
});
app.get('/sys/user/user/list', (req, res) => {
    res.render("system_manager/user/user/list");
});
app.get('/sys/app/workorder/list', (req, res) => {
    res.render("system_manager/app/workorder/list");
});

//-----------------------------------------------------------------
//-------------------------park_manager------------------------------
app.get('/index/padm', (req, res) => {
    res.render("park_manager/index");
});
app.get('/set/user/info', (req, res) => {
    res.render("park_manager/set/user/info");
});
app.get('/set/user/password', (req, res) => {
    res.render("park_manager/set/user/password");
});
app.get('/home/console', (req, res) => {
    res.render("park_manager/home/console");
});
app.get('/app/message/index', (req, res) => {
    res.render("park_manager/app/message/index");
});
app.get('/component/table/toolbar1', (req, res) => {
    res.render("park_manager/component/table/toolbar1");
});
app.get('/component/table/reload', (req, res) => {
    res.render("park_manager/component/table/reload");
});
app.get('/template/msgboard', (req, res) => {
    res.render("park_manager/template/msgboard");
});
app.get('/template/personalpage', (req, res) => {
    res.render("park_manager/template/personalpage");
});
app.get('/template/addresslist', (req, res) => {
    res.render("park_manager/template/addresslist");
});
app.get('/set/system/website', (req, res) => {
    res.render("park_manager/set/system/website");
});
app.get('/set/system/email', (req, res) => {
    res.render("park_manager/set/system/email");
});

//---------------------------------------------
//登录
app.post('/login/verify',(req,res)=>{
    var body = req.body;//前端传参
    var selectValue = req.body.selectValue;//用户类型
    var password = body.loginPassword;//密码
    var username = body.loginUsername;//用户名
    var parm_back = {};//回传
    var raw_result;
    var userPassword;
    console.log('verify-----------------------------------');
    console.log(req.body);

    if(selectValue == '0'){
        var Sql = "SELECT userPw FROM user WHERE userID ='" + username +"'";     
        connection.query(Sql,(err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                parm_back.code = '404';
                res.send(JSON.stringify(parm_back));
                console.log(JSON.stringify(parm_back));
            }
            else{
                raw_result = JSON.stringify(result);
                userPassword = raw_result.slice(12, -3)
                if(password == userPassword){
                    current_userID = username;
                    parm_back.code = '999';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                }else{
                    parm_back.code = '000';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                    console.log('not satisfied');
                }  
            }
            res.end();      
        })   
    }else if(selectValue == '1'){
        var Sql = "SELECT PAdmPw FROM padm WHERE PAdmID ='" + username +"'";     
        connection.query(Sql,(err, result) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                parm_back.code = '404';
                res.send(JSON.stringify(parm_back));
                console.log(JSON.stringify(parm_back));
            }
            else{
                raw_result = JSON.stringify(result);
                userPassword = raw_result.slice(12, -3)
                if(password == userPassword){
                    current_padmID = username;
                    parm_back.code = '888';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                }else{
                    parm_back.code = '000';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                    console.log('not satisfied');
                }  
            }
            res.end();      
        })   
    }else if(selectValue == '2'){
        var Sql = "SELECT SAdmPw FROM sadm WHERE SAdmID ='" + username +"'";     
        connection.query(Sql,(err, result) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                parm_back.code = '404';
                res.send(JSON.stringify(parm_back));
                console.log(JSON.stringify(parm_back));
            }
            else{
                raw_result = JSON.stringify(result);
                userPassword = raw_result.slice(12, -3)
                if(password == userPassword){
                    current_sadmID = username;
                    parm_back.code = '777';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                }else{
                    parm_back.code = '000';
                    res.send(JSON.stringify(parm_back));
                    console.log(JSON.stringify(parm_back));
                    console.log('not satisfied');
                }  
            }
            res.end();      
        })   
    }
    
});
//注册
app.post('/login/register',function(req,res){
    var body = req.body;
    var selectValue = req.body.selectValue;
    var addSqlParams = [body.registerUsername,body.registerPassword,0,0,100];
    // var addSqlParams = [body.registerUsername,body.registerPassword];
    console.log('register------------------------');
    if(selectValue ==''){
        console.log('null');
        return;
    }
    if(selectValue == '0'){//user
        var addSql = 'INSERT INTO user(userID,userPw,userAccount,userPoint,userCredit) VALUES(?,?,?,?,?)';     
        connection.query(addSql, addSqlParams, (err, result) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }else{
                console.log('insert user successfully');
            }
        
           res.send(JSON.stringify('successfully'));
           res.end();
        //    connection.end();
           
        })
    }else if(selectValue == '1'){
        var addSql = 'INSERT INTO padm(PAdmID,PAdmPw) VALUES(?,?)';
        connection.query(addSql, addSqlParams, (err, result) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }else{
                console.log('insert padm successfully');
            }
           res.send(JSON.stringify('successfully'));
           res.end();
           
        })
    }else if(selectValue == '2'){
        var addSql = 'INSERT INTO sadm(SAdmID,SAdmPw) VALUES(?,?)';
        connection.query(addSql, addSqlParams, (err, result) => {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }else{
                console.log('insert sadm successfully');
            }
           res.send(JSON.stringify('successfully'));
           res.end();
           
        })
    }
    
});
// -----------------------------user-----------------------------------------
app.post('/alert/post',(req,res)=>{
    var body = req.body;
    var text = body.username +":"+ body.desc;
    var sql = "insert into user_violation(userID,reason) values(?,?)";
    var addparm = [current_userID,text];
    connection.query(sql,addparm,(err,result)=>{
        if(err){
            console.log('[insert error]',err.message);
            res.redirect('/redirect404');
        }else{
            console.log('success');
            console.log(text);
            res.redirect('/redirect');
        }
    });
});

//账户：
app.get('/money/query',(req,res)=>{
    var sql = "SELECT userAccount FROM user where userID = '"+current_userID+"'";
    var back={};
    if(current_userID){
        connection.query(sql,(err,result)=>{
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }else{
                back.account = result[0].userAccount;
                res.send(JSON.stringify(back));
                console.log(back);
                res.end();
            }
          
        });
    }else{
        back.account = '没有查到';
        res.send(JSON.stringify(back));
        res.end();
    }
    
});
app.post('/money/post',(req,res)=>{
    var body = req.body;
    console.log('money post');
    console.log(req.body);
    var money = body.money;
    var password = body.password;
    var sql = "select userPw from user where userID = '"+ current_userID+"'";
    var parm_back={};
    var verify = 'false';
    connection.query(sql,(err,result)=>{
        if(err){
            console.log('[SELECT ERROR] - ', err.message);
            parm_back.code = 'error';
            res.send(JSON.stringify(parm_back));
            console.log(JSON.stringify(parm_back));
            res.end();
        }else{
            console.log(result[0]);
            if (password == result[0].userPw){
                verify='true';
                console.log(verify);
                console.log('recharge');
                var UDsql = "UPDATE user SET userAccount =  userAccount + "+ money+"  WHERE userID = '"+current_userID+"'";
                connection.query(UDsql,(err,result)=>{
                    if(err){
                        console.log('[UPDATE ERROR] - ', err.message);
                        parm_back.code = 'error recharge';
                        res.send(JSON.stringify(parm_back));
                        console.log(JSON.stringify(parm_back));
                    }else{
                        console.log(result);
                        parm_back.code = 'success';
                        // res.send(JSON.stringify(parm_back));
                        res.redirect('/redirect');//重定向
                        console.log(JSON.stringify(parm_back));
                    }
                    res.end();
                });
                
            }else{
                parm_back.code = 'error password';
                res.send(JSON.stringify(parm_back));
                console.log(JSON.stringify(parm_back));
                res.end();
            }
        }
        
    });
 

});

//预约记录展示
app.get('/record/init',(req,res)=>{
    var sql = "SELECT o.orderID,o.orderTime,o.plateNum,o.estimatedTime,p.parkName,o.ifOntime,o.cost FROM parkorder o,park p WHERE o.parkID=p.parkID AND userID='" 
     + current_userID+"'";  
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else{
           
            str = JSON.stringify(result);
            console.log(str);
            res.send(str);
            res.end();
        }
      
    });
});

//订单！ 
app.post('/order/Post', (req, res) => {
    console.log('position test1');
    var body = req.body;
    order.userID = current_userID;
    
    if(body.parkName){
        order.parkName = body.parkName;
        console.log(order.parkName);
        var Sql = "select count(parkID) as count from park where parkName like '"+order.parkName+"%'";
        var sql = "select parkID,charge from park where parkName like '"+order.parkName+"%'";
        var parm_back={};
        connection.query(Sql,(err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                parm_back.code = 'error';
                res.redirect('/positionChoose');
                console.log(JSON.stringify(parm_back));
            }  
            else{
                if(result[0].count == '1'){
                    parm_back.code ='200';
                    parm_back.name = 'success';
                    res.redirect('/dateChoose');
                    console.log(JSON.stringify(parm_back));
                    
                }else if(result[0].count > '1'){
                    parm_back.code ='201';
                    res.redirect('/positionChoose');
                    console.log(JSON.stringify(parm_back));
                    
                }else if(result[0].count == '0'){
                    parm_back.code ='300';//无该停车场
                    res.redirect('/positionChoose');
                    console.log(JSON.stringify(parm_back));
                    
                }
            }
            res.end(); 
        });
        connection.query(sql,(err,result)=>{
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                parm_back.code ='201';
                res.redirect('/positionChoose');
                console.log(JSON.stringify(parm_back));
            }else{
                order.parkID = result[0].parkID;
                order.charge = result[0].charge;
                console.log(result[0]);
            }
        });
    }
    if(body.time_start){
        order.estimatedTime = body.time_start;
        console.log(order.estimatedTime);
    }
    if(body.time_end){
        order.leaveTime = body.time_end;
        console.log(order.leaveTime);
        var end = order.leaveTime;
        var end1 = new Date(end.replace(/-/g, "/"));//replace方法将-转为/复制代码
        var start = order.estimatedTime;
        var start1 = new Date(start.replace(/-/g, "/"));//replace方法将-转为/复制代码
        var time = end1.getTime() - start1.getTime();//时间差的毫秒数
        order.cost  = (time/60000)*order.charge;
        console.log(time);
        console.log(order.cost);
    }
    
    if(body.plateNum){
        order.plateNum = body.plateNum;
        console.log(order.plateNum);
        // res.redirect('/spotChoose');
        // res.end();
        // res.send("success");
    }
   
    if(body.orderParking){

        order.orderParking=body.orderParking;
        console.log(order.orderParking);
        var parm_back={};
        parm_back.code='success';
        var orderID;
        var sql_id = "SELECT (max(orderID)+1) as orderID from parkorder;";
        connection.query(sql_id,(err,result)=>{
            if (err) {
             console.log('[SELECT ERROR] - ', err.message);
            }else{
                order.orderID= result[0].orderID;
                
                console.log(result);
                order.orderTime = new moment().format('YYYY-MM-DD HH:mm:ss');
                console.log(order);
        
        
                var addSql = 'insert into parkorder(orderID,parkID,userID,orderTime,orderParking,plateNum,estimatedTime,leaveTime,cost) VALUES(?,?,?,?,?,?,?,?,?);';  
                var addSqlParams = [order.orderID,order.parkID,order.userID,order.orderTime,order.orderParking,order.plateNum,order.estimatedTime,order.leaveTime,order.cost];  
                    connection.query(addSql, addSqlParams, (err, result) => {
                        if (err) {
                            console.log('[INSERT ERROR] - ', err.message);
                            res.redirect('/redirect404');
                            return;
                        }else{
                            console.log('insert order successfully');
                            parm_back.insert = '200';
                            res.send(JSON.stringify(parm_back));
                            res.end();
                        }
        
                    });
            }
        });
        
    
    }  
});

//车位实时渲染
app.get('/order/spotGet',(req, res) => {
   console.log('spot get');
   
   var Sql = "SELECT orderParking FROM parkorder WHERE leaveTime >'"+order.estimatedTime+"'OR estimatedTime <'"+order.leaveTime +"' AND parkID ='"+order.parkID+"'";     
   connection.query(Sql,(err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
        }
        else{
            var list = {};
            var len = Object.keys(result).length;
            list.len=len;
            var arr = new Array();
            for(var i in result){
                arr.push(result[i].orderParking);
            }
            list.arr = arr;
            console.log(list);
            res.send(list);
        }
        res.end();      
    
    })
});


// -------------------------------------------------------------------------------------------

//管理的停车场信息数据渲染
app.get('/parkInfo/init',(req,res)=>{
    var sql = "SELECT * FROM park WHERE parkID=(SELECT parkID FROM padm WHERE padmID= '" + current_padmID+"');";  
   connection.query(sql, function (err, result) {
       if (err) {
           console.log(err);
       }else{
          
           str = JSON.stringify(result);
           console.log(str);
           res.send(str);
           res.end();
       }
     
   });
});
//更改空位值

app.post('/parkInfo/update',(req,res)=>{
    var body = req.body;
    var emptyParking = body.emptyParking;
    var parkID = body.parkID;
    // var parkCredit = body.parkCredit;
    // var parkNum = body.parkingNum;
    var charge = body.charge;
    console.log('update');
    console.log(body);
    console.log(emptyParking);
    console.log(parkID);
    var parm_back={};
    
    var updateSql = "UPDATE park SET emptyParking= '"+ emptyParking + "',charge='"+charge+"'WHERE parkID='"+parkID+"'";
            connection.query(updateSql, (err, result) => {
                if (err) {
                    console.log('[updatet ERROR] - ', err.message);
                    parm_back.err = '300';
                    // res.redirect('/component/table/toolbar1');
                    return;
                }else{
                    console.log('update emptyParking successfully');
                    parm_back.update = '200';
                    console.log('success');
                    res.send(JSON.stringify(parm_back));
                    res.end();
                }
                
            });
  
   
});

app.get('/parkInfo/order',(req,res)=>{
    
    console.log('parkOrder');
    var orderID = req.query.orderID;
    console.log(req.query.orderID);
    if(orderID){
        var sql = "SELECT * FROM parkorder WHERE orderID='" +orderID+"'AND parkID=(SELECT parkID FROM padm WHERE padmID= '" + current_padmID+"');";  
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.end();
            }else{
               
                str = JSON.stringify(result);
                console.log(str);
                res.send(str);
                res.end();
            }
          
        });
    }else{
        var sql = "SELECT * FROM parkorder WHERE parkID=(SELECT parkID FROM padm WHERE padmID= '" + current_padmID+"');";  
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            }else{
               
                str = JSON.stringify(result);
                console.log(str);
                res.send(str);
                res.end();
            }
          
        });
     
    }
   
});
// app.get('/parkInfo/vio',(req,res)=>{
//     console.log('test');
//     console.log(req.body);
// });
app.get('/sysInfo/park/init',(req,res)=>{
    var sql = "SELECT * FROM park";  
   connection.query(sql, function (err, result) {
       if (err) {
           console.log(err);
       }else{
          
           str = JSON.stringify(result);
           console.log(str);
           res.send(str);
           
       }
       res.end();
   });
});

app.get('/sysInfo/user/init',(req,res)=>{
    var sql = "SELECT userID,userName,userTel,userAccount,userPoint,userCredit FROM user";  
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else{
           
            str = JSON.stringify(result);
            console.log(str);
            res.send(str);
            
        }
        res.end();
    }); 
});

app.post('/sysInfo/user/delete',(req,res)=>{
    var body = req.body;
    var userID = body.userID;
    console.log('user delete');
    console.log(body);
    var parm_back={};
    
    var Sql = "DELETE FROM user WHERE userID = '"+userID+"'";
            connection.query(Sql, (err, result) => {
                if (err) {
                    console.log('[delete ERROR] - ', err.message);
                    parm_back.code = '300';
                   
                }else{
                    console.log('delete user successfully');
                    parm_back.code = '200';
                    console.log('success');
                    res.send(JSON.stringify(parm_back));
                    
                }
                res.end();
            });
  
   
});
app.post('/sysInfo/park/delete',(req,res)=>{
    var body = req.body;
    var parkID = body.parkID;
    console.log('park delete');
    console.log(body);
    var parm_back={};
    
    var Sql = "DELETE FROM park WHERE parkID = '"+parkID+"'";
            connection.query(Sql, (err, result) => {
                if (err) {
                    console.log('[delete ERROR] - ', err.message);
                    parm_back.code = '300';
                    return;
                }else{
                    console.log('delete park successfully');
                    parm_back.code = '200';
                    console.log('success');
                    res.send(JSON.stringify(parm_back));
                    res.end();
                }
                
            });
  
   
});
app.listen(8081);//监听
console.log('listening 8081');