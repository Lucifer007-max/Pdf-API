  // // const express = require('express');
  // // const multer = require('multer');
  // // const { PDFDocument, rgb } = require('pdf-lib');
  // // const fs = require('fs');
    
  // // const app = express();
  // // const upload = multer({ dest: 'uploads/' });

  // // app.use(express.json());
  // // app.use(express.urlencoded({ extended: true }));

  // // app.post('/jpg-to-pdf', upload.array('images'), async (req, res) => {
  // //   try {
  // //     const pdfDoc = await PDFDocument.create();

  // //     for (const imageFile of req.files) {
  // //       const image = await pdfDoc.embedJpg(fs.readFileSync(imageFile.path));
  // //       const page = pdfDoc.addPage([image.width, image.height]);
  // //       const pageDrawWidth = page.getWidth();
  // //       const pageDrawHeight = image.height * (pageDrawWidth / image.width);

  // //       page.drawImage(image, {
  // //         x: 0,
  // //         y: page.getHeight() - pageDrawHeight,
  // //         width: pageDrawWidth,
  // //         height: pageDrawHeight,
  // //       });
  // //     }

  // //     const pdfBytes = await pdfDoc.save();
  // //     const outputFilePath = 'output.pdf';
  // //     fs.writeFileSync(outputFilePath, pdfBytes);

  // //     res.download(outputFilePath, 'output.pdf', (err) => {
  // //       if (err) {
  // //         console.error('Error while sending the PDF:', err);
  // //       }
  // //       fs.unlinkSync(outputFilePath); // Remove the temporary PDF file after sending
  // //     });
  // //   } catch (error) {
  // //     console.error('Failed to convert JPG to PDF:', error);
  // //     res.status(500).send('Failed to convert JPG to PDF.');
  // //   }
  // // });

  // // const port = 3000;
  // // app.listen(port, () => {
  // //   console.log(`Server is running on http://localhost:${port}`);
  // // });



  // const express = require('express');
  // const multer = require('multer');
  // const { PDFDocument, rgb } = require('pdf-lib');
  // const fs = require('fs');
  // const path = require('path'); // Import the 'path' module

  // const app = express();
  // const upload = multer({ dest: 'uploads/' });

  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  // app.post('/jpg-to-pdf', upload.array('images'), async (req, res) => {
  //   try {
  //     const pdfDoc = await PDFDocument.create();

  //     for (const imageFile of req.files) {
  //       const image = await pdfDoc.embedJpg(fs.readFileSync(imageFile.path));
  //       const page = pdfDoc.addPage([image.width, image.height]);
  //       const pageDrawWidth = page.getWidth();
  //       const pageDrawHeight = image.height * (pageDrawWidth / image.width);

  //       page.drawImage(image, {
  //         x: 0,
  //         y: page.getHeight() - pageDrawHeight,
  //         width: pageDrawWidth,
  //         height: pageDrawHeight,
  //       });
  //     }

  //     const pdfBytes = await pdfDoc.save();
  //     const outputFilePath = path.join('uploads', 'output.pdf'); // Update the output file path

  //     fs.writeFileSync(outputFilePath, pdfBytes);

  //     res.download(outputFilePath, 'output.pdf', (err) => {
  //       if (err) {
  //         console.error('Error while sending the PDF:', err);
  //       }
  //       fs.unlinkSync(outputFilePath); // Remove the temporary PDF file after sending
  //     });
  //   } catch (error) {
  //     console.error('Failed to convert JPG to PDF:', error);
  //     res.status(500).send('Failed to convert JPG to PDF.');
  //   }
  // });

  // const port = 3000;
  // app.listen(port, () => {
  //   console.log(`Server is running on http://localhost:${port}`);
  // });




  const express = require('express');
  const multer = require('multer');
  const { PDFDocument, rgb } = require('pdf-lib');
  const fs = require('fs');
  const path = require('path');

  const app = express();
  const upload = multer({ dest: 'uploads/' });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/jpg-to-pdf', upload.array('images'), async (req, res) => {
    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageFile of req.files) {
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
      const outputFilePath = path.join(__dirname, 'uploads', 'output.pdf');
      fs.writeFileSync(outputFilePath, pdfBytes);

      res.download(outputFilePath, 'output.pdf', (err) => {
        if (err) {
          console.error('Error while sending the PDF:', err);
        }
        fs.unlinkSync(outputFilePath); // Remove the temporary PDF file after sending
      });
    } catch (error) {
      console.error('Failed to convert JPG to PDF:', error);
      res.status(500).send('Failed to convert JPG to PDF.');
    }
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
