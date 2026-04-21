// // const PDFDocument = require("pdfkit");
// // const fs = require("fs");

// // const generateInvoice = (order, filePath) => {
// //   const doc = new PDFDocument({ margin: 40 });

// //   doc.pipe(fs.createWriteStream(filePath));

// //   // Title
// //   doc.fontSize(20).text("INVOICE", { align: "center" });
// //   doc.moveDown();

// //   // Order Info
// //   doc.fontSize(12).text(`Order ID: ${order._id}`);
// //   doc.text(`Customer: ${order.userName}`);
// //   doc.text(`Email: ${order.email}`);
// //   doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
// //   doc.text(`Address: ${order.address}`);
// //   doc.moveDown();

// //   // Table Header
// //   doc.text("--------------------------------------------------");
// //   doc.text("Product | Qty | Price | GST | Total");
// //   doc.text("--------------------------------------------------");

// //   let subtotal = 0;
// //   let totalGST = 0;

// //   order.products.forEach((item) => {
// //     const base = item.price * item.quantity;
// //     const gstAmount = item.gstAmount;

// //     subtotal += base;
// //     totalGST += gstAmount;

// //     doc.text(
// //       `${item.title} | ${item.quantity} | ₹${item.price} | ${item.gst}% | ₹${(base + gstAmount).toFixed(2)}`
// //     );
// //   });

// //   doc.moveDown();

// //   // Summary
// //   doc.text("--------------------------------------------------");
// //   doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`);
// //   doc.text(`Total GST: ₹${totalGST.toFixed(2)}`);
// //   doc.text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`);
// //   doc.text("--------------------------------------------------");

// //   doc.end();
// // };

// // module.exports = generateInvoice;

// const PDFDocument = require("pdfkit");
// const fs = require("fs");

// const generateInvoice = (order, filePath) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 40 });
//     const stream = fs.createWriteStream(filePath);

//     doc.pipe(stream);

//     // Title
//     doc.fontSize(20).text("INVOICE", { align: "center" });
//     doc.moveDown();

//     // Order Info
//     doc.fontSize(12).text(`Order ID: ${order._id}`);
//     doc.text(`Customer: ${order.userName}`);
//     doc.text(`Email: ${order.email}`);
//     doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
//     doc.text(`Address: ${order.address}`);
//     doc.moveDown();

//     // Table Header
//     doc.text("--------------------------------------------------");
//     doc.text("Product | Qty | Price | GST | Total");
//     doc.text("--------------------------------------------------");

//     let subtotal = 0;
//     let totalGST = 0;

//     order.products.forEach((item) => {
//       const base = item.price * item.quantity;
//       const gstAmount = item.gstAmount;

//       subtotal += base;
//       totalGST += gstAmount;

//       doc.text(
//         `${item.title} | ${item.quantity} | ₹${item.price} | ${item.gst}% | ₹${(base + gstAmount).toFixed(2)}`
//       );
//     });

//     doc.moveDown();

//     // Summary
//     doc.text("--------------------------------------------------");
//     doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`);
//     doc.text(`Total GST: ₹${totalGST.toFixed(2)}`);
//     doc.text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`);
//     doc.text("--------------------------------------------------");

//     doc.end();

//     // 🔥 IMPORTANT PART (WAIT FOR FILE)
//     stream.on("finish", () => resolve());
//     stream.on("error", (err) => reject(err));
//   });
// };

// module.exports = generateInvoice;

const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ===== TITLE =====
    doc
      .fontSize(20)
      .text("TAX INVOICE", { align: "center" })
      .moveDown(1.5);

    // ===== COMPANY =====
    doc
      .fontSize(12)
      .text("Your Company Name", { align: "center" })
      .text("Mangalore, Karnataka", { align: "center" })
      .moveDown();

    // ===== CUSTOMER DETAILS =====
    doc.fontSize(11);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.userName}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    // ===== TABLE HEADER =====
    doc
      .fontSize(12)
      .text("-------------------------------------------------------------")
      .text("Product      Qty      Price      GST%      GST Amt      Total")
      .text("-------------------------------------------------------------");

    let subtotal = 0;
    let totalGST = 0;

    // ===== PRODUCTS =====
    order.products.forEach((item) => {
      const base = item.price * item.quantity;
      const gstAmt = item.gstAmount || 0;

      subtotal += base;
      totalGST += gstAmt;

      doc.text(
        `${item.title.padEnd(12)} ${String(item.quantity).padEnd(8)} ₹${String(item.price).padEnd(8)} ${String(item.gst).padEnd(8)} ₹${gstAmt.toFixed(2).padEnd(10)} ₹${(base + gstAmt).toFixed(2)}`
      );
    });

    doc.moveDown();

    // ===== TOTAL SECTION =====
    doc.text("-------------------------------------------------------------");

    doc
      .fontSize(12)
      .text(`Subtotal: ₹${subtotal.toFixed(2)}`, { align: "right" })
      .text(`Total GST: ₹${totalGST.toFixed(2)}`, { align: "right" })
      .text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`, {
        align: "right",
      });

    doc.text("-------------------------------------------------------------");

    doc.moveDown(2);

    // ===== FOOTER =====
    doc
      .fontSize(10)
      .text("Thank you for shopping with us!", { align: "center" });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};

module.exports = generateInvoice;