import { connectionDB } from "../database/db.js";
import dayjs from "dayjs";

export async function getRentals(req, res){
    const {gameId, customerId} = req.query;

    try{

        if (gameId){
            const gamesRentals = await connectionDB.query(
                'SELECT * FROM rentals WHERE "gameId"=$1;',
                [gameId]
            );
            return res.send(gamesRentals.rows)
        }
    
        if (customerId){
            const customerRentals = await connectionDB.query(
                'SELECT * FROM rentals WHERE "customerId"=$1;',
                [customerId]
            );
            return res.send(customerRentals.rows)
        }

        const {rows} = await connectionDB.query(
            `SELECT rentals.*,
            customers.name AS "customerName", 
            games.name AS "gameName",
            games."categoryId" AS "gameCategoryId",
            categories.name AS "gameCategoryName"
            FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            ;
            `)
        const newRentals = rows.map((rental) => {
            return {id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName
            },
            game:{
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.gameCategoryId,
                categoryName: rental.gameCategoryName
            }
            }
        })
        res.status(200).send(newRentals);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function postRentals(req, res){
    const {customerId, gameId, daysRented} = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    try{
        const rentals = await connectionDB.query(
            'SELECT * FROM rentals WHERE "gameId"=$1;',
            [gameId]
        );
        
        const stock = await connectionDB.query(
            'SELECT "stockTotal" FROM games WHERE "id"=$1;',
            [gameId]
        );

        if (rentals.rows.length > stock.rows[0].stockTotal){
            return res.sendStatus(400)
        }

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
        const returnDateObj = await connectionDB.query('SELECT "returnDate" FROM rentals WHERE id=$1;', [id]);
        const {returnDate} = returnDateObj.rows[0]

        if (returnDate !== null){
            return res.sendStatus(400)
        } else{
        
        const returnDateSet = dayjs().format('YYYY-MM-DD');
        await connectionDB.query('UPDATE rentals SET "returnDate"=$1 WHERE id=$2;',
        [returnDateSet,id]
        );

        const rental = await connectionDB.query('SELECT * FROM rentals WHERE id=$1;', [id]);
        const priceToPayDay = Number(rental.rows[0].originalPrice) / Number(rental.rows[0].daysRented);
        const devolution = dayjs(dayjs().format('YYYY-MM-DD'))
        const rent = rental.rows[0].rentDate
        const daysLate = devolution.diff(dayjs(rent), "day")
        
        const delayFee = daysLate*priceToPayDay

       await connectionDB.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;',
        [returnDateSet, delayFee, id]
        ); 
        res.sendStatus(200);
        
        }
    } catch (err){
        res.status(500).send(err.message);
        
    }
}

export async function deleteRentals(req, res){
    const {id} = req.params;
    try{
        const returnDateObj = await connectionDB.query('SELECT "returnDate" FROM rentals WHERE id=$1;', [id]);
        const {returnDate} = returnDateObj.rows[0]

        if (returnDate !== null){
            return res.sendStatus(400)
        } else{
        
        await connectionDB.query("DELETE FROM rentals WHERE id=$1;", [id]);
        res.sendStatus(200);
        }
    } catch (err){
        res.status(500).send(err.message);
    }
}