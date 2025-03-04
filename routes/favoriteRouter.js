const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route("/").options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .populate("user")
      .populate("dishes")
      .then((favorites) => {
          if (favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
          } else {
            err = new Error("No favorites found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err)
      })
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .populate('user')
      .populate('dishes')
      .then((favorite) => {
          if (favorite) {
            for (let i = req.body.length - 1; i >= 0; i--) {
              if (!favorite.dishes.includes(req.body[i])) {
                favorite.dishes.push(req.body[i]._id);
              }
            }
            favorite.save().then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              }, (err) => next(err))
              .catch((err) => next(err))
          } else {
            Favorites.create({
              user: req.user,
              dishes: req.body
            }).then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json")
              res.json(favorite)
            }, (err) => next(err)).catch((err) => next(err))
          }
        },
        (err) => next(err)
      ).catch((err) => next(err))


  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({
        user: req.user._id
      }).then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err))
  })

favoriteRouter.route("/:dishId").options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .populate('user')
      .populate('dishes')
      .then((favorite) => {
        if (favorite) {
          if (favorite.dishes.indexOf(req.params.dishId) === -1) {
            favorite.dishes.push(req.params.dishId)
            favorite.save()
              .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              }, (err) => next(err))
          }
        } else {
          Favorites.create({
              user: req.user._id,
              dishes: [req.params.dishId]
            })
            .then((favorite) => {
              console.log('Favorite Created ', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            }, (err) => next(err))
        }
      })
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .then((favorite) => {
          if (favorite) {
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
              favorite.dishes.splice(index, 1);
              favorite.save()
                .then((favorite) => {
                  console.log('Favorite Deleted ', favorite);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                }, (err) => next(err));
            } else {
              err = new Error('Dish ' + req.params.dishId + ' not found');
              err.status = 404;
              return next(err);
            }
          } else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = favoriteRouter