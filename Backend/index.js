const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const UserModel=require("./models/Users")
const ProductModel=require("./models/Products")
const CartModel = require("./models/Cart");
const multer = require("multer");

const OrderModel = require("./models/Orders");



require("dotenv").config();

const generateInvoice = require("./utils/generateInvoice");
const path = require("path");

const sgMail = require("@sendgrid/mail");
console.log("API KEY:", process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderEmail = async (order, invoicePath) => {
  const fs = require("fs");

  const msg = {
    to: order.email,
    from: "ashwinigowda682003@gmail.com", // must be verified
    subject: "Order Placed Successfully",
    html: `
      <h2>Order Confirmed</h2>
      <p>Hello ${order.userName},</p>
      <p>Your order has been placed successfully.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>

      <br/>
      <p>Thank you for shopping with us </p>
    `,
    attachments: [
      {
        content: fs.readFileSync(invoicePath).toString("base64"),
        filename: `invoice_${order._id}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);
  fs.unlinkSync(invoicePath);
};


const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
  },
});

const upload = multer({ storage });

const app=express()
app.use(express.json())
app.use(cors())
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));


const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//login
app.post('/login',(req,res)=>{
    const{email,password}=req.body;
    UserModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json({
                    status:"success",
                    role:user.role,
                    user:user
                    
                })
            }else{
                res.json("wrong password")
            }
        }else{
            res.json("no user found")
        }
    })
    .catch(err => res.json(err))
})

//register
app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => {
            res.json({ message: "User registered successfully", user });
        })
        .catch(err => res.json(err));
});


const otpStore = {};

// Request OTP
app.post("/reqOTP", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp: generatedOTP,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  const mailOptions = {
    from: "ashwinigowda682003@gmail.com",
    to: email,
    subject: "Your OTP for Registering on Fireboltt",
    html: `<p>Your OTP is <b>${generatedOTP}</b>. It is valid for 5 minutes.</p>`,
  };
  try {
    await sgMail.send(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verifyOTP", (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore[email];
  if (!storedData) {
    return res.status(400).json({ message: "OTP not requested" });
  }
  if (Date.now() > storedData.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }
  if (storedData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
});


//adding product
app.post('/products', upload.single("image"), (req,res)=>{
  console.log("BODY:", req.body);
    const productDetail = {
        title: req.body.title,
        price: req.body.price,
        quantity: req.body.quantity,
        description:req.body.description,
        rating: req.body.rating,
        imageUpload: req.file.path,
        category: req.body.category,
        gst: Number(req.body.gst)

    };
    
    ProductModel.create(productDetail)
    .then(product => res.json(product))
    .catch(err => res.json(err));
})

// get products with seach and filter
app.get('/products', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
  }
    const products = await ProductModel.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//geting single product for edit page
app.get('/products/:id', async(req,res)=>{
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }catch(err){
        console.log(err);
        res.json(err);
    }
});

//update product
app.put('/products/:id', upload.single("image"), async(req,res)=>
    {
        try{
            const {title,price,description,rating,category,quantity}=req.body;
            const updateData={
                title,
                price,
                description,
                rating,
                category,
                quantity,
                gst: Number(gst)
            };
            if(req.file){
  updateData.imageUpload = req.file.path;
}
            const updated=await ProductModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new:true,}
            );
            res.json(updated);
        }catch(err){
            console.log(err);
            res.json(err);
        }
    });

//delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json("Product and image deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//storing data in mongodb->cart
app.post("/cart", async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body; 
    const existing = await CartModel.findOne({ productId, userId }); 
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }
    const newItem = await CartModel.create({
      productId,
      quantity,
      userId 
    });
    res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//cart update
app.put("/cart/:id", async (req, res) => {
  try {
    const updated = await CartModel.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});


//fetch by category
app.get("/products/category/:category", async (req, res) => {
  try {
    const { search, price } = req.query; 
    const category = req.params.category;

    let query = {
      category: category
    };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }
    if (price) {
      query.price = { $lte: Number(price) }; 
    }

    const products = await ProductModel.find(query);
    res.json(products);

  } catch (err) {
    res.status(500).json(err);
  }
});

//order placement
app.post("/orders", async (req, res) => {
  try {
    const order = await OrderModel.create(req.body);
    res.json(order);
    (async () => {
      try {
        const invoicePath = path.join(
          __dirname,
          `invoice_${order._id}.pdf`
        );

        await generateInvoice(order, invoicePath);

        await sendOrderEmail(order, invoicePath);

      } catch (err) {
        console.error("FULL EMAIL ERROR:", err.response?.body || err.message);
      }
    })();

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update status
app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    let subject = "";
    let message = "";

    if (req.body.status === "Shipped") {
      subject = "Your Order has been Shipped";
      message = `
        <h2>Order Shipped</h2>
        <p>Hello ${updated.userName},</p>
        <p>Your order has been shipped successfully.</p>
        <p><strong>Order ID:</strong> ${updated._id}</p>
        <p>It will reach you soon</p>
      `;
    }
    if (req.body.status === "Delivered") {
      subject = "Your Order has been Delivered";
      message = `
        <h2>Order Delivered</h2>
        <p>Hello ${updated.userName},</p>
        <p>Your order has been delivered successfully.</p>
        <p><strong>Order ID:</strong> ${updated._id}</p>
        <p>Thank you for shopping with us</p>
      `;
    }

    if (subject && message) {
      await sgMail.send({
  to: updated.email,
  from: "ashwinigowda682003@gmail.com", 
  subject: subject,
  html: message,
});
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json("Order deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await OrderModel
      .find({ userId: req.params.userId })   
      .populate("products.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//empty cart once order placed
app.delete("/cart/:userId", async (req, res) => {
  try {
    await CartModel.deleteMany({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete single item from cart
app.delete("/cart/item/:id", async (req, res) => {
  try {
    console.log("Deleting item:", req.params.id);

    await CartModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//get cart items
app.get("/cart/:userId", async (req, res) => {
  try {
    const items = await CartModel
      .find({ userId: req.params.userId })
      .populate("productId");

    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/create-razorpay-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: "order_" + Date.now(),   
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Razorpay Error:", err); 
    res.status(500).json({
      message: "Razorpay order creation failed",
      error: err.message,
    });
  }
});

app.post("/address", async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.json(savedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/admin/stats", async (req, res) => {
  try {
    // 🔹 Fetch data
    const orders = await OrderModel.find();
    const users = await UserModel.find();

    // 🔹 TOTAL COUNTS
    const totalOrders = orders.length;
    const totalUsers = users.length;

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const salesByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
    });
    const usersByDate = {};
    users.forEach(user => {
      const date = new Date(user.createdAt).toLocaleDateString();
      usersByDate[date] = (usersByDate[date] || 0) + 1;
    });
    const ordersByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });
    res.json({
      totalOrders,
      totalUsers,
      totalSales,
      salesByDate,
      usersByDate,
      ordersByDate
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

