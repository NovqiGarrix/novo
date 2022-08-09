/**
 * To make this things work, you have to define your DATABASE_URL in your .env file.
 */
import { novo } from '../mod.ts';
import MovieModel from './models/movie.model.ts';

const avengerEndGame = await MovieModel.findOne({ slug: "avg-endgame" });
console.log(`-- ${avengerEndGame?.title} --`);
console.log(avengerEndGame);

/** Disconnect from database.
 * NOTE: This action is required.
 */
await novo.disconnect();