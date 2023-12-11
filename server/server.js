//Budget API
const exp = require('constants');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

//const uri = "mongodb://127.0.0.1:27017/BudgetTracker";
const uri = "mongodb+srv://apadyal:password%401234@nbad.q1uxsmy.mongodb.net/?retryWrites=true&w=majority";
const userModel = require("./Models/user_schema");
const budgetModel = require("./Models/budget_schema");
const categoryModel = require("./Models/category_schema");
const expenseModel = require("./Models/expense_schema");

// mongoose.connect(uri)
//         .then((success) => 
//         {
//             console.log("Database Connected successfully");
//         })
//         .catch((err) =>
//         {
//             console.log(err.message)
//         });



//#region  User

app.post('/user', (req, res) => {
    //var data = getJsonFile();
    console.log('in user POST');
    console.log(req);
    saveUserData(req, res)
});

app.get('/user', (req, res) => {
    var userName = req.query.userName;
    console.log(userName);
    getUserData(userName, res);
    //res.json(data);
});

async function getUserData(userName, response) {
    await mongoose.connect(uri,{dbName: 'BudgetTracker'})
    .then(() => {
        console.log('After mongoose connetion')
        userModel.find({userName:userName})
        .then((data) => {
            //console.log('got data!: ',data);
            response.json(data);
        })
    }).catch((error) => {
        console.log(error);
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request."});
    });
}

async function saveUserData(req, response)
{
    console.log('In save user data');
    var userName = req.body.userName;
    var name = req.body.name;
    var lastLogin = req.body.lastLogin;

    console.log(userName, name, lastLogin);
    
    await mongoose.connect(uri,{dbName: 'BudgetTracker'})
    .then(async () => {
        var model = new userModel(
            {
                userName: userName, 
                name: name, 
                lastLogin:lastLogin
            });

        var existingUser = await userModel.findOne({userName : req.body.userName});

        if (existingUser != null){
            console.log('existing user - ', existingUser);
            existingUser.name = name;
            existingUser.userName = userName;
            existingUser.lastLogin = lastLogin;
            existingUser.save();
            let user = {"insertedObjects": [existingUser]};
            response.json(user);
        }
        else {
            model.validate()
            .then(() =>{
                    userModel.insertMany(model)
                    .then((data) => {
                        console.log(data);
                        let user = {"insertedObjects": data};
                        response.json(user);
                })
                .catch((error) => {
                    response.status(400);
                    response.json({error:error, object: req.body});
                });
            })
            .catch((ex) =>
            {
                if (ex.name == 'ValidationError')
                {
                    response.status(400);
                    response.json({error: ex.message, object: req.body});
                }
                else
                {
                    response.status(400);
                    response.json({error:"Error occurred while fulfilling the request.", userName: userName});
                }
            });
        }
    }).catch((error) => {
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request."});
    });
}

//#endregion

//#region Budget

app.get('/budget', (req, res) => {
    //res.json(data);
    getBudgetDataForUser(req,res);
});

app.post('/budget',(req, res) => {
    console.log('in budget POST');
    console.log(req);
    saveBudgetDataForUser(req, res);
});

async function getBudgetDataForUser(req,response){

    var userObjectID = req.query.userObjectID;
    await mongoose.connect(uri, {dbName: 'BudgetTracker'})
    .then(() => {
        budgetModel.find({userObjectID:userObjectID})
        .then((data) => {
            //console.log('got data!: ',data);
            response.json(data);
        })
    }).catch((error) => {
        console.log(error);
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request."});
    });
}

async function saveBudgetDataForUser(req, response){
    console.log('In save budget data');

    var userObjectID = req.body.userObjectID;
    var newBudget = req.body.budget;
    console.log(userObjectID, newBudget);
    
    await mongoose.connect(uri,{dbName: 'BudgetTracker'})
    .then(async () => {
        var model = new budgetModel(
            {
                userObjectID: userObjectID, 
                budget: newBudget
            });

        var existingBudget = await budgetModel.findOne({userObjectID : userObjectID});

        if (existingBudget != null){
            console.log('existing budget - ', existingBudget);
            existingBudget.budget = newBudget;
            existingBudget.save();
            let budget = {"insertedObjects": [existingBudget]};
            response.json(budget);
        }
        else {
            model.validate()
            .then(() =>{
                budgetModel.insertMany(model)
                    .then((data) => {
                        console.log(data);
                        let budget = {"insertedObjects": data};
                        response.json(budget);
                })
                .catch((error) => {
                    response.status(400);
                    response.json({error:error, object: req.body});
                });
            })
            .catch((ex) =>
            {
                if (ex.name == 'ValidationError')
                {
                    response.status(400);
                    response.json({error: ex.message, object: req.body});
                }
                else
                {
                    response.status(400);
                    response.json({error:"Error occurred while fulfilling the request.", object: req.body});
                }
            });
        }
    }).catch((error) => {
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request.", object: req.body});
    });
}

//#endregion

//#region Category

app.get('/categories', (req, res) => {
    //res.json(data);
    getAllCategories(res);
});

async function getAllCategories(response){

    await mongoose.connect(uri,{dbName: 'BudgetTracker'})
    .then(() => {
        console.log("in getAllCategories");
        categoryModel.find({})
        .then((data) => {
            console.log('got data!: ',data);
            response.json(data);
        })
    }).catch((error) => {
        console.log(error);
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request."});
    });
}

//#endregion

//#region Expense

app.get('/expense', (req, res) => {
    var userObjectId = req.query.userObjectID;
    console.log(userObjectId);
    getExpenseDataForUser(req, res);
    //res.json(data);
});

app.post('/expense',(req, res) => {
    console.log('in expense POST');
    console.log(req);
    saveExpenseDataForUser(req, res);
});

async function getExpenseDataForUser(req, res){
    var userObjectId = req.query.userObjectID;
    var month = req.query.month;
    await mongoose.connect(uri, {dbName: 'BudgetTracker'})
    .then(() => {
        expenseModel.find({userObjectId:userObjectId, month:month})
        .then((data) => {
            //console.log('got data!: ',data);
            res.json(data);
        })
    }).catch((error) => {
        console.log(error);
        res.status(400);
        res.json({error:"Error occurred while fulfilling the request."});
    });
}

async function saveExpenseDataForUser(req, response){
    console.log('In save expense data');

    var userObjectID = req.body.userObjectId;
    var newExpense = req.body.expense;
    var month = req.body.month;
    var category = req.body.category;

    console.log(userObjectID, category, newExpense, month);
    
    await mongoose.connect(uri, {dbName: 'BudgetTracker'})
    .then(async () => {
        var model = new expenseModel(
            {
                userObjectId: userObjectID, 
                expense: newExpense,
                category: category,
                month: month
            });

        var existingExpense = await expenseModel.findOne({userObjectID : userObjectID, month: month, category:category});

        if (existingExpense != null){
            console.log('existing expense - ', existingExpense);
            existingExpense.expense = newExpense;
            existingExpense.save();
            let expense = {"insertedObjects": [existingExpense]};
            response.json(expense);
        }
        else {
            model.validate()
            .then(() =>{
                expenseModel.insertMany(model)
                    .then((data) => {
                        console.log(data);
                        let expense = {"insertedObjects": data};
                        response.json(expense);
                })
                .catch((error) => {
                    response.status(400);
                    response.json({error:error, object: req.body});
                });
            })
            .catch((ex) =>
            {
                if (ex.name == 'ValidationError')
                {
                    response.status(400);
                    response.json({error: ex.message, object: req.body});
                }
                else
                {
                    response.status(400);
                    response.json({error:"Error occurred while fulfilling the request.", object: req.body});
                }
            });
        }
    }).catch((error) => {
        response.status(400);
        response.json({error:"Error occurred while fulfilling the request.", object: req.body});
    });
}

//#endregion

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});