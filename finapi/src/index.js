const { request } = require('express');
const { response } = require('express');
const express = require('express');
const {v4: uuidv4} = require('uuid'); //v4 gera um uuid randomico

const app = express();
app.use(express.json());

const customers = [];

//Midleware
function verifyIfExistsAccountCPF(request, response, next){
    const {cpf} = request.headers;
    
    const customer = customers.find( customer => customer.cpf === cpf);
    
    if(!customer){
        return response.status(400).json({error: "Customer not found"});
    }

    request.customer = customer;

    return next();
}

function getBalance(statement){
    const balance = statement.reduce((acc, operation) =>{
      if(operation.type === 'credito'){
        return acc + operation.amount;
      }else{
          acc - operation.amount;
      } 
    }, 0);

    return balance;
}

app.post("/account", (request, response) => {
    const {cpf, name} = request.body; //para pegar o cpf e o name que está vindo do request
    
    const customersAlreadyExists = customers.some(
        (customers) => customers.cpf === cpf
    );

    if(customersAlreadyExists){
        return response.status(400).json({error:"Customer already exists!"})
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

//app.use(verifyIfExistsAccountCPF); para usar o midleware em todas as rotas

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;
    return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const {description, amount} = request.body;
    
    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const {amount} = request.body;
    const {customer} = request;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error: "Inssuficient funds"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
    
});

app.listen(3333);