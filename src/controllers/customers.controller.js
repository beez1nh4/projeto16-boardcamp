import { connectionDB } from "../database/db.js";

export async function getCustomers(req, res){
    try{
        const {rows} = await connectionDB.query("SELECT * FROM customers;");
        res.send(rows);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function getCustomersById(req, res){
    const {id} = req.params;
    try{
        const {rows} = await connectionDB.query("SELECT * FROM customers WHERE id=$1;"
        [id]
        );
        res.send(rows);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function postCustomers(req, res){
    const {name} = req.body;
    try{
        await connectionDB.query("INSERT INTO categories (name) VALUES ($1);",
        [name]
        );
        res.sendStatus(201);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function putCustomers(req, res){
    const {name} = req.body;
    try{
        await connectionDB.query("INSERT INTO categories (name) VALUES ($1);",
        [name]
        );
        res.sendStatus(201);
    } catch (err){
        res.status(500).send(err.message);
    }
}