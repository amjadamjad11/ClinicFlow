const Patient = require("../models/Patient");
// Patient → gives us access to the patient collection.

const Doctor = require("../models/Doctor");
// Doctor → gives us access to the doctor collection.

const Appointment = require("../models/Appointment");
// Appointment → gives us appointment information.

const Billing = require("../models/Billing");
// Billing → gives us billing and revenue information.


const getDashboardSummary = async (req, res) => {
  // async → allows database operations to use await.

  try {
    const today = new Date();
    // Gets the current server date and time.


    // --------------------------------------------------
    // TODAY DATE RANGE
    // --------------------------------------------------

    const startOfDay = new Date(today);
    // Creates a separate date object for the beginning of today.

    startOfDay.setHours(0, 0, 0, 0);
    // Sets today's time to midnight.


    const endOfDay = new Date(today);
    // Creates a separate date object for tomorrow's boundary.

    endOfDay.setDate(endOfDay.getDate() + 1);
    // Moves the date forward by one day.

    endOfDay.setHours(0, 0, 0, 0);
    // Sets the boundary to midnight.


    // --------------------------------------------------
    // CURRENT MONTH DATE RANGE
    // --------------------------------------------------

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    // Creates the first day of the current month.


    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    // Creates the first day of the next month.


    // --------------------------------------------------
    // MAIN DASHBOARD COUNTS
    // --------------------------------------------------

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      scheduledAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingBills,
      paidBills,
      cancelledBills,
      paidBillingRecords,
      monthlyAppointments,
      monthlyCompletedAppointments,
      monthlyCancelledAppointments,
      monthlyPaidBills,
      monthlyPaidBillingRecords,
    ] = await Promise.all([
      // Promise.all() → runs independent database queries concurrently.


      Patient.countDocuments(),
      // Counts all patients.


      Doctor.countDocuments(),
      // Counts all doctors.


      Appointment.countDocuments(),
      // Counts all appointments.


      Appointment.countDocuments({
        appointmentDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }),
      // Counts appointments scheduled today.


      Appointment.countDocuments({
        status: "Scheduled",
      }),
      // Counts scheduled appointments.


      Appointment.countDocuments({
        status: "Confirmed",
      }),
      // Counts confirmed appointments.


      Appointment.countDocuments({
        status: "Completed",
      }),
      // Counts completed appointments.


      Appointment.countDocuments({
        status: "Cancelled",
      }),
      // Counts cancelled appointments.


      Billing.countDocuments({
        paymentStatus: "Pending",
      }),
      // Counts pending bills.


      Billing.countDocuments({
        paymentStatus: "Paid",
      }),
      // Counts paid bills.


      Billing.countDocuments({
        paymentStatus: "Cancelled",
      }),
      // Counts cancelled billing records.


      Billing.find({
        paymentStatus: "Paid",
      }).select("totalAmount"),
      // Gets totalAmount from paid billing records.


      Appointment.countDocuments({
        appointmentDate: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      }),
      // Counts appointments during the current month.


      Appointment.countDocuments({
        appointmentDate: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
        status: "Completed",
      }),
      // Counts completed appointments this month.


      Appointment.countDocuments({
        appointmentDate: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
        status: "Cancelled",
      }),
      // Counts cancelled appointments this month.


      Billing.countDocuments({
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
        paymentStatus: "Paid",
      }),
      // Counts paid bills created this month.


      Billing.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
        paymentStatus: "Paid",
      }).select("totalAmount"),
      // Gets monthly paid billing amounts.
    ]);


    // --------------------------------------------------
    // TOTAL REVENUE
    // --------------------------------------------------

    const totalRevenue = Array.isArray(paidBillingRecords)
      ? paidBillingRecords.reduce(
          (total, billing) =>
            total + Number(billing.totalAmount || 0),
          0
        )
      : 0;
    // Adds all paid billing amounts.


    // --------------------------------------------------
    // MONTHLY REVENUE
    // --------------------------------------------------

    const monthlyRevenue = Array.isArray(monthlyPaidBillingRecords)
      ? monthlyPaidBillingRecords.reduce(
          (total, billing) =>
            total + Number(billing.totalAmount || 0),
          0
        )
      : 0;
    // Adds all paid billing amounts created this month.


    // --------------------------------------------------
    // TODAY'S APPOINTMENTS
    // --------------------------------------------------

    const todaysAppointmentRecords = await Appointment.find({
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .sort({ appointmentDate: 1 })
      .populate("patient", "name phone")
      .populate("doctor", "name specialization");
    // Gets today's appointments with patient and doctor information.


    // --------------------------------------------------
    // UPCOMING APPOINTMENTS
    // --------------------------------------------------

    const upcomingAppointments = await Appointment.find({
      appointmentDate: {
        $gte: endOfDay,
      },
      status: {
        $ne: "Cancelled",
      },
    })
      .sort({ appointmentDate: 1 })
      .limit(5)
      .populate("patient", "name phone")
      .populate("doctor", "name specialization");
    // Gets the next 5 non-cancelled appointments.


    // --------------------------------------------------
    // RECENT APPOINTMENTS
    // --------------------------------------------------

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patient", "name phone")
      .populate("doctor", "name specialization");
    // Gets the 5 most recently created appointments.


    // --------------------------------------------------
    // DOCTOR-WISE APPOINTMENT STATISTICS
    // --------------------------------------------------

    const doctorStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor",
          appointmentCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          appointmentCount: -1,
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
        // $unwind → converts the doctor array from $lookup into one object.
      },
      {
        $project: {
          _id: 0,
          doctor: {
            _id: "$doctor._id",
            name: "$doctor.name",
            specialization: "$doctor.specialization",
          },
          appointmentCount: 1,
        },
      },
    ]);
    // aggregate() → performs database-side grouping and calculations.


    // --------------------------------------------------
    // SEND DASHBOARD RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      status: "success",

      data: {

        patients: {
          total: totalPatients,
        },


        doctors: {
          total: totalDoctors,
        },


        appointments: {
          total: totalAppointments,

          today: todayAppointments,

          completed: completedAppointments,

          cancelled: cancelledAppointments,

          todayList: todaysAppointmentRecords,

          upcoming: upcomingAppointments,

          recent: recentAppointments,
        },


        appointmentStats: {
          Scheduled: scheduledAppointments,

          Confirmed: confirmedAppointments,

          Completed: completedAppointments,

          Cancelled: cancelledAppointments,
        },


        billing: {
          pending: pendingBills,

          paid: paidBills,

          totalRevenue,
        },


        billingStats: {
          Pending: pendingBills,

          Paid: paidBills,

          Cancelled: cancelledBills,
        },


        monthlyStats: {
          appointments: monthlyAppointments,

          completed: monthlyCompletedAppointments,

          cancelled: monthlyCancelledAppointments,

          paidBills: monthlyPaidBills,

          revenue: monthlyRevenue,
        },


        doctorStats,
        // Adds doctor-wise appointment statistics to the dashboard.
      },
    });

  } catch (error) {
    // Handles unexpected database or server errors.

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports = {
  getDashboardSummary,
  // Exports the controller for dashboardRoutes.js.
};