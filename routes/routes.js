var express = require('express');
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();


// Payment route

// Get all Payment
router.route('/payment/getAll').get((req, res) => {
    try {
        prisma.payment.findMany({
            include: {
                user: true,
                course:true,
                enrollment: true
            }
        }).then((data) => {
            res.status(200)
                .json({ status: true, message: "Payments retrieved successful", data, code: "200" });
        })

    } catch (error) {
        console.error("Error finding payment:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
    }
})


// Create Payment
router.route('/payment/create').post((req, res) => {
    const data = {
        pay_status: req.body.pay_status,
        amount: req.body.amount,
        p_type: req.body.p_type,
        userid: req.body.userid,
        courseId: req.body.courseId,
        enrollmentId: req.body.enrollmentId,
    }
    prisma.payment.create({ data })
        .then((data) => {
            if (data) {
                res.status(201).json({ status: true, message: "Payment created successfully", data, code: "201" });
            } else {
                res.status(400).json({ status: false, message: "Error creating payment", code: "400" });
            }
            console.log("Payment Created", data);
        })
        .catch(error => {
            console.error("Error occurred:", error);
            res.status(500).json({ status: false, message: "An unexpected error occurred" });
        });
});

// Payment update
router.route('/payment/update/:id').patch((req, res) => {
    const _id = req.params.id
    const data = {
        pay_status: req.body.pay_status,
        amount: req.body.amount,
        p_type: req.body.p_type,
        userid: req.body.userid,
        courseId: req.body.courseId,
        enrollmentId: req.body.enrollmentId,
    }

    try {
        prisma.payment.update({
            where: {
                id: _id
            },
            data
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Payment Updated Sucessfully", data: data, role: data.Role, code: "200" })
            }
            else {
                res.status(404).json({ status: false, message: "Payment not found", code: "404" })
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: "Error occured while updating", code: "500" })
    }
});


// Paymengt Deletion
router.route('/payment/delete/:id').delete((req, res) => {
    const _id = req.params.id
    try {
        prisma.payment.delete({
            where: {
                id: _id,
            },
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Payment deleted", code: "200" })
            } else {
                res.status(404).json({ status: false, message: "Payment not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while deleting payment", code: "500" });
        console.log("Error while deleting payment", error);
    }
});


module.exports = router;