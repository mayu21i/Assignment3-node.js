const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const { json } = require('body-parser');
const app = express();
const PORT = 3000 ;
const USERS_FILE = path.join(__dirname, "users.json");

app.use(express.json());

async function readUsers() {
    try{
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        if(!data.trim()){
            return [];
        }
        return JSON.parse(data);
    }catch(err){
        if(err.code === "ENOENT"){
            return [];
        }
        throw err ;
    }  
}
async function writeUsers(users){
    await fs.writeFile(USERS_FILE , JSON.stringify(users , null , 2));
}

app.post('/user' , async (req , res) => {

    const {name , age , email} = req.body ;
    let users = await readUsers();

    const emailExists = users.find((user) => email === user.email);

    if(emailExists){
        return res.status(409).json({message: 'Email already exists.'})
    }
    const id = users.length === 0 ? 1 : Math.max(...users.map( (user) => Number(user.id))) + 1;

    users.push({id , name , age , email});
    await writeUsers(users);
    return res.status(201).json({
        message: 'User added successfully.'
    })

})

app.patch('/user/:id' , async (req , res) => {
    const {id} = req.params;
    let users = await readUsers();
    let updatedValues = req.body;

    const indexOfUser = users.findIndex( (user) => {
        return Number(id) === user.id;
    })
    if(indexOfUser === -1){
        return res.status(404).json({
            message: 'User ID not found.'
        });
    }
    const updatedFields = Object.keys(updatedValues);
    Object.assign(users[indexOfUser] , updatedValues);
    await writeUsers(users);
    res.status(200).json({
        message: `User ${updatedFields.join(', ')} updated successfully.`
    });

})

app.delete('/user/:id' , async (req , res) => {
    const {id} = req.params ;
    let users = await readUsers();

    const indexOfUser = users.findIndex((user) => {
        return Number(id) === Number(user.id) 
    });
    if(indexOfUser === -1){
        return res.status(404).json(
            {message: 'User ID not found.'}
        );
    }
    users = users.filter((user) => {
        return Number(id) !== Number(user.id)
    });
    await writeUsers(users);
    return res.status(200).json({
        message: 'User deleted successfully.'
    });
})

app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
})

