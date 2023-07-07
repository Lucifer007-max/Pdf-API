const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const pdfImgConvert = require('pdf-img-convert');

async function mergePDFs(pdfFiles) {
    const mergedPdf = await PDFDocument.create();
  
    for (const file of pdfFiles) {
      const pdfBytes = await fs.promises.readFile(file.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    return mergedPdf;
}
async function splitPDF(pdfBuffer, pageNumbers) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const outputFolder = path.join('uploads');
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const outputFilePaths = [];

  for (const pageNumber of pageNumbers) {
    if (pageNumber >= 1 && pageNumber <= pdfDoc.getPageCount()) {
      const newPDF = await PDFDocument.create();
      const [copiedPage] = await newPDF.copyPages(pdfDoc, [pageNumber - 1]);
      newPDF.addPage(copiedPage);

      const outputFileName = `page_${pageNumber}.pdf`;
      const outputFilePath = path.join(outputFolder, outputFileName);
      const pdfBytes = await newPDF.save();

      fs.writeFileSync(outputFilePath, pdfBytes);
      outputFilePaths.push(outputFilePath);
    } else {
      console.log(`Invalid page number: ${pageNumber}`);
    }
  }

  return outputFilePaths;
};
async function convertHTMLToPDF(html, outputFolderPath) {
  try {
    if (!html) {
      throw new Error('HTML content is required');
    }

    // Launch Puppeteer headless browser
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Set the page content to the provided HTML
    await page.setContent(html);

    // Generate PDF from the HTML
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Close the browser
    await browser.close();

    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    // Generate a unique filename for the PDF
    const timestamp = Date.now();
    const outputFilePath = path.join(outputFolderPath, `output_${timestamp}.pdf`);

    // Write the PDF to the output folder
    fs.writeFileSync(outputFilePath, pdfBuffer);

    return outputFilePath;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to convert HTML to PDF');
  }
}
async function convertPDFToJPG(pdfBuffer) {
  try {
    // Convert the PDF buffer to JPG
    const jpgBuffer = await pdfImgConvert.convert(pdfBuffer, 'jpeg', 300);

    // Optionally, save the JPG to the 'uploads' folder
    const timestamp = Date.now();
    const outputFilePath = `uploads/converted_${timestamp}.jpg`;
    fs.writeFileSync(outputFilePath, jpgBuffer);

    return jpgBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to convert PDF to JPG');
  }
}
async function  convertToPDF(imageFiles) {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const imageFile of imageFiles) {
      const image = await pdfDoc.embedJpg(fs.readFileSync(imageFile.path));
      const page = pdfDoc.addPage([image.width, image.height]);
      const pageDrawWidth = page.getWidth();
      const pageDrawHeight = image.height * (pageDrawWidth / image.width);

      page.drawImage(image, {
        x: 0,
        y: page.getHeight() - pageDrawHeight,
        width: pageDrawWidth,
        height: pageDrawHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.log(error.message)
    throw new Error('Failed to convert JPG to PDF');
  }
}




const PdfParse = require('pdf-parse');
async function convertToWord (pdfFile)  {
  try {
    const pdfData = await fs.promises.readFile(pdfFile.path);

    // Extract text from PDF using pdf-parse
    const PdfParser = new PdfParse(pdfData);
    PdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
    PdfParser.parseBuffer(pdfData);

    return PdfParser.getRawTextContent();
  } catch (error) {
    console.error(error.message);
    throw new Error('Failed to convert PDF to Word');
  }
};
const NodeWebcam = require('node-webcam');
async function generatePDF () {
  try {
    // Set up the webcam
    const Webcam = NodeWebcam.create();
    const captureOptions = {
      output: 'png',
      callbackReturn: 'buffer',
    };

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Capture images and add them to the PDF
    for (let i = 0; i < 5; i++) {
      const imageBuffer = await captureImage(Webcam, captureOptions);
      const image = await pdfDoc.embedPng(imageBuffer);
      page.drawImage(image, { x: 0, y: 0, width: 612, height: 792 });
      page.addNewLine();
    }

    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  } catch (error) {
    // console.error(error);
    console.log(">>" ,  error)
    throw new Error('Failed to generate PDF');
  }
};
function captureImage(Webcam, options) {
  return new Promise((resolve, reject) => {
    Webcam.capture('', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    }, options);
  });
}






module.exports = { 
  mergePDFs,
  splitPDF,
  // watermarkPDF,
  convertHTMLToPDF,
  // protectPDFWithPassword,
  // convertPDFToJPG,
  // convertToWord,
  generatePDF,
  convertToPDF
};