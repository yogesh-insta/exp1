var express = require('express');

var routes = function(Parking) {

	var parkingRouter = express.Router();

	parkingRouter.use('/parkings/:parkingId', function(req, res, next) {
		Parking.findById(req.params.parkingId, function(err, parking) {
			if (err) {
				console.log(err);
			} else if (parking) {
				req.parking = parking;
				next();
			} else {
				res.status(404).send('no parking found');
			}
		})
	})
	
		parkingRouter.route('/parkingsjsonp')
		.get(function(req, res) {
			var query = req.query;
			console.log("Query :" + req.query.callback );
			var q = req.query.callback;
			req.query.callback = null
			Parking.find(query, function(err, parkings) {
				if (err) {
					console.log(err);
				} else {
					res.header('Content-type','application/json');
					res.send(q + '('+ JSON.stringify(parkings) + ');');
				}
			})
		})

	parkingRouter.route('/parkings')
		.get(function(req, res) {
					console.log("Bingo ..............");
			var query = req.query;
			Parking.find(query, function(err, parkings) {
				if (err) {
					console.log(err);
				} else {
					res.json(parkings)
				}
			})
		})
		.post(function(req, res) {
			var parking = new Parking(req.body);
			console.log(parking);	

			parking.save();

			res.send(parking);
		});

	parkingRouter.route('/parkings/:parkingId')
		.get(function(req, res) {
			res.json(req.parking);
		})
		.put(function(req, res) {
			req.parking.spaces = req.body.spaces;
			req.parking.save(function(err) {
				if (err) {
					res.status(500).send(err);
				}
			});
			res.json(req.parking);
		})
		.patch(function(req, res) {
			if (req.body._id) {
				delete req.body._id;
			}
			//we shiuld have know variable in request to avoid unwwanted values
			for (var p in req.body) {
				req.parking[p] = req.body[p];
			}

			req.parking.save(function(err) {
				if (err) {
					res.status(500).send(err);
				}
			});

			res.json(req.parking);
		})
		.delete(function(req, res) {
			req.parking.remove(function(err) {
				if (err)
					res.status(500).send(err);
				else
					res.status(204).send("Delete Succeeded");
			});
		});


		//delete all 
		parkingRouter.route('/parking-del').post(function(req, res) {
			Parking.remove({}, function(err){
				if (err) {
                console.log(err)
            	} else {
                	res.send('success');
            	}	
			});
		});


	return parkingRouter;

}

module.exports = routes;