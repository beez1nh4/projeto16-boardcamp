import { connectionDB } from "../database/db.js";
import dayjs from "dayjs";

export async function getRentals(req, res){
    try{
        const {rows} = await connectionDB.query(
            `SELECT rentals.*, customer.id, customer.name, games.*
            FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            ;
            `)
        res.send(rows);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function postRentals(req, res){
    const {customerId, gameId, daysRented} = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    try{
        const gamePrice = await connectionDB.query('SELECT "pricePerDay" FROM games WHERE id=$1;', [gameId])
        
        const {pricePerDay} = gamePrice.rows[0]
        
        const originalPrice = Number(daysRented*pricePerDay)
        
        await connectionDB.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
        );
        res.sendStatus(201);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function postRentalsReturn(req, res){
    const {id} = req.params;
    try{
        await connectionDB.query('UPDATE rentals "returnDate"=$1, "delayFee"=$2 WHERE id=$3;',
        [returnDate, delayFee, id]
        );
        res.sendStatus(201);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function deleteRentals(req, res){
    const {id} = req.params;
    try{
        
        await connectionDB.query("DELETE FROM rentals WHERE id=$1", [id]);
        res.sendStatus(200);

    } catch (err){
        res.status(500).send(err.message);
    }
}