// const PDFDocument = require("pdfkit");
// const fs = require("fs");

// const generateInvoice = (order, filePath) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 50 });
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);
//     doc
//       .fontSize(20)
//       .text("TAX INVOICE", { align: "center" })
//       .moveDown(1.5);
//     doc
//       .fontSize(12)
//       .text("Fire-Boltt", { align: "center" })
//       .text("Mangalore, Karnataka", { align: "center" })
//       .moveDown();
//     doc.fontSize(11);
//     doc.text(`Order ID: ${order._id}`);
//     doc.text(`Customer: ${order.userName}`);
//     doc.text(`Email: ${order.email}`);
//     doc.text(`Phone: ${order.phone}`);
//     doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
//     doc.text(`Address: ${order.address}`);
//     doc.moveDown();


//     doc
//       .fontSize(12)
//       .text("-------------------------------------------------------------")
//       .text("Product      Qty      Price      GST%      GST Amt      Total")
//       .text("-------------------------------------------------------------");

//     let subtotal = 0;
//     let totalGST = 0;
//     order.products.forEach((item) => {
//       const base = item.price * item.quantity;
//       const gstAmt = item.gstAmount || 0;

//       subtotal += base;
//       totalGST += gstAmt;

//       doc.text(
//         `${item.title.padEnd(12)} ${String(item.quantity).padEnd(8)} ₹${String(item.price).padEnd(8)} ${String(item.gst).padEnd(8)} ₹${gstAmt.toFixed(2).padEnd(10)} ₹${(base + gstAmt).toFixed(2)}`
//       );
//     });

//     doc.moveDown();
//     doc.text("-------------------------------------------------------------");

//     doc
//       .fontSize(12)
//       .text(`Subtotal: ₹${subtotal.toFixed(2)}`, { align: "right" })
//       .text(`Total GST: ₹${totalGST.toFixed(2)}`, { align: "right" })
//       .text(`Final Amount: ₹${(subtotal + totalGST).toFixed(2)}`, {
//         align: "right",
//       });

//     doc.text("-------------------------------------------------------------");

//     doc.moveDown(2);
//     doc
//       .fontSize(10)
//       .text("Thank you for shopping with us!", { align: "center" });

//     doc.end();

//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// };

// module.exports = generateInvoice;


const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===== HEADER =====
    doc
      .fontSize(20)
      .fillColor("#2E7D32")
      .text("FireBoltt", 40, 40);

    doc
      .fontSize(9)
      .fillColor("#000")
      .text("Corporate Office:", 350, 40)
      .text("FireBoltt Pvt Ltd", 350, 55)
      .text("Mangalore, Karnataka, India", 350, 70);

    doc.moveTo(40, 100).lineTo(550, 100).stroke();

    // ===== TITLE =====
    doc
      .fontSize(14)
      .text("OFFICIAL RECEIPT", 40, 110);

    // ===== LEFT DETAILS =====
    doc.fontSize(10);
    doc
      .text(`Invoice #: INV-${order._id}`, 40, 140)
      .text(`Order ID: ${order._id}`, 40, 155)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 40, 170)
      .text(`Payment: ${order.paymentMethod || "COD"}`, 40, 185)
      .text(`Status: ${order.status || "Pending"}`, 40, 200);

    // ===== RIGHT DETAILS =====
    doc
      .text(`Shipping: Standard Delivery`, 300, 140)
      .text(`Estimated: 3-5 Days`, 300, 155)
      .text(`Shipping Cost: Free`, 300, 170)
      .text(`Phone: ${order.phone}`, 300, 185);

    // ===== BILLED TO =====
    doc
      .fontSize(11)
      .text("Billed To:", 40, 230)
      .fontSize(10)
      .text(order.userName, 40, 245)
      .text(order.address, 40, 260, { width: 250 });

    // ===== TABLE HEADER =====
    const tableTop = 310;

    doc
      .fontSize(10)
      .text("Item", 40, tableTop)
      .text("Qty", 250, tableTop)
      .text("Price", 290, tableTop)
      .text("Base", 340, tableTop)
      .text("CGST", 400, tableTop)
      .text("SGST", 460, tableTop)
      .text("Total", 510, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // ===== TABLE DATA =====
    let y = tableTop + 25;
    let subtotal = 0;
    let totalTax = 0;

    order.products.forEach((item) => {
      const base = item.price * item.quantity;
      const cgst = (base * (item.gst || 18)) / 200;
      const sgst = cgst;
      const total = base + cgst + sgst;

      subtotal += base;
      totalTax += cgst + sgst;

      doc
        .fontSize(9)
        .text(item.title, 40, y, { width: 200 })
        .text(item.quantity, 250, y)
        .text(item.price.toFixed(2), 290, y)
        .text(base.toFixed(2), 340, y)
        .text(cgst.toFixed(2), 400, y)
        .text(sgst.toFixed(2), 460, y)
        .text(total.toFixed(2), 510, y);

      y += 20;
    });

    // ===== SUMMARY =====
    const summaryY = y + 20;

    doc
      .fontSize(10)
      .text(`Taxable Subtotal: ₹${subtotal.toFixed(2)}`, 350, summaryY)
      .text(`Total Tax (GST): ₹${totalTax.toFixed(2)}`, 350, summaryY + 15)
      .text(`Shipping: FREE`, 350, summaryY + 30);

    // ===== GRAND TOTAL BOX =====
    doc
      .rect(350, summaryY + 60, 200, 25)
      .fill("#E0E0E0");

    doc
      .fillColor("#000")
      .fontSize(11)
      .text(
        `Grand Total: ₹${(subtotal + totalTax).toFixed(2)}`,
        360,
        summaryY + 67
      );

    // ===== FOOTER =====
    doc
      .fontSize(10)
      .text(
        "Thank you for shopping with FireBoltt!",
        40,
        summaryY + 120,
        { align: "center" }
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};

module.exports = generateInvoice;