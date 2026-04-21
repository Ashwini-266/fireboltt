// const PDFDocument = require("pdfkit");
// const fs = require("fs");

// const generateInvoice = (order, filePath) => {
//   const doc = new PDFDocument({ margin: 40 });

//   doc.pipe(fs.createWriteStream(filePath));

//   // Title
//   doc.fontSize(20).text("INVOICE", { align: "center" });
//   doc.moveDown();

//   // Order Info
//   doc.fontSize(12).text(`Order ID: ${order._id}`);
//   doc.text(`Customer: ${order.userName}`);
//   doc.text(`Email: ${order.email}`);
//   doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
//   doc.text(`Address: ${order.address}`);
//   doc.moveDown();

//   // Table Header
//   doc.text("--------------------------------------------------");
//   doc.text("Product | Qty | Price | GST | Total");
//   doc.text("--------------------------------------------------");

//   let subtotal = 0;
//   let totalGST = 0;

//   order.products.forEach((item) => {
//     const base = item.price * item.quantity;
//     const gstAmount = item.gstAmount;

//     subtotal += base;
//     totalGST += gstAmount;

//     doc.text(
//       `${item.title} | ${item.quantity} | ₹${item.price} | ${item.gst}% | ₹${(base + gstAmount).toFixed(2)}`
//     );
//   });

//   doc.moveDown();

//   // Summary
//   doc.text("--------------------------------------------------");
//   doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`);
//   doc.text(`Total GST: ₹${totalGST.toFixed(2)}`);
//   doc.text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`);
//   doc.text("--------------------------------------------------");

//   doc.end();
// };

// module.exports = generateInvoice;

const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Title
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.userName}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    // Table Header
    doc.text("--------------------------------------------------");
    doc.text("Product | Qty | Price | GST | Total");
    doc.text("--------------------------------------------------");

    let subtotal = 0;
    let totalGST = 0;

    order.products.forEach((item) => {
      const base = item.price * item.quantity;
      const gstAmount = item.gstAmount;

      subtotal += base;
      totalGST += gstAmount;

      doc.text(
        `${item.title} | ${item.quantity} | ₹${item.price} | ${item.gst}% | ₹${(base + gstAmount).toFixed(2)}`
      );
    });

    doc.moveDown();

    // Summary
    doc.text("--------------------------------------------------");
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`);
    doc.text(`Total GST: ₹${totalGST.toFixed(2)}`);
    doc.text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`);
    doc.text("--------------------------------------------------");

    doc.end();

    // 🔥 IMPORTANT PART (WAIT FOR FILE)
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

module.exports = generateInvoice;