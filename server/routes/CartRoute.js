import mongoose from "mongoose";
import express from "express";

import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartcontroller.js";

const cartRouter=  express.Router();

cartRouter.post('/update',authUser,updateCart);

export default cartRouter
