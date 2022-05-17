const express = require('express');
const {v4: uuidv4} = require('uuid'); //v4 gera um uuid randomico

const app = express();
app.use(express.json());

const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement [] 
 */
app.post("/account", (request, response) => {
    const {cpf, name} = request.body; //para pegar o cpf e o name que está vindo do request
    
    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    return response.status(201).send();
})
app.listen(3333);